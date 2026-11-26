const { expect, $ } = require('@wdio/globals');
const { TEST_DATA } = require('../testData/pdptestData.js');
const {timeouts,expected,search,labels,formats,searchLocators} = TEST_DATA;
const descContains = (text, instance = 0) =>
    `android=new UiSelector().descriptionContains("${text}").instance(${instance})`;

const descMatches = (regex, instance = 0) =>
    `android=new UiSelector().descriptionMatches("${regex.source}").instance(${instance})`;

const descStartsWith = (text, instance = 0) =>
    `android=new UiSelector().descriptionStartsWith("${text}").instance(${instance})`;

const scrollToDesc = (text) =>
    `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionContains("${text}"))`;

const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const LOCATORS = {
    firstSuggestion: () =>
        descContains(
            `${search.query}, in ${search.suggestionCategory}`
        ),

    // Product card from the search results
    firstProduct: () =>
        descMatches(
            new RegExp(
                `.*${escapeRegex(search.productKeyword)}.*,[ ]*[0-9](?:[.][0-9])?,[ ]*[|].*`,
                'i'
            )
        ),

    productTitle: () =>
        `android=new UiSelector().textContains("${search.productKeyword}")`,

    productPrice: () => descMatches(formats.price),

    productRating: () => descMatches(formats.rating),

    productRatingValue: () =>
        `android=new UiSelector().descriptionMatches("${formats.rating.source}").childSelector(new UiSelector().className("android.widget.TextView").instance(0))`,

    keyHighlights: () => descContains(labels.keyHighlights),

    protectPromiseFee: () => descContains(labels.protectPromiseFee),

    buyNow: () => descStartsWith(labels.buyNow),

    buyWithEmi: () => descStartsWith(labels.buyWithEmi)
};

async function getElement(locatorKey, timeout = timeouts.medium) {
    const element = await $(LOCATORS[locatorKey]());
    await element.waitForDisplayed({ timeout });
    return element;
}

async function getLabel(element) {
    const text = (await element.getText()).trim();

    if (text) {
        return text;
    }

    return ((await element.getAttribute('content-desc')) || '').trim();
}

const toNumber = (value) =>
    Number(String(value).replace(/[^0-9.]/g, ''));

async function findFirstDisplayed(selectors, timeoutEach = timeouts.short) {
    for (const selector of selectors) {
        const element = await $(selector);

        try {
            await element.waitForDisplayed({ timeout: timeoutEach });
            return element;
        } catch (error) {
            // Try the next selector
        }
    }

    throw new Error(
        `None of these locators were displayed:\n${selectors.join('\n')}`
    );
}

// ---------- Product selection ----------

class ProductPage {

    async openProductDetails() {

        // Open search
        const searchEntry = await findFirstDisplayed(
            searchLocators.searchEntry,
            timeouts.medium
        );

        await searchEntry.click();

        const searchInputLocators = Array.isArray(searchLocators.searchInput)
            ? searchLocators.searchInput
            : [searchLocators.searchInput];
        const searchInput = await findFirstDisplayed(searchInputLocators);

        await searchInput.setValue(search.query);

        // Select search suggestion
        const suggestion = await getElement(
            'firstSuggestion',
            timeouts.medium
        );
        const suggestionLabel =
            await suggestion.getAttribute('content-desc');

        console.log(`Suggestion selected: ${suggestionLabel}`);
        await suggestion.click();

        // Find product card
        const productCard = await getElement('firstProduct', timeouts.long);

        // The card label includes a changing status prefix and rating after the title.
        const description =
            await productCard.getAttribute('content-desc');

        console.log('Product card description:', description);

        const keywordStart = description
            .toLowerCase()
            .indexOf(search.productKeyword.toLowerCase());
        const ratingStart = description.search(
            /,\s*\d(?:\.\d)?\s*,\s*\|/
        );

        if (keywordStart < 0 || ratingStart <= keywordStart) {
            throw new Error(
                'Could not extract product title from product card description.'
            );
        }

        const selectedProductTitle = description
            .slice(keywordStart, ratingStart)
            .trim();

        console.log('Selected product title:', selectedProductTitle);

        // Click the selected product
        await productCard.click();

        await getElement('productTitle', timeouts.long);

        return selectedProductTitle;
    }

    // ---------- PDP validations ----------

    async validateProductTitle() {
        const title = await getElement('productTitle');
        const text = await getLabel(title);

        await expect(text.length).toBeGreaterThanOrEqual(
            expected.minTitleLength
        );

        await expect(text.toLowerCase()).toContain(
            search.productKeyword.toLowerCase()
        );

        return text;
    }

    async validatePrice() {
        const element = await getElement('productPrice');
        const label = await getLabel(element);

        console.log('Product Price:', label);

        const match = label.match(formats.price);

        await expect(match).not.toBeNull();

        const price = toNumber(match[1]);

        await expect(Number.isFinite(price)).toBe(true);
        await expect(price).toBeGreaterThan(expected.minPrice);

        return price;
    }

    async validateRating() {
        const element = await getElement('productRating');
        const label = await getLabel(element);

        console.log('Product Rating:', label);

        const match = label.match(formats.rating);

        await expect(match).not.toBeNull();

        const rating = Number(match[1]);

        await expect(rating).toBeGreaterThan(expected.minRating);
        await expect(rating).toBeLessThanOrEqual(expected.maxRating);

        return {
            rating,
            count: match[2]
        };
    }

    async validateProtectPromiseFee() {
        const element = await getElement(
            'protectPromiseFee',
            timeouts.short
        );

        const label = await getLabel(element);
        const match = label.match(formats.protectFee);

        await expect(match).not.toBeNull();
        await expect(toNumber(match[1])).toBeGreaterThan(0);
    }

    async validateBuyNowButton() {
        const button = await getElement('buyNow');

        await expect(button).toBeDisplayed();
        await expect(button).toBeEnabled();
        await expect(await getLabel(button)).toContain(labels.buyNow);
    }

    async validateEmi(price) {
        const element = await getElement('buyWithEmi');
        const label = await getLabel(element);

        const match = label.match(formats.emi);

        await expect(match).not.toBeNull();

        const emi = toNumber(match[1]);

        await expect(emi).toBeGreaterThan(0);
        await expect(emi).toBeLessThan(price);

        return emi;
    }

    async validateKeyHighlights() {
        await $ (scrollToDesc(labels.keyHighlights));

        const element = await getElement(
            'keyHighlights',
            timeouts.short
        );

        await expect(element).toBeDisplayed();
        await expect(await getLabel(element)).toContain(
            labels.keyHighlights
        );
    }

    // ---------- Buy Now action ----------

    async clickBuyNow() {
        const button = await getElement('buyNow', timeouts.long);

        await button.click();

        console.log('Buy Now clicked.');
    }
}

module.exports = ProductPage;
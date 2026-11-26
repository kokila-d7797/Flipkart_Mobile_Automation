
const { expect } = require('@wdio/globals');

const LoginPage = require('../pageobjects/LoginPage');
const ProductPage = require('../pageobjects/ProductPage');

const { TEST_DATA } = require('../testData/pdptestData.js');

const { timeouts, expected, formats } = TEST_DATA;

const loginPage = new LoginPage();
const productPage = new ProductPage();

describe('Flipkart - Product Details Page Tests', function () {

    this.timeout(timeouts.test);

    before(async () => {
    await loginPage.ensureLoggedIn();
    await productPage.openProductDetails();

});

    it('PDP_01 - Verify product details page is opened', async () => {
        const price = await productPage.validatePrice();
        expect(price).toBeGreaterThan(expected.minPrice);
    });

    it('PDP_02 - Verify product title is displayed', async () => {
        const title = await productPage.validateProductTitle();
        expect(title.length).toBeGreaterThanOrEqual(
            expected.minTitleLength
        );
    });

    it('PDP_03 - Verify product price format and value', async () => {
        await productPage.validatePrice();
    });

    it('PDP_04 - Verify product rating and rating count', async () => {
        const { rating, count } = await productPage.validateRating();

        expect(count.length).toBeGreaterThan(0);

        expect(rating).toBeGreaterThan(expected.minRating);
        expect(rating).toBeLessThanOrEqual(expected.maxRating);
    });

    it('PDP_05 - Verify Protect Promise Fee', async () => {
        await productPage.validateProtectPromiseFee();
    });

    it('PDP_06 - Verify Buy Now button is displayed and enabled', async () => {
        await productPage.validateBuyNowButton();
    });

    it('PDP_07 - Verify Buy with EMI amount', async () => {
        const price = await productPage.validatePrice();
        await productPage.validateEmi(price);
    });

    it('PDP_08 - Verify Key Highlights section', async () => {
        await productPage.validateKeyHighlights();
    });

});
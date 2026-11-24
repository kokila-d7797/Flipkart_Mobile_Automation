
const { browser, $, $$ } = require('@wdio/globals');
const { SEARCH_TEST_DATA } = require('../testData/searchTestData');

// Locators
const SEARCH_BOX =
    '//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup[1]';

const SEARCH_INPUT =
    '//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup[3]/android.view.ViewGroup[1]';

const SEARCH_SUGGESTIONS =
    '//android.widget.ScrollView/android.view.ViewGroup';

const SEARCH_RESULT =
    (product) => `android=new UiSelector().textContains("${product}")`;

const NO_RESULTS_MESSAGE =
    'android=new UiSelector().textContains("No results")';


class SearchPage {

    // ---------- Locators ----------

    get searchBox() {
        return $(SEARCH_BOX);
    }

    get searchInput() {
        return $(SEARCH_INPUT);
    }

    get searchSuggestions() {
        return $$(SEARCH_SUGGESTIONS);
    }

    get firstSearchResult() {
        return $(SEARCH_RESULT(SEARCH_TEST_DATA.search.product));
    }

    get noResultsMessage() {
        return $(NO_RESULTS_MESSAGE);
    }


    // ---------- Page Actions ----------

    async openSearchScreen() {
        await this.searchBox.waitForDisplayed({
            timeout: SEARCH_TEST_DATA.timeouts.long
        });

        await this.searchBox.click();

        await this.searchInput.waitForDisplayed({
            timeout: SEARCH_TEST_DATA.timeouts.long
        });

        return this.searchInput;
    }

    async enterSearchText(searchText) {
        await this.searchInput.setValue(searchText);
    }

    async submitSearch() {
        await browser.execute('mobile: performEditorAction', {
            action: 'search'
        });
    }

    async clearSearchText() {
        await this.searchInput.clearValue();
    }

    async getSearchText() {
        return await this.searchInput.getValue();
    }

    async waitForSuggestions() {
        await browser.waitUntil(
            async () => {
                const suggestions = await this.searchSuggestions;
                return suggestions.length > 0;
            },
            {
                timeout: SEARCH_TEST_DATA.timeouts.long,
                timeoutMsg: 'Search suggestions were not displayed'
            }
        );

        const suggestions = await this.searchSuggestions;

        await suggestions[0].waitForDisplayed({
            timeout: SEARCH_TEST_DATA.timeouts.medium
        });

        return suggestions;
    }

    async waitForSearchResult() {
        await this.firstSearchResult.waitForDisplayed({
            timeout: SEARCH_TEST_DATA.timeouts.long
        });

        return await this.firstSearchResult.isDisplayed();
    }

    async verifyNoResultsMessage() {
        await this.noResultsMessage.waitForDisplayed({
            timeout: SEARCH_TEST_DATA.timeouts.long
        });

        return await this.noResultsMessage.isDisplayed();
    }


    // ---------- Navigation ----------

    async goBackToHome() {
        await browser.hideKeyboard().catch(() => {});

        for (
            let attempt = 0;
            attempt < SEARCH_TEST_DATA.navigation.maxBackAttempts;
            attempt++
        ) {
            const isHomeDisplayed = await this.searchBox
                .isDisplayed()
                .catch(() => false);

            if (isHomeDisplayed) {
                return;
            }

            await browser.back();

            await browser.pause(
                SEARCH_TEST_DATA.navigation.backWait
            );
        }

        await browser.activateApp(
            SEARCH_TEST_DATA.appPackage
        );
    }
}

module.exports = new SearchPage();
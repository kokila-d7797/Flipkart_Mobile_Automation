
const { expect } = require('@wdio/globals');

const SearchPage = require('../pageobjects/SearchPage');
const { SEARCH_TEST_DATA } = require('../testData/searchTestData');

describe('Flipkart Search - Mobile App', () => {

    afterEach(async () => {
        await SearchPage.goBackToHome();
    });

    it('TC01 - Verify search box opens the search screen', async () => {

        const input = await SearchPage.openSearchScreen();

        // Assertion: Search input should be displayed
        await expect(input).toBeDisplayed();
    });


    it('TC02 - Verify search suggestions are displayed', async () => {

        await SearchPage.openSearchScreen();

        await SearchPage.enterSearchText(
            SEARCH_TEST_DATA.search.product
        );

        const suggestions = await SearchPage.waitForSuggestions();

        // Assertion 1: Suggestions should be available
        expect(suggestions.length).toBeGreaterThan(0);

        // Assertion 2: First suggestion should be displayed
        await expect(suggestions[0]).toBeDisplayed();
    });


    it('TC03 - Verify search results are displayed', async () => {

        await SearchPage.openSearchScreen();

        await SearchPage.enterSearchText(
            SEARCH_TEST_DATA.search.product
        );

        // Assertion 1: Entered search text should match
        expect(await SearchPage.getSearchText())
            .toContain(SEARCH_TEST_DATA.search.product);

        await SearchPage.submitSearch();

        const isResultDisplayed =
            await SearchPage.waitForSearchResult();

        // Assertion 2: Search result should be displayed
        expect(isResultDisplayed).toBe(true);
    });


    it('TC04 - Verify search text can be cleared', async () => {

        await SearchPage.openSearchScreen();

        await SearchPage.enterSearchText(
            SEARCH_TEST_DATA.search.product
        );

        // Assertion 1: Search text should be entered
        expect(await SearchPage.getSearchText())
            .toBe(SEARCH_TEST_DATA.search.product);

        await SearchPage.clearSearchText();

        // Assertion 2: Search input should be empty
        expect(await SearchPage.getSearchText()).toBe('');
    });


    it('TC05 - Verify no results message for invalid search', async () => {

        await SearchPage.openSearchScreen();

        await SearchPage.enterSearchText(
            SEARCH_TEST_DATA.search.invalidProduct
        );

        // Assertion 1: Invalid search text should be entered
        expect(await SearchPage.getSearchText())
            .toBe(SEARCH_TEST_DATA.search.invalidProduct);

        await SearchPage.submitSearch();

        const isMessageDisplayed =
            await SearchPage.verifyNoResultsMessage();

        // Assertion 2: No results message should be displayed
        expect(isMessageDisplayed).toBe(true);
    });

});

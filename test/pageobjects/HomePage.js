import { LOCATORS } from '../locators/buynowLocators.js';
import { TEST_DATA } from '../testData/buynowTestData.js';

export default class HomePage {

    async searchProduct() {

        const searchBox = LOCATORS.searchBox();

        await searchBox.waitForDisplayed({
            timeout: TEST_DATA.timeouts.long
        });

        await searchBox.click();

        await searchBox.setValue(
            TEST_DATA.search.product
        );

        // Wait for search suggestions/results.
        await browser.pause(2000);

        // Select the first product from search results.
        const firstProduct = LOCATORS.firstProduct();

        await firstProduct.waitForDisplayed({
            timeout: TEST_DATA.timeouts.long
        });

        await firstProduct.click();
    }
}
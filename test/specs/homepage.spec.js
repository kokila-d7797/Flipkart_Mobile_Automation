
import { expect, browser } from '@wdio/globals';
import HomePage from '../pageobjects/HomePage.js';
import { HOME_TEST_DATA } from '../testData/homeTestData.js';

describe('Flipkart Home Page Tests', () => {

    beforeEach(async () => {
        const currentPackage = await browser.getCurrentPackage();

        if (currentPackage !== HOME_TEST_DATA.appPackage) {
            await browser.activateApp(HOME_TEST_DATA.appPackage);
        }

        expect(await HomePage.verifyApplicationLaunched())
            .toBe(true);
    });

    it('HOME_01 - Verify application is launched', async () => {
        expect(await HomePage.verifyApplicationLaunched())
            .toBe(true);
    });

    it('HOME_02 - Verify Flipkart logo is displayed', async () => {
        expect(await HomePage.verifyLogoDisplayed())
            .toBe(true);
    });

    it('HOME_03 - Verify search box is displayed', async () => {
        expect(await HomePage.verifySearchBoxDisplayed())
            .toBe(true);
    });

    it('HOME_04 - Verify category section is displayed', async () => {
        expect(await HomePage.verifyCategorySectionDisplayed())
            .toBe(true);
    });

    it('HOME_05 - Verify address section is displayed', async () => {
        expect(await HomePage.verifyAddressDisplayed())
            .toBe(true);
    });

    it('HOME_06 - Verify bottom navigation is displayed', async () => {
        expect(await HomePage.verifyBottomNavigationDisplayed())
            .toBe(true);
    });

    it('HOME_07 - Verify Home tab is displayed', async () => {
        expect(await HomePage.verifyHomeTabDisplayed())
            .toBe(true);
    });

});
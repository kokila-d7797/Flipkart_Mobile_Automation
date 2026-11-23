
const { expect } = require('@wdio/globals');

const LoginPage = require('../pageobjects/LoginPage');
const ProductPage = require('../pageobjects/ProductPage');
const ConfirmDetailsPage = require('../pageobjects/ConfirmdetailsPage');

const { TEST_DATA } = require('../testData/pdptestData.js');

const loginPage = new LoginPage();
const productPage = new ProductPage();
const confirmDetailsPage = new ConfirmDetailsPage();

const { timeouts } = TEST_DATA;

describe('Flipkart - Buy Now and Order Summary Tests', function () {

    this.timeout(timeouts.test);

    let selectedProductTitle;

    before(async () => {

        // Step 1: Check whether the user is already logged in
        await loginPage.ensureLoggedIn();

        // Step 2: Search for the product and select it
        selectedProductTitle =
            await productPage.openProductDetails();

        console.log(
            'Product selected for Buy Now:',
            selectedProductTitle
        );

        // Step 3: Click Buy Now
        await productPage.clickBuyNow();

    });

    it('BUY_01 - Verify Confirm Details page is displayed', async () => {

        await confirmDetailsPage.validateConfirmDetailsPage();

    });

    it('BUY_02 - Verify selected product title in Order Summary', async () => {

        await confirmDetailsPage.validateProductTitle(
            selectedProductTitle
        );

    });

});

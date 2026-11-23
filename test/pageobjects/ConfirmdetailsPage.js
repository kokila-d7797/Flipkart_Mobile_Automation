
const { expect, $ } = require('@wdio/globals');

class ConfirmDetailsPage {

    async validateProductTitle(productTitle) {

        // Use a meaningful part of the dynamically selected title.
        // This also helps when the app truncates the displayed title.
        const titleToValidate = productTitle.substring(0, 45);

        const safeTitle = titleToValidate.replace(/"/g, '\\"');

        const productTitleLocator =
            `android=new UiSelector().className("android.widget.TextView").textContains("${safeTitle}")`;

        const productTitleElement = $(productTitleLocator);

        await productTitleElement.waitForDisplayed({
            timeout: 15000
        });

        await expect(productTitleElement).toBeDisplayed();

        console.log(
            'Order Summary product title validated:',
            productTitle
        );
    }

    async validateConfirmDetailsPage() {

        // Replace this with the verified Confirm Details page locator
        // from your Appium Inspector.
        const continueButton = $(
            'android=new UiSelector().textContains("Continue")'
        );

        await continueButton.waitForDisplayed({
            timeout: 15000
        });

        await expect(continueButton).toBeDisplayed();
    }
}

module.exports = ConfirmDetailsPage;
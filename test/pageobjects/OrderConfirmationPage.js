const { $, expect } = require('@wdio/globals');
const {ORDER_CONFIRMATION_DATA} = require('../testData/orderConfirmationTestData');

class OrderConfirmationPage {

    get pageTitle() {
        return $('android=new UiSelector().textContains("Confirm Details")');
    }

    get productTitle() {
        return $('android=new UiSelector().className("android.widget.TextView").instance(5)');
    }

    get deliverySection() {
        return $('android=new UiSelector().textContains("Delivering to")');
    }

    get openBoxDelivery() {
        return $('android=new UiSelector().textContains("Open Box Delivery")');
    }

    get priceDetails() {
        return $('android=new UiSelector().textContains("Price Details")');
    }

    get totalAmount() {
        return $('android=new UiSelector().textContains("Total Amount")');
    }

    get savingsBanner() {
        return $('android=new UiSelector().textContains("save")');
    }

    get cancellationPolicy() {
        return $('android=new UiSelector().textContains("Cancellation Policy")');
    }

    get payButton() {
        return $('android=new UiSelector().textContains("Pay")');
    }

    async validatePageLoaded() {
        await this.pageTitle.waitForDisplayed({
            timeout:
                ORDER_CONFIRMATION_DATA.timeouts.long
        });

        await expect(this.pageTitle).toBeDisplayed();
    }

    async validateDeliveryAddress() {
        await expect(this.deliverySection).toBeDisplayed();
    }

    async validateProductDisplayed() {
        await this.productTitle.waitForDisplayed();

        const title = await this.productTitle.getText();

        expect(title.length).toBeGreaterThan(0);

        return title;
    }

    async validateOpenBoxDelivery() {
        await expect(this.openBoxDelivery).toBeDisplayed();
    }

    async validatePriceDetails() {
        await expect(this.priceDetails).toBeDisplayed();
    }

    async validateCancellationPolicy() {
        await expect(this.cancellationPolicy)
            .toBeDisplayed();
    }

    async validatePayButton() {

        await expect(this.payButton)
            .toBeDisplayed();

        await expect(this.payButton)
            .toBeEnabled();
    }

    async getPayAmount() {

        const label =
            await this.payButton.getText();

        const match =
            label.match(/₹\s?([\d,]+)/);

        if (!match) {
            throw new Error(
                'Amount not found on Pay button'
            );
        }

        return Number(
            match[1].replace(/,/g, '')
        );
    }

    async validatePayAmount() {

        const amount =
            await this.getPayAmount();

        expect(amount).toBeGreaterThan(
            ORDER_CONFIRMATION_DATA
                .expected
                .minimumAmount
        );

        return amount;
    }

    async validateSavingsBanner() {

        const displayed =
            await this.savingsBanner
                .isDisplayed()
                .catch(() => false);

        if (displayed) {

            const text =
                await this.savingsBanner.getText();

            expect(text.length)
                .toBeGreaterThan(0);
        }
    }
}

module.exports =
    new OrderConfirmationPage();
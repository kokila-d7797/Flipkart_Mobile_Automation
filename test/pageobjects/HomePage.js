const { browser, $ } = require('@wdio/globals');
const { HOME_TEST_DATA } =require('../testData/homeTestData');
class HomePage {

    // Locators
    get logo() {
        return $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ImageView[2]');
    }

    get searchBox() {
        return $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup');
    }

    get categorySection() {
        return $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[5]/android.view.ViewGroup/android.widget.HorizontalScrollView');
    }

    get addressElement() {
        return $('~No location, Add address');
    }

    get bottomNavigation() {
        return $('//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/bottom_bar_container_fixed_height"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[2]');
    }

    get homeTab() {
        return $('//*[@resource-id="com.flipkart.android:id/bottom_bar_container_fixed_height"]//*[@content-desc="Home"]');
    }

    // Common validation method
    async isElementDisplayed(element) {
        await element.waitForDisplayed({
            timeout: HOME_TEST_DATA.timeouts.long
        });

        return await element.isDisplayed();
    }

    // Application validation
    async verifyApplicationLaunched() {
        const currentPackage = await browser.getCurrentPackage();

        return currentPackage === HOME_TEST_DATA.appPackage;
    }

    // Page validations
    async verifyLogoDisplayed() {
        return await this.isElementDisplayed(this.logo);
    }

    async verifySearchBoxDisplayed() {
        return await this.isElementDisplayed(this.searchBox);
    }

    async verifyCategorySectionDisplayed() {
        return await this.isElementDisplayed(this.categorySection);
    }

    async verifyAddressDisplayed() {
        return await this.isElementDisplayed(this.addressElement);
    }

    async verifyBottomNavigationDisplayed() {
        return await this.isElementDisplayed(this.bottomNavigation);
    }

    async verifyHomeTabDisplayed() {
        return await this.isElementDisplayed(this.homeTab);
    }

    async navigateToHome() {
        const maxBackAttempts = HOME_TEST_DATA.navigation.maxBackAttempts;

        for (let attempt = 0; attempt <= maxBackAttempts; attempt++) {
            const homeTabDisplayed = await this.homeTab.isDisplayed();

            if (homeTabDisplayed) {
                await this.homeTab.click();
                await this.searchBox.waitForDisplayed({
                    timeout: HOME_TEST_DATA.timeouts.long,
                    timeoutMsg: 'Home search control was not displayed after selecting Home'
                });

                console.log('Successfully navigated to Home page');
                return;
            }

            if (attempt < maxBackAttempts) {
                await browser.back();
            }
        }

        throw new Error(
            `Unable to return to Home after ${maxBackAttempts} Back actions`
        );
    }
}

module.exports = new HomePage();
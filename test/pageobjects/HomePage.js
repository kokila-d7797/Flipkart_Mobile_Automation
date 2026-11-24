
import { browser, $ } from '@wdio/globals';
import { HOME_TEST_DATA } from '../testData/homeTestData.js';

class HomePage {

    // Locators
    get logo() {
        return $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ImageView[2]');
    }

    get searchBox() {
        return $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup[1]');
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
        return $('//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/bottom_bar_container_fixed_height"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup');
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
}

export default new HomePage();
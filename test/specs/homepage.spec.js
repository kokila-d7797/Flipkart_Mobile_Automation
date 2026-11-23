const { expect } = require('@wdio/globals');

describe('Flipkart Home Page Tests', () => {

    it('HOME_01 - Verify Flipkart logo is loaded', async () => {

        const flipkartLogo = await $(
    '//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ImageView[2]'
);
        await expect(flipkartLogo).toBeDisplayed();
    });

    it('HOME_02 - Verify search box', async () => {
    const searchBox = await $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup[1]');
    await expect(searchBox).toBeDisplayed();
    });

    it('HOME_03 - Verify category section is displayed', async () => {
        const categorySection =await $('//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[5]/android.view.ViewGroup/android.widget.HorizontalScrollView');
        await expect(categorySection).toBeDisplayed();
    });

    it('HOME_04 - Verify location is displayed', async () => {
        const addressElement = await $('~No location, Add address');
        await expect(addressElement).toBeDisplayed();

    });

    it('HOME_05 - Verify bottom navigation is displayed', async () => {
        const bottomNavigation = await $('//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/bottom_bar_container_fixed_height"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[2]');
        await expect(bottomNavigation).toBeDisplayed();
    });

    it('HOME_06 - Verify Home tab is displayed', async () => {
        const homeTab = await $('//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/bottom_bar_container_fixed_height"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup');
        await expect(homeTab).toBeDisplayed();
    });

});
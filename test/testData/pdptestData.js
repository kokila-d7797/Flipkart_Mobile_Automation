// All inputs, labels, formats and expected values live here. Change values here only.
const TEST_DATA = {
    app: {
        packageName: 'com.flipkart.android'
    },

    search: {
        query: 'Samsung Galaxy Book4',
        suggestionCategory: 'Laptops',          // suggestion content-desc: "<query>, in <category>"
        productKeyword: 'Samsung Galaxy Book4'  // first product card must contain this
    },

    searchLocators: {
        searchEntry: [
            // Home search control from the current Appium Inspector hierarchy.
            '//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup',
            // Fallbacks
            'android=new UiSelector().descriptionContains("Search")',
            'android=new UiSelector().textContains("Search")',
            'android=new UiSelector().className("android.widget.EditText")'
        ],
        searchInput: [
    'android=new UiSelector().className("android.widget.EditText")',
    'android=new UiSelector().resourceIdMatches(".*search.*")',
    'android=new UiSelector().textContains("Search")'
]
    },

    // Fragments of content-desc used to find elements (seen in Appium Inspector)
    labels: {
        keyHighlights: 'Key Highlights',
        buyNow: 'Buy now',
        buyWithEmi: 'Buy with EMI',
        protectPromiseFee: 'Protect Promise Fee'
    },

    // Formats of content-desc values. Written without backslashes so the same
    // .source works both in UiSelector.descriptionMatches (Java) and in JS.
    // Price      -> "₹82,789"
    // Rating     -> "4.4, | 22.5K+"
    // EMI        -> "Buy with EMI, From ₹6,899/m"
    // Promise fee-> "+₹306 Protect Promise Fee"
    formats: {
        price: /^₹([0-9,]+)$/,
        rating: /^([0-9](?:[.][0-9])?),[ ]*[|][ ]*([0-9.,]+[KkMm]?[+]?)$/,
        emi: /From[ ]*₹[ ]*([0-9,]+)[/]m/,
        protectFee: /^[+]₹([0-9,]+)[ ]/
    },

    expected: {
        minPrice: 0,
        minRating: 0,
        maxRating: 5,
        minTitleLength: 1
    },

    timeouts: {
        short: 10000,
        medium: 15000,
        long: 30000,
        test: 300000        // whole suite / hooks (Mocha default is too short for this device)
    },

    // Android key codes used by the test
    keys: {
        enter: 66
    },

};

module.exports = { TEST_DATA };
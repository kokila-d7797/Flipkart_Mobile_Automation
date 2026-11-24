
const SEARCH_TEST_DATA = {
    appPackage: 'com.flipkart.android',

    search: {
        product: 'iPhone',
        invalidProduct: 'zzxxqq123'
    },

    timeouts: {
        short: 5000,
        medium: 10000,
        long: 20000
    },

    navigation: {
        maxBackAttempts: 3,
        backWait: 1000
    }
};

module.exports = { SEARCH_TEST_DATA };
export const TEST_DATA = {
    login: {
        mobileNumber: process.env.FLIPKART_MOBILE,
        otp: process.env.FLIPKART_OTP
    },

    search: {
        product: 'Samsung laptop',
        productKeyword: 'Samsung Galaxy Book4'  
    },

    expected: {
        minimumPrice: 1,
        defaultQuantity: 1,
        minimumTitleLength: 3
    },

    timeouts: {
        short: 5000,
        medium: 10000,
        long: 20000
    }
};
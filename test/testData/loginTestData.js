const LOGIN_DATA = {

    appPackage:
        process.env.FLIPKART_APP_PACKAGE ||
        'com.flipkart.android',

    mobileNumber:
        process.env.FLIPKART_MOBILE_NUMBER ||
        '9789808624',


    mobileNumberLength: 10,

    invalidMobileCases: [
        {
            id: 'LOGIN_03',
            title: 'empty mobile number',
            value: ''
        },
        {
            id: 'LOGIN_04',
            title: '5 digit mobile number',
            value: '12345'
        },
        {
            id: 'LOGIN_05',
            title: '9 digit mobile number',
            value: '123456789'
        },
        {
            id: 'LOGIN_06',
            title: '11 digit mobile number',
            value: '98765432101'
        },
        {
            id: 'LOGIN_07',
            title: 'alphabetic characters',
            value: 'abcdefghij'
        },
        {
            id: 'LOGIN_08',
            title: 'special characters',
            value: '@#$%^&*()!'
        }
    ],

    wrongOtp:
        process.env.FLIPKART_INVALID_OTP || '000000',

    expectedMessages: {
        invalidOtp:
            'Incorrect OTP'
    },

    timeouts: {
        short: 10000,
        medium: 15000,
        appLaunch: 45000,
        otpManual: 120000
    }
};

module.exports = {
    LOGIN_DATA
};
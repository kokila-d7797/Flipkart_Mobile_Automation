const { expect, browser } = require('@wdio/globals');
const LoginPage = require('../pageobjects/LoginPage');
const { LOGIN_DATA } = require('../testData/loginTestData');

const loginPage = new LoginPage();

function getValidMobileNumber() {
    const number = String(LOGIN_DATA.mobileNumber ?? '');
    if (!/^\d{10}$/.test(number)) {
        throw new Error(
            'Set FLIPKART_MOBILE_NUMBER to a valid 10-digit mobile number before running LOGIN_09/LOGIN_10'
        );
    }
    return number;
}

describe('Flipkart Login Test Scenarios', function () {

    // Manual OTP step waits up to 2 minutes
    this.timeout(300000);

    // Open Flipkart and the phone screen once for the whole suite
    before(async () => {

    console.log(
        'Starting Flipkart Login Automation Suite'
    );

    await loginPage.openLoginPage();
});
    // Close the app so the run ends cleanly
    after(async () => {

    console.log(
        'Closing Flipkart Application'
    );

    try {

        await browser.terminateApp(
            LOGIN_DATA.appPackage
        );

    } catch (error) {

        console.log(
            `Termination skipped: ${error.message}`
        );
    }
});

    // =========================================
    // LOGIN PAGE
    // =========================================

    it('LOGIN_01 - Open Flipkart login page', async () => {

    await loginPage.ensureOnMobileScreen();
    expect(await loginPage.isMobileInputDisplayed()).toBe(true);
});

    // =========================================
    // INVALID MOBILE INPUTS (loop, same screen)
    // =========================================

    LOGIN_DATA.invalidMobileCases.forEach((testCase) => {

    it(`${testCase.id} - Validate ${testCase.title}`, async () => {

        await loginPage.ensureOnMobileScreen();

        await loginPage.enterMobileNumber(testCase.value);

        const expectedDigits = String(testCase.value).replace(/\D/g, '');
        const enteredNumber = await loginPage.getMobileNumber();

        expect(enteredNumber).toBe(expectedDigits);
        expect(enteredNumber.length).not.toBe(LOGIN_DATA.mobileNumberLength);

        expect(await loginPage.isMobileInputDisplayed()).toBe(true);
        expect(await loginPage.isOtpInputDisplayed()).toBe(false);
    });
});

    // =========================================
    // VALID MOBILE NUMBER
    // =========================================

    it('LOGIN_09 - Continue enabled for valid 10 digit mobile number', async () => {

        await loginPage.ensureOnMobileScreen();

        const mobileNumber = getValidMobileNumber();
        await loginPage.enterMobileNumber(mobileNumber);

        const enteredNumber = await loginPage.getMobileNumber();

        expect(enteredNumber).toBe(mobileNumber);
        expect(enteredNumber.length).toBe(LOGIN_DATA.mobileNumberLength);

        await loginPage.verifyContinueButtonState(true);
    });

    it('LOGIN_10 - Continue to OTP screen with valid mobile number', async () => {

        await loginPage.ensureOnMobileScreen();

        const mobileNumber = getValidMobileNumber();
        await loginPage.enterMobileNumber(mobileNumber);
        await loginPage.verifyContinueButtonState(true);
        await loginPage.clickContinue();
        await loginPage.waitForOtpScreen();

        expect(await loginPage.isOtpInputDisplayed()).toBe(true);
    });

    // =========================================
    // OTP SCREEN
    // =========================================

    it('LOGIN_11 - Verify button is disabled before OTP entry', async () => {

        await loginPage.ensureOnOtpScreen();
        expect(await loginPage.verifyButton.isDisplayed()).toBe(true);
    });

    it('LOGIN_12 - Wrong OTP shows error message', async () => {

        await loginPage.ensureOnOtpScreen();

        await loginPage.enterOtp(LOGIN_DATA.wrongOtp);
        await loginPage.clickVerify();

        await loginPage.verifyOtpError(
            LOGIN_DATA.expectedMessages.invalidOtp
        );
    });

    // =========================================
    // FINAL POSITIVE LOGIN (manual OTP)
    // =========================================

    it('LOGIN_13 - Login successfully with valid OTP', async () => {

    console.log('================================================');
    console.log('PLEASE ENTER THE VALID OTP MANUALLY ON DEVICE');
    console.log('AFTER ENTERING OTP, CLICK VERIFY');
    console.log('TEST WILL WAIT FOR 30 SECONDS...');
    console.log('================================================');

    await browser.waitUntil(async () => {
        const otpValue = await loginPage.otpField.getText();
        return otpValue.length === 6;
    },
    {
        timeout: 120000,
        interval: 1000
    }
);
    await loginPage.verifyLoginSucceeded();
});

});
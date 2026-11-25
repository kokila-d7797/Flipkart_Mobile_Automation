// pageobjects/LoginPage.js
const { $, expect, browser } = require('@wdio/globals');
const { LOGIN_DATA } = require('../testData/loginTestData');

class LoginPage {

    constructor() {
    this.accountTab ='~Account';
    this.loginButton ='//android.widget.TextView[@text="Log In"]';
    this.phoneNumberField ='~Phone Number';
    this.continueButton ='id=com.flipkart.android:id/button';
    this.otpField ='//android.widget.EditText[@resource-id="com.flipkart.android:id/otp_view"]';
    this.verifyButton ='id=com.flipkart.android:id/button';
}

//element getters
get account() {
    return $(this.accountTab);
}

get login() {
    return $(this.loginButton);
}

get phoneInput() {
    return $(this.phoneNumberField);
}

get continueBtn() {
    return $(this.continueButton);
}

get otpInput() {
    return $(this.otpField);
}

get verifyBtn() {
    return $(this.verifyButton);
}

async openApp() {

    await browser.activateApp(LOGIN_DATA.appPackage);
    await browser.pause(5000);
    console.log('Flipkart application launched');
}

    async getMobileElement(timeout = LOGIN_DATA.timeouts.medium) {
        let found = null;
        try {
            await browser.waitUntil(
                async () => {
                    for (const locator of this.mobileInputFallbacks) {
                        const el = await $(locator);
                        if (await el.isExisting().catch(() => false)) {
                            found = el;
                            return true;
                        }
                    }
                    return false;
                },
                { timeout, interval: 1000 }
            );
        } catch (e) {
            await this.dumpPageSource('mobile-field-not-found');
            throw new Error(
                'Mobile number field not found with any locator. ' +
                'See page-source-mobile-field-not-found.xml'
            );

        }

        return found;
    }

    async dismissSystemPopups() {

    const popupLocators = [

        'id=com.android.permissioncontroller:id/permission_allow_button',

        'id=com.android.permissioncontroller:id/permission_allow_foreground_only_button',

        '//*[contains(@text,"Allow")]',

        '//*[contains(@text,"Continue")]',

        '//*[contains(@text,"Skip")]',

        '//*[contains(@text,"Not Now")]'
    ];

    for (const locator of popupLocators) {

        try {

            const element = await $(locator);

            if (await element.isDisplayed()) {

                await element.click();

                await browser.pause(1500);
            }

        } catch (error) {

            continue;
        }
    }
}

    async readText(el) {

        const attempts = [
            () => el.getText(),
            () => el.getAttribute('text'),
            () => el.getValue()
        ];

        for (const attempt of attempts) {
            try {
                const value = await attempt();
                if (value && String(value).trim().length > 0) {
                    return String(value).trim();
                }
            } catch (e) {
                // try next strategy
            }
        }
        return '';
    }

    // Launches Flipkart and lands on the phone number screen.
   async openLoginPage() {

    console.log('Launching Flipkart');

    await browser.activateApp(
        LOGIN_DATA.appPackage
    );

    await browser.pause(5000);

    const account =
        await $('~Account');

    await account.waitForDisplayed({
        timeout: 30000
    });

    await account.click();

    console.log('Account clicked');

    const login =
        await $(
            '//android.widget.TextView[@text="Log In"]'
        );

    await login.waitForDisplayed({
        timeout: 15000
    });

    await login.click();

    console.log('Login clicked');

    const phone =
        await $('~Phone Number');

    await phone.waitForDisplayed({
        timeout: 15000
    });

    console.log(
        'Phone Number screen opened'
    );
}

async ensureOnMobileScreen() {

    if (await this.isMobileInputDisplayed()) {
        return;
    }

    if (await this.isOtpInputDisplayed()) {
        await browser.back();
        if (await this.isMobileInputDisplayed()) {
            return;
        }
    }

    await this.openLoginPage();
}

async isMobileInputDisplayed() {

    return await this.phoneInput
        .isDisplayed()
        .catch(() => false);
}

async enterMobileNumber(number) {

    const inputNumber = String(number ?? '');
    const phone = this.phoneInput;

    await phone.waitForDisplayed({ timeout: 15000 });
    await phone.click();
    await browser.waitUntil(
        async () => String(await phone.getAttribute('focused')).toLowerCase() === 'true',
        {
            timeout: 5000,
            interval: 200,
            timeoutMsg: 'Phone number field did not receive focus'
        }
    );
    await phone.clearValue();
    if (inputNumber) {
        await phone.addValue(inputNumber);
    }

    const expectedDigits = inputNumber.replace(/\D/g, '');
    if (expectedDigits) {
        let actualNumber = await this.getMobileNumber();
        if (actualNumber !== expectedDigits) {
            await phone.click();
            await phone.clearValue();
            await browser.keys(expectedDigits.split(''));
            actualNumber = await this.getMobileNumber();
        }

        if (actualNumber !== expectedDigits && /^\d{10}$/.test(inputNumber)) {
            throw new Error(
                `Mobile number entry mismatch: expected ${inputNumber}, received ${actualNumber}`
            );
        }
    }

    console.log(`Input mobile number: ${inputNumber}`);
    console.log(`Actual value present after typing: ${await this.getMobileInputValue()}`);
}

async getMobileInputValue() {

    const textAttribute = await this.phoneInput.getAttribute('text');
    if (textAttribute !== undefined && textAttribute !== null && String(textAttribute) !== '') {
        return String(textAttribute);
    }

    const text = await this.phoneInput.getText();
    return text === undefined || text === null ? '' : String(text);
}

async getMobileNumber() {

    const rawValue = await this.getMobileInputValue();
    const digits = rawValue.replace(/\D/g, '');
    const hasCountryCode = /^\s*\+?91(?:\D|$)/.test(rawValue) ||
        (digits.length === 12 && digits.startsWith('91'));

    return hasCountryCode ? digits.slice(2) : digits;
}

async verifyContinueButtonState(
    expectedState
) {

    if (typeof expectedState !== 'boolean') {
        throw new TypeError('expectedState must be a boolean');
    }

    await browser.waitUntil(
        async () => (await this.continueBtn.isEnabled()) === expectedState,
        {
            timeout: 5000,
            interval: 250,
            timeoutMsg: `Continue button did not become ${expectedState ? 'enabled' : 'disabled'}`
        }
    );

    const actualState =await this.continueBtn.isEnabled();

    expect(actualState).toBe(expectedState);
}

    async clickContinue() {

    const enabled =await this.continueBtn.isEnabled();

    if (!enabled) {

        throw new Error(
            'Continue button is disabled'
        );
    }

    await this.continueBtn.click();

    console.log('Continue button clicked');
}

async waitForOtpScreen() {

    try {
        await this.otpInput.waitForDisplayed({
            timeout: 30000,
            timeoutMsg: 'OTP screen not displayed'
        });
    } catch (error) {
        const source = await browser.getPageSource();
        const visibleText = [...source.matchAll(/\btext="([^"]*)"/g)]
            .map(([, text]) => text.trim())
            .filter(Boolean)
            .slice(0, 20);
        throw new Error(
            `${error.message}. Current screen text: ${visibleText.join(' | ') || '(none)'}`
        );
    }

    console.log('OTP screen loaded');
}

async verifyLoginSucceeded() {

    await this.otpInput.waitForDisplayed({
        reverse: true,
        timeout: 30000,
        timeoutMsg: 'OTP screen did not close after verification'
    });

    await this.account.waitForDisplayed({ timeout: 15000 });
    await this.account.click();

    await this.login.waitForDisplayed({
        reverse: true,
        timeout: 15000,
        timeoutMsg: 'Login prompt is still visible after OTP verification'
    });

    expect(await this.login.isDisplayed().catch(() => false)).toBe(false);
}

async isOtpInputDisplayed() {

    return this.otpInput.isDisplayed().catch(() => false);
}

async ensureOnOtpScreen() {

    const displayed =
        await this.otpInput
            .isDisplayed()
            .catch(() => false);

    if (!displayed) {

        throw new Error(
            'Not on OTP screen'
        );
    }
}

async enterOtp(otp) {

    await this.otpInput.click();

    await this.otpInput.clearValue();

    await this.otpInput.setValue(String(otp));

    console.log(`OTP Entered: ${otp}`);
}

async isVerifyEnabled() {

    return await this.verifyBtn.isEnabled();
}

async clickVerify() {

    await browser.waitUntil(

        async () =>
            await this.verifyBtn.isEnabled(),

        {
            timeout: 10000
        }
    );

    await this.verifyBtn.click();

    console.log('Verify clicked');
}

async waitForManualOTP() {

    console.log('Please enter OTP manually');

    await browser.waitUntil(

        async () =>
            await this.verifyBtn.isEnabled(),

        {
            timeout:
                LOGIN_DATA.timeouts.otpManual,

            interval: 1000,

            timeoutMsg:
                'OTP not entered within timeout'
        }
    );
}

async verifyOtpError(
    expectedMessage
) {

    const errorText = await $(
        `android=new UiSelector().textContains("${expectedMessage}")`
    );

    await errorText.waitForDisplayed({
        timeout: 10000,
        timeoutMsg: `Expected OTP validation message was not displayed: ${expectedMessage}`
    });

    expect(await errorText.getText()).toContain(expectedMessage);
}

async clearOtp() {

    for(let i = 0; i < 6; i++) {
        await driver.pressKeyCode(67); // backspace
    }
}

async verifyLoginSucceeded() {

    const account = await $('//*[@text="Account"]');

    expect(await account.isDisplayed()).toBe(true);
}

}
module.exports = LoginPage;
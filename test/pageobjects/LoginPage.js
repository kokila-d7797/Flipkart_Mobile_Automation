// pageobjects/LoginPage.js
const { $, $$, expect, browser } = require('@wdio/globals');
const { LOGIN_DATA } = require('../testData/loginTestData');
const HomePage = require('./HomePage');

class LoginPage {

    constructor() {
        this.accountTabLocators = [
            '~Account',
            'android=new UiSelector().description("Account")',
            '//*[@content-desc="Account"]'
        ];
        this.homeTabLocators = [
            '~Home',
            'android=new UiSelector().description("Home")',
            '//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/bottom_bar_container_fixed_height"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup'
        ];
        this.loginButton = 'android=new UiSelector().textMatches("(?i)^log ?in$")';
        this.phoneNumberField = '~Phone Number';
        this.continueButton = 'id=com.flipkart.android:id/button';
        this.otpField = '//android.widget.EditText[@resource-id="com.flipkart.android:id/otp_view"]';
        this.verifyButton = 'id=com.flipkart.android:id/button';
        this.accountDashboardIndicators = [
            {
                name: 'greeting',
                locators: [
                    `android=new UiSelector().textStartsWith("${LOGIN_DATA.accountDashboard.greetingPrefix}")`,
                    `android=new UiSelector().descriptionStartsWith("${LOGIN_DATA.accountDashboard.greetingPrefix}")`
                ]
            },
            {
                name: 'orders',
                locators: [
                    `android=new UiSelector().textContains("${LOGIN_DATA.accountDashboard.ordersLabel}")`,
                    `android=new UiSelector().descriptionContains("${LOGIN_DATA.accountDashboard.ordersLabel}")`
                ]
            },
            {
                name: 'wishlist',
                locators: [
                    `android=new UiSelector().textContains("${LOGIN_DATA.accountDashboard.wishlistLabel}")`,
                    `android=new UiSelector().descriptionContains("${LOGIN_DATA.accountDashboard.wishlistLabel}")`
                ]
            },
            ...LOGIN_DATA.accountDashboard.membershipLabels.map((label) => ({
                name: 'membership',
                locators: [
                    `android=new UiSelector().textContains("${label}")`,
                    `android=new UiSelector().descriptionContains("${label}")`
                ]
            }))
        ];
    }

//element getters
get account() {
    return $(this.accountTabLocators[0]);
}

get home() {
    return $(this.homeTabLocators[0]);
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
    await this.waitForVisibleElement(
        this.accountTabLocators,
        LOGIN_DATA.timeouts.appLaunch,
        'Account tab was not displayed after launching Flipkart'
    );
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

    const account = await this.waitForVisibleElement(
        this.accountTabLocators,
        LOGIN_DATA.timeouts.appLaunch,
        'Account tab was not displayed after launching Flipkart'
    );

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

async ensureLoggedIn() {

    console.log('[Login] Launching Flipkart application');
    await browser.activateApp(
        LOGIN_DATA.appPackage
    );

    console.log('[Login] Ensuring Home screen is displayed before opening Account');
    await HomePage.navigateToHome();

    console.log('[Login] Opening Account tab');
    const account = await this.waitForVisibleElement(
        this.accountTabLocators,
        LOGIN_DATA.timeouts.appLaunch,
        'Account tab was not displayed after launching Flipkart'
    );
    // Click the content-description parent, not the non-clickable "Account" text label.
    await account.click();

    console.log('[Login] Checking account dashboard state');
    try {
        await browser.waitUntil(
            async () => {
                const dashboardDisplayed = await this.isAuthenticatedAccountDashboard();
                const loginVisible = await this.login.isDisplayed().catch(() => false);
                return dashboardDisplayed || loginVisible;
            },
            {
                timeout: LOGIN_DATA.timeouts.accountState,
                interval: 500,
                timeoutMsg: 'Account tab showed neither dashboard indicators nor a Log In button'
            }
        );
    } catch (error) {
        let screenLabels = 'unavailable';
        try {
            screenLabels = (await this.getAccountScreenLabels()).join(' | ') || '(none found)';
        } catch (diagnosticError) {
            screenLabels = `unavailable: ${diagnosticError.message}`;
        }
        throw new Error(`${error.message}. Account-related screen labels: ${screenLabels}`);
    }

    const visibleIndicators = await this.getVisibleDashboardIndicators();

    // Any configured account-dashboard indicator is sufficient evidence of a session.
    if (visibleIndicators.length > 0) {

    console.log(
        `[Login] Existing session confirmed by: ${visibleIndicators.join(', ')}`
    );

    console.log(
        '[Login] User already logged in. Navigating to Home page'
    );

    await HomePage.navigateToHome();

    console.log(
        '[Login] Home page loaded successfully'
    );

    return true;
}

    console.log('[Login] User is not logged in; opening the login form');

    await this.login.click();

    await this.phoneInput.waitForDisplayed({
        timeout: LOGIN_DATA.timeouts.medium,
        timeoutMsg: 'Phone number field was not displayed after selecting Log In'
    });

    const mobileNumber = String(LOGIN_DATA.mobileNumber ?? '').trim();
    const validMobileNumber = new RegExp(
        `^\\d{${LOGIN_DATA.mobileNumberLength}}$`
    );
    if (!validMobileNumber.test(mobileNumber)) {
        throw new Error(
            `Configure FLIPKART_MOBILE_NUMBER as a ${LOGIN_DATA.mobileNumberLength}-digit number before login`
        );
    }

    console.log('[Login] Entering configured mobile number');
    await this.enterMobileNumber(mobileNumber);

    await this.clickContinue();

    await this.waitForOtpScreen();

    console.log('[Login] Enter the OTP and tap Verify manually on the device');

    await browser.waitUntil(
        async () => !(await this.isOtpInputDisplayed()),
        {
            timeout: LOGIN_DATA.timeouts.manualLogin,
            interval: 1000,
            timeoutMsg: 'OTP screen did not close after manual verification'
        }
    );

    console.log('[Login] OTP screen closed; validating the account dashboard');
    const accountTab = await this.waitForVisibleElement(
        this.accountTabLocators,
        LOGIN_DATA.timeouts.accountState,
        'Account tab was not available after OTP verification'
    );
    await accountTab.click();

    await browser.waitUntil(
        async () => this.isAuthenticatedAccountDashboard(),
        {
            timeout: LOGIN_DATA.timeouts.accountState,
            interval: 500,
            timeoutMsg: 'Login completed without displaying a recognized account dashboard indicator'
        }
    );

    const confirmedIndicators = await this.getVisibleDashboardIndicators();
    console.log(
    `[Login] Login successful; dashboard confirmed by: ${confirmedIndicators.join(', ')}`
);

await HomePage.navigateToHome();

console.log(
    '[Login] Home page loaded successfully'
);

return true;
}

async getVisibleDashboardIndicators() {

    const indicators = [];

    const checks = {
        Orders: 'android=new UiSelector().textContains("Orders")',
        Wishlist: 'android=new UiSelector().textContains("Wishlist")',
        Hey: 'android=new UiSelector().textContains("Hey")',
        Member: 'android=new UiSelector().textContains("member")'
    };

    for (const [name, locator] of Object.entries(checks)) {

        const visible = await $(locator)
            .isDisplayed()
            .catch(() => false);

        if (visible) {
            indicators.push(name);
        }
    }

    return indicators;
}

async waitForVisibleElement(locators, timeout, timeoutMsg) {
    let visibleElement;

    await browser.waitUntil(
        async () => {
            for (const locator of locators) {
                const elements = await $$(locator);
                for (const element of elements) {
                    if (await element.isDisplayed().catch(() => false)) {
                        visibleElement = element;
                        return true;
                    }
                }
            }
            return false;
        },
        {
            timeout,
            interval: 500,
            timeoutMsg
        }
    );

    return visibleElement;
}

async getAccountScreenLabels() {
    const source = await browser.getPageSource();
    return [...source.matchAll(/(?:text|content-desc)="([^"]*)"/g)]
        .map(([, label]) => label.trim())
        .filter((label) => /\b(account|log\s*in|login|orders?|wishlist|membership|hey|welcome)\b/i.test(label))
        .map((label) => label.replace(/^(hey|welcome)\b.*$/i, '$1, <redacted>'))
        .slice(0, 10);
}

async isAuthenticatedAccountDashboard() {

    const indicators = [

        'android=new UiSelector().textContains("Orders")',

        'android=new UiSelector().textContains("Wishlist")',

        'android=new UiSelector().textContains("Hey")',

        'android=new UiSelector().textContains("member")'

    ];

    for (const locator of indicators) {

        const visible = await $(locator)
            .isDisplayed()
            .catch(() => false);

        if (visible) {
            return true;
        }
    }

    return false;
}

async returnToHome() {
    const home = await this.waitForVisibleElement(
        this.homeTabLocators,
        LOGIN_DATA.timeouts.medium,
        'Home tab was not displayed after confirming account state'
    );
    await home.click();
    console.log('[Login] Returned to Home for the product search flow');
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
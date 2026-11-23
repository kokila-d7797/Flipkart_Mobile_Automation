const { expect, browser, $, $$ } = require('@wdio/globals');

const APP_PACKAGE = 'com.flipkart.android';
const SEARCH_TEXT = 'iPhone';
const TIMEOUT = 10000;

// Put your verified locators here
const SEARCH_BOX = '//android.view.ViewGroup[@resource-id="com.flipkart.android:id/tab_bar"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/contentFragment"]/android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[4]/android.view.ViewGroup/android.view.ViewGroup[1]';
const SEARCH_INPUT = '//android.widget.FrameLayout[@resource-id="com.flipkart.android:id/main_content"]/android.widget.FrameLayout/android.view.ViewGroup[3]/android.view.ViewGroup[1]';

// ---------- Helpers ----------
async function openSearchScreen() {
  const box = await $(SEARCH_BOX);
  //await box.waitForDisplayed({ timeout: TIMEOUT });
  await box.click();

  const input = await $(SEARCH_INPUT);
  //await input.waitForDisplayed({ timeout: TIMEOUT });
  return input;
}

async function submitSearch() {
  // Presses the keyboard's search button
  await browser.execute('mobile: performEditorAction', { action: 'search' });
}

async function goBackToHome() {
  for (let i = 0; i < 3; i++) {
    await browser.back();
    await browser.pause(1000);
  }
  await browser.activateApp(APP_PACKAGE);
}

// ---------- Tests ----------
describe('Flipkart Search - Mobile App', () => {

  afterEach(async () => {
    await goBackToHome(); // every test starts from home
  });

  it('TC01 - Search box opens the search screen', async () => {
    const input = await openSearchScreen();
    await expect(input).toBeDisplayed();
  });

  it('TC02 - Typing shows suggestions', async () => {
    const input = await openSearchScreen();
    await input.setValue(SEARCH_TEXT);
    const suggestion = await $$("//android.widget.ScrollView/android.view.ViewGroup");
    await expect(suggestion.length).toBeGreaterThan(0);
    await expect(suggestion[0]).toBeDisplayed();
    await suggestion.waitForDisplayed({ timeout: TIMEOUT });
    await expect(suggestion).toBeDisplayed();
  });
/*
  it('TC03 - Submitting a search shows results', async () => {
    const input = await openSearchScreen();
    await input.setValue(SEARCH_TEXT);
    await submitSearch();

    const result = await $(
      `android=new UiSelector().textContains("${SEARCH_TEXT}")`
    );
    await result.waitForDisplayed({ timeout: TIMEOUT });
    await expect(result).toBeDisplayed();
  });

  it('TC05 - Search text can be cleared', async () => {
    const input = await openSearchScreen();
    await input.setValue(SEARCH_TEXT);
    await input.clearValue();

    const text = await input.getText();
    expect(text).not.toContain(SEARCH_TEXT);
  });

  it('TC06 - Nonsense word shows no results', async () => {
    const input = await openSearchScreen();
    await input.setValue('zzxxqq123');
    await submitSearch();

    const message = await $(
      'android=new UiSelector().textContains("No results")'
    );
    await expect(message).toBeDisplayed(); // check the real wording in Inspector
  });
  */
});
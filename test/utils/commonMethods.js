const { $ } = require('@wdio/globals');

async function getElement(locator, timeout = 10000) {
    const element = await $(locator);
    await element.waitForDisplayed({ timeout });
    return element;
}

async function getLabel(element) {
    const text = (await element.getText()).trim();

    if (text) return text;

    return (
        await element.getAttribute('content-desc') || ''
    ).trim();
}

const toNumber = (str) =>
    Number(String(str).replace(/[^0-9.]/g, ''));

async function scrollToDesc(text) {
    const element = await $(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionContains("${text}"))`
    );

    await element.waitForDisplayed({ timeout: 20000 });

    return element;
}

module.exports = {
    getElement,
    getLabel,
    toNumber,
    scrollToDesc
};
const byText = (text) =>
    `//*[contains(@text,"${text}") or contains(@content-desc,"${text}")]`;

export const LOCATORS = {
    // Home and search
    searchBox: () => $('~Search for products, brands and more'),

    // Product listing
    firstProduct: () =>
    `android=new UiSelector().descriptionStartsWith("Sponsored, ${search.productKeyword}")`,

    // Product details
    buyNow: () => $(byText('Buy Now')),

    // Confirm Details page
    confirmDetailsTitle: () => $(byText('Confirm details')),
    deliveringTo: () => $(byText('Delivering to')),
    address: () => $(byText('Change')),

    productTitle: () => $(`//android.widget.TextView[contains(@text, "${search.productKeyword}")]`),

    quantity: () => $(byText('1')),

    deliveryTomorrow: () => $(byText('Delivery by')),
    deliveryDateOption: () =>
    `android=new UiSelector().textMatches("(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [0-9]{1,2} [A-Za-z]{3}")`,

    openBoxDelivery: () => $(byText('Open Box Delivery')),
    trustShield: () => $(byText('Protected with Flipkart Trust Shield')),

    // Price summary
    priceDetails: () => $(byText('Price Details')),
    sellingPrice: () => $(byText('Selling Price')),
    protectionFee: () => $(byText('Protect Promise Fee')),
    discount: () => $(byText('Discount on Selling Price')),
    totalAmount: () => $(byText('Total Amount')),

    continueButton: () => $(byText('Continue'))
};
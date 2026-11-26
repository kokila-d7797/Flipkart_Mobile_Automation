const LoginPage =require('../pageobjects/LoginPage');
const ProductPage =require('../pageobjects/ProductPage');
const ConfirmDetailsPage =require('../pageobjects/ConfirmdetailsPage');
const OrderConfirmationPage =require('../pageobjects/OrderConfirmationPage');
const loginPage =new LoginPage();
const productPage =new ProductPage();
describe('Flipkart Order Confirmation Page Tests',
    function () {

        this.timeout(180000);

        before(async () => {

        // Reuse the shared session check and manual OTP login flow for every purchase suite.
        await loginPage.ensureLoggedIn();
        await productPage.openProductDetails();
        await productPage.clickBuyNow();
        });

        // ===========================
        // POSITIVE TESTS
        // ===========================

        it('ORDER_01 - Verify Order Confirmation Page Loaded',async () => {
                await OrderConfirmationPage.validatePageLoaded();
            }
        );

        it(
            'ORDER_02 - Verify Delivery Address Section',
            async () => {

                await OrderConfirmationPage
                    .validateDeliveryAddress();
            }
        );

        it('ORDER_03 - Verify Product Details Displayed',async () => {

                await OrderConfirmationPage
                    .validateProductDisplayed();
            }
        );

        it(
            'ORDER_04 - Verify Open Box Delivery Section',
            async () => {

                await OrderConfirmationPage
                    .validateOpenBoxDelivery();
            }
        );

        it(
            'ORDER_05 - Verify Price Details Section',
            async () => {

                await OrderConfirmationPage
                    .validatePriceDetails();
            }
        );

        it(
            'ORDER_06 - Verify Savings Banner',
            async () => {

                await OrderConfirmationPage
                    .validateSavingsBanner();
            }
        );

        it(
            'ORDER_07 - Verify Cancellation Policy',
            async () => {

                await OrderConfirmationPage
                    .validateCancellationPolicy();
            }
        );

        it(
            'ORDER_08 - Verify Pay Button Enabled',
            async () => {

                await OrderConfirmationPage
                    .validatePayButton();
            }
        );

        it('ORDER_09 - Verify Pay Amount Greater Than Zero',async () => {
                await OrderConfirmationPage.validatePayAmount();
        });

        // ===========================
        // NEGATIVE TESTS
        // ===========================

        it('ORDER_10 - Verify Pay Amount Is Not Zero',async () => {
                const amount =await OrderConfirmationPage.getPayAmount();
                expect(amount).not.toBe(0);
            });

        it('ORDER_11 - Verify Product Title Is Not Empty',async () => {
                const title =await OrderConfirmationPage.validateProductDisplayed();
                expect(title).not.toEqual('');
            });

        it('ORDER_12 - Verify Pay Button Is Not Disabled',async () => {
                const enabled =await OrderConfirmationPage.payButton.isEnabled();
                expect(enabled).not.toBe(false);
        });
    }
);
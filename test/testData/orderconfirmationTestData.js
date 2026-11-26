const ORDER_CONFIRMATION_DATA = {
    timeouts: {
        short: 5000,
        medium: 10000,
        long: 20000
    },

    expected: {
        minimumAmount: 1,
        minimumSavings: 1
    },

    labels: {
        pageTitle: 'Confirm Details',
        priceDetails: 'Price Details',
        cancellationPolicy: 'Cancellation Policy',
        openBoxDelivery: 'Open Box Delivery',
        pay: 'Pay'
    },

    formats: {
        currency: /₹\s?([\d,]+)/,
        savings: /Save ₹([\d,]+)/
    }
};

module.exports = {
    ORDER_CONFIRMATION_DATA
};
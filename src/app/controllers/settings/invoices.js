angular.module("proton.controllers.Settings")

.controller('InvoicesController', function($rootScope, $scope) {
    $rootScope.pageName = "Invoices";
    $scope.invoices = [
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month)",
            "Price": "13 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month)",
            "Price": "13 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month)",
            "Price": "13 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month)",
            "Price": "13 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 2 Addons",
            "Price": "10 CHF"
        },
        {
            "Date": 1444079277,
            "Event": "Business Plan Subscription (1 month) with 1 Addons",
            "Price": "12 CHF"
        }
    ];

    /**
     * Download invoice file
     */
    $scope.downloadInvoice = function(payment) {

    };
});

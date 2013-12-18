angular.module( 'privatesiteService', ['errorService'])

    .factory( 'privatesiteService', [ '$http', 'errorService' , function ( $http, errorService ) {

        var suffix, title;

        var safeServerCall  = function SafeServerCall(http){
            return $http(http)
                .error(function(data, status, headers, config) {
                    errorService.checkErrors( status, data, headers, null );
            });
        };

        var applySavedProducts = function( data ) {
            for(var i=0;i<data.features.length;i++){
                if( (data.features[i].selectedMonthlyPayment) ){
                    data.features[i].chosen = "monthly";
                }else if( (data.features[i].selectedPerTransaction) ) {
                    data.features[i].chosen = "transaction";
                }else{
                    data.features[i].chosen = "none";
                }
            }
        };

        var privatesiteService = {

            getCustomerTest: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/currentUserCompany',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            getUserInfo: function( successCallback, errorCallback ){
                return safeServerCall( {
                    url: baseSvcUrl + "/currentUser",
                    method: "GET"
                });
            },

            getFeatureList: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/featureList',
                    method: "GET"
                })
                    .success(function(data) {
                        applySavedProducts(data);
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },
            
            cancelServices: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/cancelService',
                    method: "DELETE",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            getCustomerDemograph: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/customerinfo',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            saveCustomerDemograph: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/updatecustomer',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            applyPromo: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/featureList/'+encodeURIComponent(data),
                    method: "GET"
                })
                    .success(function(data) {
                        applySavedProducts(data);
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            saveFeatures: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/updatefeaturelist',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            getPayerCSV: function(){
                return safeServerCall( {
                    url: baseSvcUrl + '/providerManagement/providerCSV',
                    method: "GET"
                });
            },
            getPayersProducts: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/payer/searchPayerProducts',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            getPayersCSV: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/payer/exportPayerProductsCSV',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            getAudit: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/audit/summary',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },

            getPaymentScreen: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/payment',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            },
            getSummary: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/showsummary',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config) {
                        errorService.checkErrors( status, data, headers, errorCallback );
                    });
            }
            // updatePaymentProfile: function(){
            //     return safeServerCall( {
            //         url: baseSvcUrl + '/providerManagement/providerCSV',
            //         method: "GET"
            //     });
            // }


        };
        return privatesiteService;
    } ] ) ;
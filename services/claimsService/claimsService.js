angular.module( 'claimsService', ['errorService'])
    .factory( 'claimsService', [ '$http' , 'errorService' , function ( $http, errorService ) {

        var claimsService = {

            claimsSearchSubmit: function(callback, data, errorCallback)
            {

                $http({
                        method: 'POST',
                        url: baseSvcUrl + '/claims/claimSearch',
                        data: data,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            claimsCSV: function(callback, data, errorCallback)
            {

                $http({
                        method: 'POST',
                        url: baseSvcUrl + '/claims/exportClaims',
                        data: data,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            claimSummary: function(callback, data, errorCallback)
            {

                $http({
                        method: 'GET',
                        url: baseSvcUrl + '/claims/claimDetails/'+data,
                        data: data,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            claimTracker: function(callback, data, errorCallback)
            {

                $http({
                        method: 'GET',
                        url: baseSvcUrl + '/claims/claimHistoryTracker/'+data,
                        data: data,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            }

        };

        return claimsService;

    } ] ) ;
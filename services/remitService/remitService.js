angular.module( 'remitService', ['errorService'])
    .factory( 'remitService', [ '$http' , 'errorService' , function ( $http, errorService ) {

        var remitService = {

            remitSearchSubmit: function(callback, data)
            {

                $http({
                        method: 'POST',
                        url: baseSvcUrl + '/remit/retrieveRemits',
                        data: data,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data, status, headers, config) {
                        //errorService.checkErrors(status, data, headers, errorCallback);
                    });
            }


        };

        return remitService;

    } ] ) ;
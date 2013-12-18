angular.module( 'worklistService', ['errorService'])

    .factory( 'worklistService', [ '$http' , 'errorService' , function ( $http, errorService ) {

        var worklistService = {

            getWorkListSummary: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/summary',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getWorkListEIP: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/enrollment',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getWorkListIncomplete: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/incomplete',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getWorkListRejected: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/rejected',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getWorkListDenied: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/denied',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getWorkListSubmittedNoResponse: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/submitted',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getWorkListFollowup: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/followup' ,
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            deleteWorklistTask: function ( data, successCallback, errorCallback) {
                $http({
                    url: baseSvcUrl + '/workList/close',
                    method: "POST",
                    data: data
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            getNotes: function ( data, successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/getNotes/' + data,
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },
            addNote: function ( data, successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/postNotes',
                    method: "POST",
                    data: data
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });
            },

            saveFollowUpDate: function ( data, successCallback, errorCallback) {
                $http({
                    url: baseSvcUrl + '/workList/followupitem',
                    method: "POST",
                    data: data
                })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function (data, status, headers, config) {
                        errorService.checkErrors(status, data, headers, errorCallback);
                    });

            }

    };

        return worklistService;

    } ] ) ;
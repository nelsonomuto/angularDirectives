angular.module('services.http.httpServiceUtil', [
    'errorService'
 ])

.factory('httpServiceUtil', function($http, errorService) {
    return {

        createServiceMethod: function (httpArgObject) {//TODO: Possible rename to more descriptive name.
        /*
         * TODO: propose to team to reduce code redundancy
         * The introduction of global utilities classes (inline with AngularJS best practices this should be an injectable service).
         * Similar to the use of your current errorService, except maybe rename it to show it is carrying utility methods.
         * 
         * For example a httpServiceUtil class/service
         * which may hold methods such as this createServiceMethod that encapsulates functionality that
         * seems to be repeated a lot.
         * 
         * -- Function doc --
         * params - httpArgObject: {
         *              method: '<PUT, GET, ...> http verb',
         *              url: 'url',
         *              dataMapping: <key, function(data){ return value; }>,
         *              requiredDataField: 'requiredFieldName'
         *          }
         *    
         * return value: Function 
         * The function returned is the one that is invoked on a service to make the asynch http request. By having a single point for defining
         * the logic for preparing a http service function we are reducing redundancy and maintenance overhead.
         */
        
            return function (serviceArguments) {//TODO: discuss with team flexibility of using an object literal for encapsulating service call args
            /*
             * -- Function doc --
             * params - serviceArguments: {
             *            url: 'url', 
             *            method: '<PUT, GET, ...> http verb'
             *            callback: 'callback function to be executed upon success of http request',
             *           
             *            errorCallback: 'optional callback to be executed upon failure of http request',
             *            data: 'optional <{}> object to be passed with request body',
             *            appendToUrl: 'optional valueToAppendToUrl'
             *         }
             * 
             * return value - undefined
             * 
             * The function encapsulates a lot of the repeated logic such as prepending a value to the url, 
             * appending the baseSvcUrl (base service url), serializing data to JSON, calling the callback on success and 
             * error handling on failure of the http request.
             */
                var url, data, dataCopy;
                
                url = baseSvcUrl + '/' + httpArgObject.url;
                
                if(!!serviceArguments.appendToUrl) {
                    url = url + '/' + serviceArguments.appendToUrl;    
                }
                
                if (!!serviceArguments.data) {
                    dataCopy = angular.copy(serviceArguments.data); //copy to avoid side effects to data reference in controller
                    
                    if(!!httpArgObject.requiredDataField &&(!(dataCopy[httpArgObject.requiredDataField] && dataCopy[httpArgObject.requiredDataField] !== null))){
                        console.log('httpServiceUtil requires value for data field: ' + httpArgObject.requiredDataField);
                        return serviceArguments.errorCallback([{
                            fieldName: httpArgObject.requiredDataField,
                            errors: [{
                                'id': 'invalid',
                                'message': httpArgObject.requiredDataField + 'is required.'
                            }]
                        }]);
                    }
                    
                    if (!!httpArgObject.dataMapping) {
                        data = {};
                        angular.forEach(httpArgObject.dataMapping, function (mappingInfo, key) {
                            if (!!mappingInfo.copy) {
                                data[key] = dataCopy[mappingInfo.copy] !== undefined? dataCopy[mappingInfo.copy] : null;    
                            }
                            else if (angular.isFunction(mappingInfo.calculator)) {
                                data[key] = mappingInfo.calculator(dataCopy);   
                            } 
                        });

                        angular.extend(dataCopy, data); 
                    }
                }
                
                $http({
                    url: url,
                    method: httpArgObject.method,
                    headers: {'Content-Type': 'application/json'},
                    data: angular.toJson(dataCopy),
                    tracker: serviceArguments.tracker
                })
                
                .success(function (data){
                    serviceArguments.callback(data);
                })
                
                .error(function(data, status, headers, config){
                    errorService.checkErrors(status, data, headers, serviceArguments.errorCallback || function (){}); 
                });
            };
        }
        
    };

});
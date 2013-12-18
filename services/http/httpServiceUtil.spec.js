describe('services.http.httpServiceUtil', function () {
    var $httpBackend, httpServiceUtil, baseServiceUrl, serviceMethod, callback;
    
    describe('service method returned by createServiceMethod', function () {
        beforeEach(function() {
        
            module('services.http.httpServiceUtil');
            
            baseServiceUrl = baseSvcUrl;
            
            inject(function ($injector){
                $httpBackend = $injector.get('$httpBackend');
                httpServiceUtil = $injector.get('httpServiceUtil');
            });
            
            serviceMethod = httpServiceUtil.createServiceMethod({
                method: 'POST', 
                url: 'userManagement/user'
            });
            callback = jasmine.createSpy('callback');
        });
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should prepend the base service url and a forward slash to the url', function () {
            //Expecting base service url and forward slash to be prepended to request url
            $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user').respond(200, 'success');
            
            serviceMethod({ 
                callback: callback
            });
            $httpBackend.flush();
            expect(callback).toHaveBeenCalledWith('success');
        });
        
        it('should call the service method\'s errorCallback on error', function () {
            var errorCallback = jasmine.createSpy('errorCallback');
            $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user').respond(500, 'error');
            serviceMethod({ 
                callback: callback,
                errorCallback: errorCallback
            });
            $httpBackend.flush();
            expect(callback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        });
        
        it('should accurately pass any request data to JSON and pass it into the http method argument object\'s data property ', function () {
            $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user', {testData: true}).respond(200, 'success');
            
            serviceMethod({ 
                callback: callback,
                data: { testData: true }
            });
            $httpBackend.flush();
            expect(callback).toHaveBeenCalledWith('success');
            
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
            
            $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user', {testData: false}).respond(200, 'success');
            serviceMethod({ 
                callback: callback,
                data: { testData: false }
            });
            
            $httpBackend.flush();
            expect(callback).toHaveBeenCalledWith('success');
        });
        
        it('should append any value specified in the appendToUrl property of the serviceArguments', function () {
            $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user/appendage').respond(200, 'success');
            
            serviceMethod({ 
                callback: callback,
                appendToUrl: 'appendage'
            });
            
            $httpBackend.flush();
            expect(callback).toHaveBeenCalledWith('success'); 
        });
        
        it('should always have JSON as the content header', function () {
           $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user', {}, 
            {"Content-Type":"application/json","Accept":"application/json, text/plain, */*","X-Requested-With":"XMLHttpRequest"})
           
           .respond(200, 'success');
            
            serviceMethod({ 
                callback: callback,
                data: {}
            });
            $httpBackend.flush();
            expect(callback).toHaveBeenCalledWith('success'); 
        });
        
        it('should call errorCallback if the required data field is not provided', function () {
            var errorCallback = jasmine.createSpy('errorCallback');
            serviceMethod = httpServiceUtil.createServiceMethod({
                method: 'POST', 
                url: 'userManagement/user',
                requiredDataField: 'id'
            });
            serviceMethod({
                callback: callback,
                errorCallback: errorCallback,
                data: { id: null }
            });
            expect(errorCallback).toHaveBeenCalled();
        });
        
        describe('dataMapping and calculated value conversion', function () {
            it('should map the data keys to return of dataMapping function corresponding to the specified keys', function () {
                $httpBackend.expectPOST(baseServiceUrl + '/userManagement/user', {
                    willChange: 'changed', unMapped: true, constant: 'TESTCONSTANT', test: 0, boolToString: 'Y', falseBool: 'N',
                    mapped1: 'mappedTESTCONSTANT', mapped2: 'TESTCONSTANT', mapped3: '2nd'
                })
                .respond(200, 'success');
                
                serviceMethod = httpServiceUtil.createServiceMethod({
                    method: 'POST', 
                    url: 'userManagement/user',
                    dataMapping: {
                        mapped1: {
                            calculator: function (data) { return 'mapped' + data.constant ; }
                        },
                        mapped2: {
                            copy: 'constant'
                        },
                        mapped3: {
                            calculator: function (data) { return '2nd'; }
                        },
                        willChange: {
                            calculator: function (data) { return 'changed'; }
                        },
                        boolToString: {
                            calculator: function (data) { return data.boolToString? 'Y' : 'N'; }
                        },
                        falseBool: {
                            calculator: function (data) { return data.falseBool? 'Y' : 'N'; }
                        }
                    }
                });
                serviceMethod({ 
                    callback: callback,
                    data: { willChange: false, unMapped: true, constant: 'TESTCONSTANT', test: 0, boolToString: true, falseBool: false }
                });
                
                $httpBackend.flush();
                expect(callback).toHaveBeenCalledWith('success');    
            });  
        });
    });    
});
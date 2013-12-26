describe('ambProvPrivate.chat tests', function () {
    var $scope, $rootScope, $httpBackend, element, $strap, privatesiteService, createController, $modal, $modalInstance;
    beforeEach(module('ambProvPrivate.chat'));
    beforeEach(inject(function ($injector) {
        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        //$strap = $injector.get('$strap');
        privatesiteService = $injector.get('privatesiteService');
        $modal = $injector.get('$modal');
        //$modalInstance = $injector.get('$modalInstance');
        var $controller = $injector.get('$controller');
        
        createController = function() {
            return $controller('HelpModalInstanceCtrl', {'$scope' : $scope, '$modalInstance': $modalInstance, 'privatesiteService': privatesiteService });
        };
    }));
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call getSupportAreas', function () {
        var data = {
            "products": [
                {
                    "productName": "Connect Center",
                    "productCode": null,
                    "chatURL": "http://admin.instantservice.com/links/5528/"
                },
                {
                    "productName": "Claims and Remits",
                    "productCode": null,
                    "chatURL": "http://admin.instantservice.com/links/5528/"
                },
                {
                    "productName": "RelayAssurance Practice",
                    "productCode": null,
                    "chatURL": "http://admin.instantservice.com/links/5528/"
                },
                {
                    "productName": "Payer Enrollment",
                    "productCode": null,
                    "chatURL": "http://admin.instantservice.com/links/5528/"
                },
                {
                    "productName": "General",
                    "productCode": null,
                    "chatURL": "http://admin.instantservice.com/links/5528/"
                }
            ],
            "appUser": {
                "id": 1841,
                "customerID": 2161,
                "customerName": null,
                "submitterId": "110772",
                "userName": "PromoUser1",
                "firstName": "firstpromo",
                "lastName": "lastpromo",
                "phone": null,
                "email": "promo@gmail.com",
                "password": null,
                "securityQuestion": null,
                "securityAnswer": null,
                "isAdmin": "Y",
                "createdDate": "2013-10-23",
                "roles": null,
                "userPreferences": null,
                "isActive": null,
                "payerEnrollmentURL": "https://dev.transactions.mckhboc.com/EnrollmentCentralApplication/?restartApplication"
            }
        };
        $httpBackend.expectGET('/privateApi/supportarea/chat').respond(data);
        var ctrl = createController();
        $httpBackend.flush();
        expect($scope.supportAreas).toEqual(data.products);        
    });
});
describe('services.user.user', function (){
    var userService, callback;
    
    beforeEach(function() {
        
        module('services.user.user');
        
        inject(function ($injector){
            $httpBackend = $injector.get('$httpBackend');
            userService = $injector.get('userService');
        });
        callback = jasmine.createSpy('callback');
        errorCallback = jasmine.createSpy('errorCallback');
    });
    
   it('should have a get user list GET method because it is READ api', function () {
       /*
        * This is simply to ensure we are not using POST for read API as was the case when the backend story was closed.
       */
       
       $httpBackend.expectGET(baseSvcUrl + '/userManagement/viewUserListForAccount').respond(200, 'success');
       userService.getUserList({
           callback: callback
       });
       $httpBackend.flush();
       expect(callback).toHaveBeenCalledWith('success');
   });
    
   it('ensure errorCallback is called', function () {
       $httpBackend.expectGET(baseSvcUrl + '/userManagement/viewUserListForAccount').respond(500, 'fail');
       userService.getUserList({
           callback: callback,
           errorCallback: errorCallback
       });
       $httpBackend.flush();
       expect(callback).not.toHaveBeenCalled();
       expect(errorCallback).toHaveBeenCalled();
   });
    
});
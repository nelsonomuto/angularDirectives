angular.module('services.user.user', [
    'services.http.httpServiceUtil'
])

.factory('userService', function(httpServiceUtil) {
    
    var userService;
    
    userService = {
        
        /*
         * By defining this user class in the commonly used userService, we avoid copy pasting this in the controllers that use the service.
         */
        payloadClass: function () {
            angular.extend(this, {
                userID: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                securityQuestion: '',
                securityAnswer: '',
                isActive: true,
                isAdmin: false
            });
        },

        sharedUserControllerProperties: {

        },
        
        isUserValid: function (user) {
            return !!user.userID && !!user.firstName && !!user.lastName && !!user.email && !!user.password && !!user.confirmPassword && !!user.securityQuestion && !!user.securityAnswer;  
        },
        
        //once encapsulated in a service will be injected and invoked as httpServiceUtil.createServiceMethod(args)
        getUserList: httpServiceUtil.createServiceMethod({ 
            method: 'GET',
            url: 'userManagement/viewUserListForAccount'
        }),
        
        getUserById: httpServiceUtil.createServiceMethod({//TODO: verify that backend implementation exists
            method: 'GET', 
            url: 'user',
            requiredDataField: 'id' 
        }), 
        
        createUser: httpServiceUtil.createServiceMethod({
            method: 'POST', 
            url: 'userManagement/user',
            dataMapping: {
                userName: {
                    copy: 'userID'
                },
                userID: {
                    calculator: function (data) { return null; }//id must always be null to create a new user
                },
                isActive: {
                    calculator: function (data) { return data.isActive? 'Y' : 'N'; }
                },
                isAdmin: {
                    calculator: function (data) { return data.isAdmin? 'Y' : 'N'; }
                }
            }
        }),
        
        editUser: httpServiceUtil.createServiceMethod({
            method: 'POST', //*Team does not use PUT for http calls to make edits
            url: 'userManagement/user',
            requiredDataField: 'id' 
        })
    };
    
    return userService;

});
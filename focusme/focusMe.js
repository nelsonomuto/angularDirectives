angular.module('directives.focusme.focusMe', [])

.directive('appFocusMe', function () { 
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.focus();    
        }
    };
});
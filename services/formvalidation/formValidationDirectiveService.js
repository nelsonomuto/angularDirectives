angular.module('services.formvalidation.formValidationDirectiveService', [])

.factory('formValidationDirectiveService', function() {
    
    return {
        validate: function (validateArgs) {
            /**
             * The validateArgs is an object as follows:
             * { scope: scope, element: element, attributes: attributes validations: validations }
             */
            
            var ngModel, validations, validationMapObject, modelName, modelProperty;
            
            ngModel = validateArgs.element.attr('ng-model');
            modelName = ngModel.substring(0, ngModel.indexOf('.'));
            modelProperty = ngModel.substring(ngModel.indexOf('.') + 1);
            
            validations = validateArgs.validations[modelProperty];
            
            angular.forEach(validations, function(val, name){
                var dashedName;
                dashedName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                validateArgs.element.attr('validation-' + dashedName, val);
            });
        }
    };
});
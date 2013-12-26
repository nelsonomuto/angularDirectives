(function(){
    var customValidations, toggleValidationMessage, createValidationFormatterLink, customValidationsModule;
    
    customValidations = [
        {
            customValidationAttribute: 'validationFieldRequired',
            errorMessage: 'This is a required field',
            validator: function (val){
                return (/\S/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationConfirmPassword',
            errorMessage: 'Passwords do not match. Please re-enter Confirm Password.',
            validator: function (val, attr, element, model, ctrl){
                return model.password === element.val();
            }
        },
        {
            customValidationAttribute: 'validationEmail',
            errorMessage: 'Please enter a valid email',
            validator: function (val){
                return (/^.*@.*\..*[a-z]$/i).test(val);
            }
        },
        {
            customValidationAttribute: 'validationNoSpace',
            errorMessage: 'Cannot contain any spaces',
            validator: function (val){
                return (/^[^\s]+$/).test(val);
            }
        },
        {
            customValidationAttribute: 'validationMinLength',
            errorMessage: function (attr) { return 'Minimum of ' + attr + ' characters'; },
            validator: function (val, attr){
                return val.length >= parseInt(attr, 10);    
            }   
        },
        {
            customValidationAttribute: 'validationMaxLength',
            errorMessage: function (attr) { return 'Maximum of ' + attr + ' characters'; },
            validator: function (val, attr){
                return val.length <= parseInt(attr, 10);
            }   
        },
        {
            customValidationAttribute: 'validationOnlyAlphabets',
            errorMessage: 'Valid characters are: A-Z, a-z',
            validator: function (val){
                return (/^[a-z]*$/i).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneUpperCaseLetter',
            errorMessage: 'Must contain at least one uppercase letter',
            validator: function (val){
                return (/^(?=.*[A-Z]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneLowerCaseLetter',
            errorMessage: 'Must contain at least one lowercase letter',
            validator: function (val){
                return (/^(?=.*[a-z]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneNumber',
            errorMessage: 'Must contain at least one number',
            validator: function (val){
                return (/^(?=.*[0-9]).+$/).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationOneAlphabet',
            errorMessage: 'Must contain at least one alphabet',
            validator: function (val, attr, controller) {
                return (/^(?=.*[a-z]).+$/i).test(val);    
            }
        },
        {
            customValidationAttribute: 'validationNoSpecialChars',
            errorMessage: 'Valid characters are: A-Z, a-z, 0-9',
            validator: function (val){
                return (/^[a-z0-9_\-\s]*$/i).test(val);
            }
        }
    ];
    
    createValidationFormatterLink = function (formatterArgs, $timeout) {
        
        return function($scope, $element, $attrs, ngModelController) {
            var errorMessage, errorMessageElement, modelName, model, propertyName, validate;
            
            if($attrs[formatterArgs.customValidationAttribute]){
                modelName = $attrs.ngModel.substring(0, $attrs.ngModel.indexOf('.'));
                propertyName = $attrs.ngModel.substring($attrs.ngModel.indexOf('.') + 1);
                model = $scope[modelName];
                if(typeof(formatterArgs.errorMessage) === 'function'){
                    errorMessage = formatterArgs.errorMessage($attrs[formatterArgs.customValidationAttribute]);
                } else {
                    errorMessage = formatterArgs.errorMessage;
                }
                
                errorMessageElement = angular.element(
                    '<span class="CustomValidationError '+ formatterArgs.customValidationAttribute + ' '+ propertyName +'property">' +
                    errorMessage + '</span>');
                
                $element.after(errorMessageElement);
                errorMessageElement.hide();
                
                if(formatterArgs.customValidationAttribute === 'validationConfirmPassword'){
                    $element.add('[name=password]').on('keyup', function () {
                        var passwordMatch =  $('[name=password]').val() === $element.val();
                        $scope.$apply(function () {
                           ngModelController.$setValidity(formatterArgs.customValidationAttribute.toLowerCase(), passwordMatch); 
                           $('[name=confirmPassword]')
                                .siblings('.CustomValidationError.validationConfirmPassword:first')
                                    .toggle(!passwordMatch);
                        });
                    });
                }

                validate = function (onRunCustomValidations) {
                    var isValid, value, customValidationBroadcastArg;

                    value = $element.val();

                    isValid = formatterArgs.validator(value, $attrs[formatterArgs.customValidationAttribute], $element, model, ngModelController);

                    ngModelController.$setValidity(formatterArgs.customValidationAttribute.toLowerCase(), isValid);

                    customValidationBroadcastArg = {
                        isValid: isValid,
                        validation: formatterArgs.customValidationAttribute,
                        model: model,
                        controller: ngModelController,
                        element: $element
                    };

                    $scope.$broadcast('customValidationComplete', customValidationBroadcastArg);

                    if(onRunCustomValidations) {
                        if (formatterArgs.customValidationAttribute !== 'validationFieldRequired'){
                            return value;
                        }
                    }

                    $element.siblings('.CustomValidationError.'+formatterArgs.customValidationAttribute + '.' + propertyName + 'property:first')
                        .toggle(!isValid);

                    return value;
                };

                ngModelController.$parsers.push(function() {
                    return validate();
                });

                $scope.$on('runCustomValidations', function () {
                    validate(true);
                });
            }    
        };    
    };
    
    customValidationsModule = angular.module('directives.customvalidation.customValidations', []);
    
    angular.forEach(customValidations.reverse(), function(customValidation){ //Reversing array to preserver priority order
        customValidationsModule.directive('input', function ($timeout) {
            return {
                require: '?ngModel',
                restrict: 'E',
                link: createValidationFormatterLink(customValidation, $timeout)
            };
        });   
    });
    
})();
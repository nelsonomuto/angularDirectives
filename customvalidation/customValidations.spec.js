describe('directives.customvalidation.customValidations', function () {
    var element, scope, errorMessages, hiddenErrorMessages, visibleErrorMessages;

    beforeEach(function (){
        module('directives.customvalidation.customValidations');
        inject(function ($rootScope, $compile){
            element = angular.element('<form>' +
                '<input type="text" name="password" id="password" ng-model="user.password" validation-field-required="true" '+
                'validation-min-length="8" validation-one-alphabet="true" validation-one-number="true" validation-one-lower-case-letter="true" '+
                'validation-one-upper-case-letter="true" validation-no-special-chars="true" validation-no-space="true" /></form>');
            scope = $rootScope;
            $compile(element)(scope);
            scope.$digest();
            errorMessages = element.find('.CustomValidationError');
        });
    });
    it('should contain eight error messages', function () {
        expect(errorMessages.length).toEqual(8);
    });
    it('should contain eight hidden error messages', function () {
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"]');

        expect(hiddenErrorMessages.length).toEqual(8);
        expect(visibleErrorMessages.length).toEqual(0);
    });
    it('should only show required validation error on the runCustomValidations event', function () {
        scope.$broadcast('runCustomValidations');
        hiddenErrorMessages = element.find('.CustomValidationError[style="display: none;"]');
        visibleErrorMessages = element.find('.CustomValidationError[style="display: inline;"]');
        expect(hiddenErrorMessages.length).toEqual(7);
        expect(visibleErrorMessages.length).toEqual(1);
    });

    describe('validation-confirm-password', function () {
        it('should not show passwords match if ', function () {

        });
    });
});
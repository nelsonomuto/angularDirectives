xdescribe('services.formvalidation.formValidationDirectiveService', function () {
    var fvdservice, scope, element, attr;
    
    beforeEach(function() {
        
        module('formValidationDirectiveService');
        
        inject(function ($injector){
            fvdservice = $injector.get('formValidationDirectiveService');
        });
        
        attr = jasmine.createSpyObj('attr spyObj', ['dynamic']);
        scope = {
            model: {
                id: null,
                name: null,
                email: null,
                age: null
            },
            $watch: jasmine.createSpy('scope.$watch spy')
        };
    });
    
    describe('validation', function () {
        beforeEach(function () {
            element = angular.element('<span ng-model="model.id"></span>');
            fvdservice.validate({
                scope: scope,
                element: element,
                attr: attr,
                validations: {
                    id: {
                        minLength: 5,
                        maxLength: 15,
                        noSpace: true,
                        required: true
                    }
                }
            }); 
        });
        it('should validate min and max length with ngMinLength and ngMaxLength respectively', function () {
            //using min and max length respectively in the before each fvdservice.validate call validations arg
            expect(element.attr('ng-minlength')).toEqual('5');
            expect(element.attr('ng-maxlength')).toEqual('15');
        });
        
        it('should validate required fields', function () {
            //using required in the before each fvdservice.validate call validations arg
            expect(element.attr('ng-required')).toEqual('true');    
        });
        
        it('should NOT add ng-required when not specified', function () {
            element = angular.element('<span ng-model="model.id"></span>');
            fvdservice.validate({
                scope: scope,
                element: element,
                attr: attr,
                validations: {
                    id: {
                        minLength: 5,
                        maxLength: 15
                    }
                }
            });
            expect(element.attr('ng-required')).not.toEqual('true');    
        });
        
        it('should validate patterns', function () {
            //using noSpace in the before each fvdservice.validate call validations arg
            expect(element.attr('ng-pattern')).toEqual('pattern_noSpace');    
            expect(scope.pattern_noSpace).toEqual(/^[^\s]+$/);    
        });
    });
});
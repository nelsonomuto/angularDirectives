angular.module('directives.inlineinputlabel.inlineInputLabel', [
])

.directive('input', function() {

    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var label, id, inputType;

            inputType = angular.lowercase(attrs.type);

            if (inputType === 'radio' || inputType === 'checkbox') {
                id = element.attr('id') || element.attr('name');
                label = angular.element('label[for=' + id + ']');
                if(label.length > 0) {
                    label.addClass('inlineLabel');
                }
            }
        }
    };
});
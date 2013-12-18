angular.module("privatesiteDirective", [])

    .directive('confirmExit', function() {
         return {
              link: function(scope, elm, attrs, ctrl) {

                  scope.$on('$locationChangeStart', function(event, next, current) {
                       if (scope.demographForm.$dirty) {
                          if(confirm("The form has not been saved, click \"OK\" if want to stay on the page!")) {
                                event.preventDefault();
                          }
                       }
                  });

               }
         };
    })

    .directive('forceFocus', function($timeout, $parse) {
      return {
        link: function(scope, element, attrs, ctrl) {
          var model = $parse(attrs.forceFocus);
          var elementID = '#'+element[0].id;

          scope.$watch(model, function(value) {
            // console.log('value=',value);
            // console.log('model= ',model);
            // console.log('this= ',elementID);
            if(value === true) { 
              $timeout(function() {
                $(elementID).focus();
              });
            }
          });
        }
      };
    })
;
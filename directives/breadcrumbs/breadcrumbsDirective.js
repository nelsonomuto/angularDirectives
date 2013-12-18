angular.module('rh.breadcrumbs', [ 'ui.router.state' ])

    .directive('breadcrumbs', function ($state, $stateParams) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div class="breadcrumbContainer">' +
                '<div ng-repeat="pathitem in paths" >' +
                '{{pathitem.label}}' +
                '<span ng-hide="$last" class="bcdivider"> &gt; </span>'+
                '</div>'+
                '</div>',
            link: function (scope, element ) {

                scope.$watch(function() { return $state.current; }, function() {
                    scope.paths = [];
                    if( $state.$current ) {
                        for( var i = 0 ; i <  $state.$current.path.length ; i++  ) {
                            var pathitem = {};
                            if( angular.isDefined( $state.$current.path[i].data ) && angular.isDefined( $state.$current.path[i].data.pageTitle )  ) {
                                pathitem.label = $state.$current.path[i].data.pageTitle;
                            }
                            //pathitem.url = $state.$current.path[i].url.format($stateParams);
                            scope.paths.push( pathitem );
                        }
                    }
                }, true);
            }
        };
    });
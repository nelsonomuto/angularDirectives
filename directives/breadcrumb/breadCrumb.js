angular.module('directives.breadcrumb.breadCrumb', [
    'ui.router.state'
])

.directive('appBreadCrumb', function ($state) {
    /**
    *
    * To use the app breadcrumb place the <app-bread-crumb></app-bread-crumb> tag in your template.
    * Ensure that your state objects have a crumb property that will be displayed on the breadcrumbs. In the absence thereof, the name will
    * be capitalized and used as the breadcrumb unless you explicitly have a property on the state object named hideCrumb that evaluates to true
    * 
    *  It was intented NOT to use the customData 'data' attribute for the breadcrumb: nested states should not inherit the crumb of the parent.
    *
    *  Use case example: 
    *  $stateProvider
            .state( 'account', {
                url: '/account',
                crumb: 'Account', //<---------------This is the string displayed as the breadcrumb.
                hideCrumb: true, // <-------------- Adding this will ensure this state is ignored by the breadCrumbs directive.
                views: {
                    "main": {
                        controller: 'adminAccountCtrl',
                        templateUrl: 'admin/account/account.tpl.html'
                    }
                }
            })
            .state( 'account.account_features', {
                url: '/features',
                crumb: 'Features',
                views: {
                    "tabcontent": {
                        controller: 'adminFeaturesCtrl',
                        templateUrl: 'admin/account/features.tpl.html'
                    }
                }
            })

        State breadcrumb configuration and nomenclature
        1.  crumb: <string> 
         This is the label of the state’s breadcrumb. The name of the property explicitly shows the intention and use as opposed to using a pageTitle, stateLabel or state.name (properties whose application is not specific to breadcrumbs) whereby the pageTitle may be intended to be different than the page breadcrumb. Using ‘crumb’ adds clarity and allows for flexibility to have a crumb and pageTitle that are different as will most certainly be the case in nested states (Ex: account.summary state may have summary as its crumb because it’s nested under account but have ‘Account Summary’ as its page title.
        2.  hideCrumb: <Boolean>
        Again here the intent is to be as specific as possible for clarity and flexibility. 

    **/

    return {
        restrict: 'E',
        transclude: false,
        templateUrl: 'admin/user/breadCrumb.tpl.html',//Temporarily placed in admin folder until moved out to common location
        //TODO: map common folder - Discuss with team so template can be in directives folder as package
//        templateUrl: 'common/directives/breadcrumb/breadCrumb.tpl.html'//,
        
        link: function (scope, element, attrs) {
            var onStateChange, getCrumb;

            scope.onBreadCrumbClick = function (stateName) {
                $state.go(stateName);    
            };

            scope.isFirstBreadCrumb = function (state) {
                return state.name === scope.previousBreadCrumbStates[0] && scope.previousBreadCrumbStates[0].name;
            };

            getCrumb = function (state, index) {
                var crumb;
                crumb = state.crumb || state.pageTitle || state.name.charAt(0).toUpperCase() + state.name.substring(1);
                if(index === 0) {
                    return crumb;
                }
                return '> ' + crumb;
            };

            onStateChange = function () {
                scope.currentBreadCrumbState = angular.copy($state.current);
                scope.currentBreadCrumbState.crumb = getCrumb(scope.currentBreadCrumbState);

                scope.previousBreadCrumbStates = [];

                angular.forEach($state.$current.path, function (path, index) {
                    var currentState;

                    if(path.self.url !== '' && path.self.name !== $state.current.name) {
                         
                        if(path.self.hideCrumb !== true){
                            currentState = angular.copy(path.self);
                            currentState.crumb = getCrumb(currentState, index);
                            scope.previousBreadCrumbStates.push(currentState); 
                        }
                    }
                });

                if(scope.previousBreadCrumbStates.length === 0) {
                    scope.previousBreadCrumbStates.push($state.get('home'));
                }
            };

            scope.$watch(function() { return $state.current; }, onStateChange);
        }
    };
});
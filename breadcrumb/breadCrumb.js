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
    *
    *  Use case example: 
    *  $stateProvider
            .state( 'account', {
                url: '/account',
                data: {
                    crumb: 'Account', //<--------------- This is the string displayed as the breadcrumb.
                    hideCrumb: true, // <-------------- Adding this will ensure this state is ignored by the breadCrumbs directive.
                },
                views: {
                    "main": {
                        controller: 'adminAccountCtrl',
                        templateUrl: 'admin/account/account.tpl.html'
                    }
                }
            })
            .state( 'account.account_features', {
                url: '/features',
                data: {
                    crumb: 'Features',
                    crumbHierarchy: ['home', 'account_demographics'] //<------------------- Explicitly build breadcrumb hierarchy using state names
                },
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
        3. crumbHierarchy: <Array>
            Specify an array of state names that will be used to generate the bread crumb hierarchy, thereby ignoring the state's parent(s).

    **/

    var getCrumb, getUrl;

    getCrumb = function (state, index) {
        var crumb;
        crumb = state.data && state.data.crumb || state.data && state.data.pageTitle || state.name.charAt(0).toUpperCase() + state.name.substring(1);
        if(index === 0) {
            return crumb;
        }
        return '> ' + crumb;
    };

    getUrl = function (state, index, paths) {
        var url, parentUrl, name, parentState;

        url = state.url;

        if(typeof(index) !== 'undefined' && typeof(paths) !== 'undefined'){
            while(index > 0){                            
                parentUrl = paths[--index].self.url;         
                url = parentUrl ? parentUrl + url : url;
            }
        } else {
            name = state.name;
            while(parentState = getParentState(name)){
                url = parentState.name !== '' ? parentState.url + url : url;
                name = name.substring(0, name.lastIndexOf(parentState.name));
                if(name.indexOf('.') === -1){
                    break;
                }
            }
        }

        return url;
    };

    getParentState = function (name) {
        var lastIndex;

        if(lastIndex = name.lastIndexOf('.')){
            return $state.get(name.substring(0, lastIndex));
        }
    };

    return {
        restrict: 'E',
        transclude: false,
        templateUrl: 'directives/breadcrumb/breadCrumb.tpl.html',        
        link: function (scope, element, attrs) {
            var onStateChange;

            scope.onBreadCrumbClick = function (stateName) {
                $state.go(stateName);    
            };

            scope.isFirstBreadCrumb = function (state) {
                return state.name === scope.previousBreadCrumbStates[0] && scope.previousBreadCrumbStates[0].name;
            };            

            onStateChange = function () {   
                var parentStates = [];

                scope.currentBreadCrumbState = angular.copy($state.current);
                if (typeof(scope.currentBreadCrumbState.data) !== 'object') {
                    scope.currentBreadCrumbState.data = {};
                }
                scope.currentBreadCrumbState.data.crumb = getCrumb(scope.currentBreadCrumbState);

                scope.previousBreadCrumbStates = [];

                if (scope.currentBreadCrumbState.data.crumbHierarchy && scope.currentBreadCrumbState.data.crumbHierarchy.length > 0) {
                    angular.forEach(scope.currentBreadCrumbState.data.crumbHierarchy, function (stateName) {
                        var stateWithModifiedUrl;

                        stateWithModifiedUrl = angular.copy($state.get(stateName)); 
                        stateWithModifiedUrl.url = getUrl(stateWithModifiedUrl);  
                        parentStates.push(stateWithModifiedUrl);
                    });
                } else {
                    angular.forEach($state.$current.path, function (path, index) {
                        var stateWithModifiedUrl;

                        if(path.self.abstract !== true){
                            stateWithModifiedUrl = angular.copy(path.self); 
                            stateWithModifiedUrl.url = getUrl(stateWithModifiedUrl, index, $state.$current.path);  
                            parentStates.push(stateWithModifiedUrl);
                        }
                    });
                }

                angular.forEach(parentStates, function (pathOrState, index) {
                    var currentState, hideCrumb, parentState;

                    parentState = (typeof(pathOrState.self) !== 'undefined') ? pathOrState.self : pathOrState;

                    if(parentState.url !== '' && parentState.name !== $state.current.name) {
                        hideCrumb = parentState.data && parentState.data.hideCrumb;
                        if(hideCrumb !== true){
                            currentState = angular.copy(parentState);
                            if (typeof(currentState.data) !== 'object') {
                                currentState.data = {};
                            }
                            currentState.data.crumb = getCrumb(currentState, index);
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
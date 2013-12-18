describe('directives.breadcrumb.breadCrumb', function () {
    var scope, element, $state, currentState, firstState, secondState;
    beforeEach(function () {
        module('directives.breadcrumb.breadCrumb', 'admin/user/breadCrumb.tpl.html', 'ui.router.state');
        inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope;
            $state = $injector.get('$state');
            
            currentState = {
                name: 'currentState',
                url: 'current',
                crumb: 'Current State Crumb2'
            };

            $state.current = currentState;

            firstState = {
                name: 'first',
                url: 'firstStateUrl2',
                crumb: 'state uno'  
            };
            
            secondState = {
                name: 'second',
                url: 'secondStateUrl2',
                crumb: 'state dos'
            };
            spyOn($state, 'get').andCallFake(function (stateName) {
            if(stateName === 'home') {
                    return {
                        url: '/home',
                        crumb: 'Home'
                    };
                }
            });
            element = angular.element('<app-bread-crumb></app-bread-crumb>');
            $state.$current = {
                path: [
                    {
                        self: firstState
                    },
                    {
                        self: secondState
                    },
                    {
                        self: currentState
                    }                        
                ]
            };
            $compile(element)(scope);
            scope.$digest();
        });            
    });

    it('should only have two previous states', function () {
        expect(element.find('a').length).toEqual(2);   
    });

    it('should add the parent states as previous states', function () {
        var previousLinks;
        
        previousLinks = element.find('a');        
        expect(angular.element(previousLinks[0]).attr('href')).toEqual('#' + firstState.url);
        expect(angular.element(previousLinks[1]).attr('href')).toEqual('#' + secondState.url);
        
    });

    

    describe('Template', function (){
        it('should include the arrow before the crumb in each link but the home link', function (){
           var previousLinks;
        
            previousLinks = element.find('a');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual(firstState.crumb);
            expect(angular.element(previousLinks[1]).html().trim()).toEqual('&gt; ' + secondState.crumb);
        });
        it('should add the current state as a span with greater sign prepended', function () {
            expect(element.find('.activeBreadCrumb').html().trim()).toEqual("&gt; Current State Crumb2");    
        });
        it('should show home if there are no existing previous states', function (){
           var previousLinks;
           inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: 'current',
                    crumb: 'Current State Crumb2'
                };

                $state.current = currentState;
                $state.$current = {
                    path: [
                        {
                            self: currentState
                        }                        
                    ]
                };
                $compile(element)(scope);
                scope.$digest();
            });
            
            previousLinks = element.find('a');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual('Home');
            expect(angular.element(previousLinks[0]).attr('href')).toEqual('#/home');
            expect(element.find('a').length).toEqual(1); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });
         it('should not show a crumb for states configured with hideCrumb as true', function (){
           var previousLinks;
           inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: 'current',
                    crumb: 'Current State Crumb2'
                };

                firstState = {
                    name: 'first',
                    url: 'firstStateUrl2',
                    crumb: 'state uno',
                    hideCrumb: true
                };
                
                secondState = {
                    name: 'second',
                    url: 'secondStateUrl2',
                    crumb: 'state dos'
                };

                $state.current = currentState;
                $state.$current = {
                    path: [
                        {
                        self: firstState
                        },
                        {
                            self: secondState
                        },
                        {
                            self: currentState
                        }                      
                    ]
                };
                $compile(element)(scope);
                scope.$digest();
            });
            
            previousLinks = element.find('a');
            expect(angular.element(previousLinks[0]).attr('href')).toEqual('#' + secondState.url);
            expect(element.find('a').length).toEqual(1); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });
        it('should show either the state.data.pageTitle or capitalized state.name in abscense of state.crumb', function (){
           var previousLinks;
           inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: 'current',
                    crumb: 'Current State Crumb2'
                };

                firstState = {
                    name: 'first',
                    url: 'firstStateUrl2',
                    hideCrumb: false
                };
                
                secondState = {
                    name: 'second',
                    pageTitle: 'pageTitle',
                    url: 'secondStateUrl2'
                };

                $state.current = currentState;
                $state.$current = {
                    path: [
                        {
                        self: firstState
                        },
                        {
                            self: secondState
                        },
                        {
                            self: currentState
                        }                      
                    ]
                };
                $compile(element)(scope);
                scope.$digest();
            });
            
            previousLinks = element.find('a');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual(firstState.name.charAt(0).toUpperCase() + firstState.name.substring(1));
            expect(angular.element(previousLinks[1]).html().trim()).toEqual('&gt; ' + secondState.pageTitle);
            expect(element.find('a').length).toEqual(2); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });
    });
});
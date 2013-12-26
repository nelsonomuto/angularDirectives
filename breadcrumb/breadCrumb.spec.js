describe('directives.breadcrumb.breadCrumb', function () {
    var scope, element, $state, currentState, firstState, secondState;
    beforeEach(function () {
        module('directives.breadcrumb.breadCrumb', 'directives/breadcrumb/breadCrumb.tpl.html', 'ui.router.state');
        inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope;
            $state = $injector.get('$state');
            
            currentState = {
                name: 'currentState',
                url: '/current',
                data: {
                    crumb: 'Current State Crumb2'
                }
            };

            $state.current = currentState;

            firstState = {
                name: 'first',
                url: '/firstStateUrl2',
                data: {
                    crumb: 'state uno' 
                } 
            };
            
            secondState = {
                name: 'second',
                url: '/secondStateUrl2',
                data: {
                    crumb: 'state dos'
                }
            };
            spyOn($state, 'get').andCallFake(function (stateName) {
                if(stateName === 'home') {
                    return {
                        url: '/home',
                        data: {
                            crumb: 'Home'
                        }
                    };
                }
                if(stateName === 'first') {
                    return firstState;
                }
                if(stateName === 'second') {
                    return secondState;
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
        expect(element.find('a.breadcrumb').length).toEqual(2);   
    });

    it('should add the parent states as previous states', function () {
        var previousLinks;
        previousLinks = element.find('a.breadcrumb');        
        expect('#' + firstState.url).toEqual(angular.element(previousLinks[0]).attr('href'));
        expect('#' + firstState.url + secondState.url).toEqual(angular.element(previousLinks[1]).attr('href')); 
    });

    xit('should NOT have any parent states when configured to ignore parents', function (){
        var previousLinks;
        inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope;
            $state = $injector.get('$state');

            currentState = {
                name: 'currentState',
                url: '/current',
                data: {
                    crumb: 'Current State Crumb2'
                }
            };

            $state.current = currentState;

            firstState = {
                name: 'first',
                url: '/firstStateUrl2',
                data: {
                    crumb: 'state uno' 
                } 
            };

            secondState = {
                name: 'second',
                url: '/secondStateUrl2',
                data: {
                    crumb: 'state dos'
                }
            };
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
        previousLinks = element.find('a.breadcrumb');
        expect(previousLinks.length).toEqual(0);
    });

    describe('Template', function (){
        it('should include the arrow before the crumb in each link but the home link', function (){
           var previousLinks;
        
            previousLinks = element.find('a.breadcrumb');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual(firstState.data.crumb);
            expect(angular.element(previousLinks[1]).html().trim()).toEqual('&gt; ' + secondState.data.crumb);
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
                    url: '/current',
                    data: {
                        crumb: 'Current State Crumb2'
                    }
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
            
            previousLinks = element.find('a.breadcrumb');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual('Home');
            expect(angular.element(previousLinks[0]).attr('href')).toEqual('#/home');
            expect(element.find('a.breadcrumb').length).toEqual(1); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });
         it('should not show a crumb for states configured with hideCrumb as true', function (){
           var previousLinks;
           inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: '/current',
                    data: {
                        crumb: 'Current State Crumb2'
                    }
                };

                firstState = {
                    name: 'first',
                    url: '/firstStateUrl2',
                    data: {
                        crumb: 'state uno',
                        hideCrumb: true
                    }
                };
                
                secondState = {
                    name: 'second',                    
                    url: '/secondStateUrl2',
                    data: {
                        crumb: 'state dos'
                    }
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
            
            previousLinks = element.find('a.breadcrumb');
            expect('#' + firstState.url + secondState.url).toEqual(angular.element(previousLinks[0]).attr('href')); 
            expect(element.find('a.breadcrumb').length).toEqual(1); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });
        it('should show either the state.data.pageTitle or capitalized state.name in abscense of state.data.crumb', function (){
           var previousLinks;
           inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: '/current',
                    data: {
                        crumb: 'Current State Crumb2'
                    }
                };

                firstState = {
                    name: 'first',
                    url: '/firstStateUrl2',
                    data: {
                        hideCrumb: false
                    }
                };
                
                secondState = {
                    name: 'second',
                    data: {
                        pageTitle: 'pageTitle'
                    },
                    url: '/secondStateUrl2'
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
            
            previousLinks = element.find('a.breadcrumb');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual(firstState.name.charAt(0).toUpperCase() + firstState.name.substring(1));
            expect(angular.element(previousLinks[1]).html().trim()).toEqual('&gt; ' + secondState.data.pageTitle);
            expect(element.find('a.breadcrumb').length).toEqual(2); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });

        it('should be able to add states whose state.data is undefined', function (){
            var previousLinks;
            inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: '/current',
                    data: {
                        crumb: 'Current State Crumb2'
                    }
                };

                firstState = {
                    name: 'first',
                    url: '/firstStateUrl2',
                    data: {
                        hideCrumb: false
                    }
                };
                
                secondState = {
                    name: 'second',
                    url: '/secondStateUrl2'
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
            expect(angular.element(previousLinks[1]).html().trim()).toEqual('&gt; ' + secondState.name.charAt(0).toUpperCase() + secondState.name.substring(1));
            expect(element.find('a').length).toEqual(2); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });

        it('should use the explicit crumbHierarchy if defined in favor of searching for parents', function(){
            var previousLinks;
            inject(function ($injector, $compile, $rootScope) {
                scope = $rootScope;
                $state = $injector.get('$state');
                
                currentState = {
                    name: 'currentState',
                    url: '/current',
                    data: {
                        crumb: 'Current State Crumb2',
                        crumbHierarchy: ['first', 'second']
                    }
                };

                firstState = {
                    name: 'first',
                    url: '/firstStateUrl2',
                    data: {
                        hideCrumb: false
                    }
                };
                
                secondState = {
                    name: 'second',
                    url: '/secondStateUrl2'
                };

                $state.current = currentState;
                $state.$current = {
                    path: [ ] //No path created by nesting to emulate a state without parents to use state.data.crumbHierarchy explicitly
                };
                $compile(element)(scope);
                scope.$digest();
            });
            
            previousLinks = element.find('a');
            expect(angular.element(previousLinks[0]).html().trim()).toEqual(firstState.name.charAt(0).toUpperCase() + firstState.name.substring(1));
            expect(angular.element(previousLinks[1]).html().trim()).toEqual('&gt; ' + secondState.name.charAt(0).toUpperCase() + secondState.name.substring(1));
            expect(element.find('a').length).toEqual(2); 
            expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");   
        });
    });
    it('should build child link urls by appending parent urls', function (){
       var previousLinks;
       inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope;
            $state = $injector.get('$state');
            
            currentState = {
                name: 'currentState',
                url: '/current',
                data: {
                    crumb: 'Current State Crumb2'
                }
                
            };

            firstState = {
                name: 'first',
                url: '/firstStateUrl2',
                abstract: true
            };
            
            secondState = {
                name: 'second',
                data: {
                    pageTitle: 'pageTitle'
                },
                url: '/secondStateUrl2'
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
        expect(element.find('a').length).toEqual(1); 
        expect(secondState.data.pageTitle).toEqual(angular.element(previousLinks[0]).html().trim());
        expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");  

        expect('#'+ firstState.url + secondState.url).toEqual(angular.element(previousLinks[0]).attr('href'));
    });     
    it('should build child link urls by appending parent urls even when using explicit crumbHierarchy', function (){
       var previousLinks;
       inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope;
            $state = $injector.get('$state');
            
            currentState = {
                name: 'second.currentState',
                url: '/current',
                data: {
                    crumb: 'Current State Crumb2',
                    crumbHierarchy: ['second']
                }
                
            };

            firstState = {
                name: 'first',
                url: '/firstStateUrl2',
                abstract: true
            };
            
            secondState = {
                name: 'first.second',
                data: {
                    pageTitle: 'pageTitle'
                },
                url: '/secondStateUrl2'
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
        expect(element.find('a').length).toEqual(1); 
        expect(secondState.data.pageTitle).toEqual(angular.element(previousLinks[0]).html().trim());
        expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");  

        expect('#'+ firstState.url + secondState.url).toEqual(angular.element(previousLinks[0]).attr('href'));
    });         
    it('should not show abstract breadcrumbs', function (){
       var previousLinks;
       inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope;
            $state = $injector.get('$state');
            
            currentState = {
                name: 'currentState',
                url: '/current',
                data: {
                    crumb: 'Current State Crumb2'
                }
            };

            firstState = {
                name: 'first',
                url: '/firstStateUrl2',
                abstract: true
            };
            
            secondState = {
                name: 'second',
                data: {
                    pageTitle: 'pageTitle'
                },
                url: '/secondStateUrl2'
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
        
        expect(element.find('span').html().trim()).toEqual("&gt; Current State Crumb2");  
        previousLinks = element.find('a');
        expect(element.find('a').length).toEqual(1); 
        expect(secondState.data.pageTitle).toEqual(angular.element(previousLinks[0]).html().trim());
    });
});
angular.module('ambProvPrivate.chat', ['$strap', 'privatesiteService'])
.directive('appChat', function() {
  return {
    restrict: 'E',
    template: '<a href="javascript:void(0)" ng-click="chat()" class="chat-link"><div ng-transclude></div></a>',
    transclude: true,
    replace: true,
    controller: ['$scope', '$modal', function($scope, $modal) {
      $scope.chat = function() {
            var modalInstance = $modal.open({
                templateUrl: 'directives/chat/chatSupportModal.tpl.html',
                controller: 'HelpModalInstanceCtrl'
            });
      };
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
    }
  };
})
.controller( 'HelpModalInstanceCtrl', function ( $scope, $modalInstance, privatesiteService) {
            
          $scope.supportAreas = {};
        
          $scope.supportArea = {};
        
          $scope.close = function () {
            $modalInstance.dismiss('close');
          };
    
          $scope.supportAreasCallbackError = null;

          var supportAreasSuccessCallback = function (data) {
            $scope.supportAreas = data.products;
            $scope.supportArea = $scope.supportAreas[0];
          };

          var supportAreasErrorCallback = function (status, data) {
            $scope.supportAreasCallbackError = data;
          };

          privatesiteService.getSupportAreas(supportAreasSuccessCallback, supportAreasErrorCallback);
})
;
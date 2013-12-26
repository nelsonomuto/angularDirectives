angular.module('directives.progressbar.progressBar', [
    'ui.bootstrap.progressbar'
])

.directive('appProgressBar', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/progressbar/progressBar.tpl.html'
    };
});
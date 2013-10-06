angular.module('lyd', ['ngSanitize', 'ngDragDrop']).
    run(['$location', '$rootElement', function ($location, $rootElement) {
        $rootElement.off('click');
      }]);
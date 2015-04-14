(function() {
  'use strict';

  angular.module('application', [
    'leaflet-directive',
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .controller('MapCtrl', function($scope, $log, $state, $http){

      // Get list of JSON places
        $http.jsonp('https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=5000&gscoord=38.715%7C-75.104&gslimit=30&format=json&callback=JSON_CALLBACK').success(function(data) {
            $scope.places = data;
            $scope.listings = $scope.places.query.geosearch;
            $scope.markers = {};

      // Place those on the map
            for (var x = 0; x < $scope.listings.length; x++) {
              $scope.markers[x] = {
                    lat: $scope.listings[x].lat,
                    lng: $scope.listings[x].lon,
                    message: $scope.listings[x].title,
                    focus: true,
                    draggable: false
              };
            }

            angular.extend($scope, {
                markers: $scope.markers
            });

        });

        // Set map center and zoom
        angular.extend($scope, {

            center: {
                lat: 38.727,
                lng: -75.101,
                zoom: 13
            },

            events: {
                map: {
                    enable: ['click', 'popupopen'],
                    logic: 'emit'
                }
            }

        });

        // register click and popup events
        $scope.eventDetected = "No events yet...";

        $scope.$on('leafletDirectiveMap.click', function(event){
           $scope.eventDetected = "Click";
        });

        $scope.$on('leafletDirectiveMap.popupopen', function(event){
           $scope.eventDetected = "PopupOpen";
        });

    })
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();

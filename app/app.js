'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.view1',
  'myApp.view2',
  'myApp.calendar',
  'myApp.version'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider

  .when('/calendar', {
      templateUrl: 'calendar/calendar.html',
      controller: 'CalendarController'
  })

  .otherwise({redirectTo: '/calendar'});
}]);

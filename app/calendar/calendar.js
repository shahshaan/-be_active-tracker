angular.module('myApp.calendar', [])

.controller('CalendarController', function($scope, Messages) {

  $scope.greeting = "hello";

  $scope.addAMessage = function() {
    console.log('in addAMessage in CalendarController');
    Messages.addAMessage();
  };

  $scope.storeAllMessages = function() {
    Messages.storeAllMessages();
  };


  

});
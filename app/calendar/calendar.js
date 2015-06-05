angular.module('myApp.calendar', [])

.controller('CalendarController', function($scope, Messages, $firebaseArray) {




  $scope.addNewestMessagesToFirebase = function() {
    Messages.addNewestMessagesToFirebase();
  };

  $scope.filterMessages = function(time) {
    var startOfDay = $scope.startOfDay(time);
    var endOfDay = $scope.endOfDay(startOfDay);
    var ref = new Firebase("https://brilliant-inferno-1190.firebaseio.com/messages-test2/messages");
    $scope.messages = $firebaseArray(ref.orderByChild("created_at").startAt(startOfDay).endAt(endOfDay));
  }



  $scope.day = moment();

  $scope.startOfDay = function(time) {
    startOfDay = time.unix();
    return startOfDay;
  }

  $scope.endOfDay = function(startOfDay) {
    endOfDay = startOfDay + 86400;
    return endOfDay;
  }

  $scope.toMomentFormat = function(unixEpoch) {
    return moment.unix(unixEpoch).format('dddd, MMMM Do YYYY, h:mm:ss a')
  }


});
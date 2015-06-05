angular.module('myApp.calendar', [])

.controller('CalendarController', function($scope, Messages, $firebaseArray) {


  $scope.addNewestMessagesToFirebase = function() {
    Messages.addNewestMessagesToFirebase();
  };

  $scope.filterMessages = function(time) {
    var startOfDay = $scope.startOfDay(time);
    var endOfDay = $scope.endOfDay(startOfDay);
    var ref = new Firebase(FIREBASE_DB);
    $scope.messages = $firebaseArray(ref.child('messages').orderByChild("created_at").startAt(startOfDay).endAt(endOfDay));
  };

  $scope.filterWorkouts = function(time) {
    var startOfDay = $scope.startOfDay(time);
    console.log(startOfDay);
    var ref = new Firebase(FIREBASE_DB);
    $scope.workouts = $firebaseArray(ref.child('workouts').child(startOfDay));
  };


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
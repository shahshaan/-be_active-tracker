angular.module('myApp.admin', [])

.controller('AdminController', function($scope, Messages, Groupme, Workouts) {

  // show date of  and it: "newest_message_id"
  // show users table
  // clear out /messages
  
  // clear out /workouts
  // run through all messages and create workouts

  $scope.setUsersAndFindFirstMessageId = function() {
    Groupme.setUsers();
    Groupme.findFirstMessageId();
  };

  $scope.addNewestGroupMeMessagesToFirebase = function() {
    Groupme.addNewestGroupMeMessagesToFirebase();
  };

  $scope.clearWorkouts = function() {
    Workouts.clearWorkouts();
  }


});


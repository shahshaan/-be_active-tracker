angular.module('myApp.admin', [])

.controller('AdminController', function($scope, Messages, Groupme) {

  // clear out /messages
  // clear out /workouts

  // run addNewestMessagesToFirebase
    // store all the messages to /messages
    // store all messages with #l to /workouts with
      // 

  // show date of  and it: "newest_message_id"
  // show users table

  $scope.setUsersAndFindFirstMessageId = function() {
    Groupme.setUsers();
    Groupme.findFirstMessageId();
  }

  $scope.addNewestGroupMeMessagesToFirebase = function() {
    Groupme.addNewestGroupMeMessagesToFirebase();
  }


});


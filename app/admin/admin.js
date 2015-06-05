angular.module('myApp.admin', [])

.controller('AdminController', function($scope, Messages, Groupme) {


  // given a groupme group id
    // get the first message in that group
      // set it to 'newest_message_id'
    // get each unique sender id in that group and tie that to a name

  // clear out /messages
  // clear out /workouts

  // run addNewestMessagesToFirebase
    // store all the messages to /messages
    // store all messages with #l to /workouts with
      // 

  // show date of  and it: "newest_message_id"
  // show users table

  $scope.setUsersAndFindFirstMessageId = function() {
    Groupme.setUsers($scope.groupMeId);
  }


});

// {"avatar_url":"https://i.groupme.com/1280x1280.jpeg.862de3b09869013176e422000b340376",
// "created_at":1433458174,
// "group_id":"4496439",
// "id":"143345817422655359",
// "name":"Shaan Shah",
// "sender_id":"2127718",
// "sender_type":"user",
// "source_guid":
// "03841EDF-7990-4369-A9AF-FB2F9456274A",
// "system":false,
// "text":"Insanity with sunny yesterday",
// "user_id":"2127718",
// "$id":"-Jr-q06TCnpVCUAJmIok",
// "$priority":null}
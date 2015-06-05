angular.module('myApp.services', [])

.factory('Groupme', function($http) {

  var firebase = new Firebase(FIREBASE_DB);
  var groupMeApi = 'https://api.groupme.com/v3/groups/' + GROUP_ME_GROUP_ID;
  var groupMeMessagesApi = groupMeApi + '/messages';

  var setUsers = function() {

    // get users from GroupMe group
    $http({
      method: 'GET',
      url: groupMeApi,
      params: {
        token: GROUP_ME_TOKEN
      }
    }).then(function(response) {
      var users = response.data.response.members;
      addUsersToFirebase(users);
    });

    var addUsersToFirebase = function(users) {
      var firebaseUsers = firebase.child("users");
      var usersObj = {};
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        usersObj[user['user_id']] = user
      };
      console.log(usersObj);
      firebaseUsers.set(usersObj);
    };
  }

  var findFirstMessageId = function() {
    var firstMessageId = '';
    var groupMeApiMessages = groupMeApi + '/messages'
    var recursiveMessageCaller = function(lastMessageId) {
      $http({
        method: 'GET',
        url: groupMeApiMessages,
        params: {
          limit: 100,
          before_id: lastMessageId,
          token: GROUP_ME_TOKEN
        }
      })
      .then(function (resp) {
        var messages = resp.data.response.messages;
        var lastMessageId = messages[messages.length - 1].id;
        if (messages.length === 100) {
          recursiveMessageCaller(lastMessageId)
        } else {
          firstMessageId = lastMessageId;
          var firebaseNewestMessageId = firebase.child('newest_message_id');
          firebaseNewestMessageId.set(firstMessageId);
          console.log('firstMessageId', firstMessageId);
        }              
      });
    };

    $http({
      method: 'GET',
      url: groupMeApiMessages,
      params: {
        limit: 100,
        token: GROUP_ME_TOKEN
      }
    })
    .then(function (resp) {
      var messages = resp.data.response.messages;
      var lastMessageId = messages[messages.length - 1].id
      recursiveMessageCaller(lastMessageId);
    });
  }

  var utcToDate = function(utcSeconds) {
    var tempDate = new Date(0);
    var currentUtcSeconds = tempDate.setUTCSeconds(utcSeconds);
    return new Date(currentUtcSeconds);
  };

  var addNewestGroupMeMessagesToFirebase = function() {

    var newestMessageIdOnFirebase = function(callback) {
      console.log('looking for newest message id');
      firebase.child('newest_message_id').once("value", 
        function(snapshot) {
          var newest_message_id = snapshot.val();
          console.log('newest_message_id: ', newest_message_id)
          getMessagesFromGroupMe(newest_message_id);
        }, 
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
    };

    var getMessagesFromGroupMe = function(afterId) {
      $http({
        method: 'GET',
        url: groupMeMessagesApi,
        params: {
          after_id: afterId,
          limit: 100,
          token: GROUP_ME_TOKEN
        }
      })
      .then(function (resp) {
        var messages = resp.data.response.messages;
        addMessagesToFirebase(messages);
        }
      );
    };

    var isWorkout = function(message) {
      var loggingTypes = ['#log', '$$', '#L'];
      var hasLogger = false;
      for (var i = 0; i < loggingTypes.length; i++) {
        var logType = loggingTypes[i];
        if (message.text.indexOf(logType) > -1) {
          hasLogger = true;
          break;
        };
      };
      return hasLogger;
    };

    var addWorkout = function(message) {
      var timeStamp = parseInt(message.created_at);
      var startOfDay = timeStamp - (timeStamp % 86400);
      var firebaseWorkoutDay = firebase.child("workouts").child(startOfDay);
      firebaseWorkoutDay.push(message);
    }

    var addMessagesToFirebase = function(messages) {
      if (messages.length > 0) {
        var firebaseMessages = firebase.child("messages");
        var messagesLength = messages.length;
        for (var i = 0; i < messagesLength; i++) {
          var message = messages[i];
          firebaseMessages.push(message);
          if (message.text && isWorkout(message)) {
            addWorkout(message);
          };
          if (i === (messagesLength - 1)) {
            var firebaseNewestMessageId = firebase.child("newest_message_id");
            firebaseNewestMessageId.set(messages[messages.length - 1].id, function() { // set latest message id
              addNewestGroupMeMessagesToFirebase();
            });
          };
        };
      } 
    }
    newestMessageIdOnFirebase();
  };

  return {
    setUsers: setUsers,
    findFirstMessageId: findFirstMessageId,
    addNewestGroupMeMessagesToFirebase: addNewestGroupMeMessagesToFirebase
  };
})

.factory('Messages', function($http){

  var firebase = new Firebase("https://brilliant-inferno-1190.firebaseio.com/messages-test2");
    var data = {};

    var utcToDate = function(utcSeconds) {
      var tempDate = new Date(0);
      var currentUtcSeconds = tempDate.setUTCSeconds(utcSeconds);
      return new Date(currentUtcSeconds);
    };

    var addNewestMessagesToFirebase = function() {
      // grab the latest message id that is on firebase
      // grab latest messages after the last message id
      //   if messages empty
      //     return
      //   if messages not empty
      //     set latest message id
      //     store all the messages into firebase
      //     call the addNewestMessages

      var newestMessageIdOnFirebase = function(callback) {
        console.log('looking for newest message id');
        firebase.child('newest_message_id').once("value", 
          function(snapshot) {
            var newest_message_id = snapshot.val();
            console.log('newest_message_id: ', newest_message_id)
            callback(newest_message_id);
          }, 
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          }
        );
      };

      var getMessagesFromGroupMe = function(afterId) {
        $http({
          method: 'GET',
          url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
          params: {
            after_id: afterId, // after_id with newest message will return an empty array
            limit: 100
          }
        })
        .then(function (resp) {
          var messages = resp.data.response.messages;

            if (messages[0]) { console.log('date of first message: ', utcToDate(parseInt(messages[0].created_at))) };
            if (messages[messages.length - 1]) { console.log('date of last message: ', utcToDate(parseInt(messages[messages.length - 1].created_at))) };
            addMessagesToFirebase(messages);
          }
        );
      };

      var addMessagesToFirebase = function(messages) {
        console.log('about to add messages to firebase');
        console.log('the messages length? ', messages.length);

        if (messages.length > 0) {
          // store all the messages into firebase
          // call the addNewestMessages
          var firebaseMessages = firebase.child("messages");
          for (var i = 0; i < messages.length; i++) {
            
            console.log('MSG-PUSHED: ', utcToDate(parseInt(messages[i].created_at)), "-", messages[i].text);
            console.log("Data looks like:", messages[i]);
            var newMessageRef = firebaseMessages.push(messages[i]);
            var postID = newMessageRef.key();
            console.log('message posted with id: ', postID);
            if (i === (messages.length - 1)) {
              // set latest message id
              console.log('is this running a lot?');
              var firebaseNewestMessageId = firebase.child("newest_message_id");
              firebaseNewestMessageId.set(messages[messages.length - 1].id, function() {
                addNewestMessagesToFirebase();
              });
            };
          };
          
        } 
      }

      newestMessageIdOnFirebase(getMessagesFromGroupMe);
    };

    console.log('going to call addNewestMessagesToFirebase');
    

    return {
      addNewestMessagesToFirebase: addNewestMessagesToFirebase
    }
});

// /groups/:group_id/members/results/:results_id

// https://api.groupme.com/v3/groups/4496439?token=ec8ada30e3d90132ed085a146521cb31

// /groups/:id

// var storeAllMessages = function() {
//   return $http({
//     method: 'GET',
//     url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
//     params: {
//       after_id: '143258757472618245', // after_id with newest message will return an empty array
//       limit: 100
//     }
//   })
//   .then(function (resp) {
//     var messages = resp.data.response.messages;
//     console.log(messages);
//   });
// };

// var storeMessages = function(messages) {
//   console.log('storing messages');
//   firebase.set({
//     oldest_message_id: messages[messages.length - 1].id
//   });
// };

// var addAMessage = function() {
//   console.log('in addAMessage in messages factory', firebase);
//   return firebase.push({
//     author: "gracehop",
//     title: "Announcing COBOL, a New Programming Language"
//   });
// };

// var getFirstMessageId = function() {

//   var firstMessageId = "";
//   // call groupme api with limit 100 and get last message id
//   // call groupme api with limit 100 with before id as last message id
//     // if returns messages array with length <= 100
//       // set firebase first message id
//     // else
//       // recurse, call groupme api with last message id
//   var recursiveMessageCaller = function(lastMessageId) {
//     $http({
//       method: 'GET',
//       url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
//       params: {
//         limit: 100,
//         before_id: lastMessageId
//       }
//     })
//     .then(function (resp) {
//       var messages = resp.data.response.messages;
//       var lastMessageId = messages[messages.length - 1].id;
//       if (messages.length === 100) {
//         console.log('calling groupme api with id: ', lastMessageId);
//         recursiveMessageCaller(lastMessageId)
//       } else {
//         firstMessageId = lastMessageId;
//         console.log('firstMessageId', firstMessageId);
//       }              
//     });
//   };

//   $http({
//     method: 'GET',
//     url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
//     params: {
//       limit: 100
//     }
//   })
//   .then(function (resp) {
//     var messages = resp.data.response.messages;
//     var lastMessageId = messages[messages.length - 1].id
//     recursiveMessageCaller(lastMessageId);
//   });

//   return firstMessageId;
// };


// var allMessages = function() {
//   firebase.child('messages').on("value", 
//     function(snapshot) {
//       var allMessages = snapshot.val();
//       console.log(allMessages);
//     }, 
//     function (errorObject) {
//       console.log("The read failed: " + errorObject.code);
//     }
//   );

//   return [1,2,3];

// }



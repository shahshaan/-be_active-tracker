angular.module('myApp.services', [])


.factory('Messages', function($http){

  var firebase = new Firebase("https://brilliant-inferno-1190.firebaseio.com/messages-test");
        var data = {};

        utcToDate = function(utcSeconds) {
          var tempDate = new Date(0);
          var currentUtcSeconds = tempDate.setUTCSeconds(utcSeconds);
          return new Date(currentUtcSeconds);
        }

        var storeAllMessages = function() {
          return $http({
            method: 'GET',
            url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
            params: {
              before_id: '138785157591783791',
              limit: 100
            }
          })
          .then(function (resp) {
            var messages = resp.data.response.messages;
            console.log(messages);
          });
        };

        var storeMessages = function(messages) {
          console.log('storing messages');
          firebase.set({
            oldest_message_id: messages[messages.length - 1].id
          });
        };

        var addAMessage = function() {
          console.log('in addAMessage in messages factory', firebase);
          return firebase.push({
            author: "gracehop",
            title: "Announcing COBOL, a New Programming Language"
          });
        };

        var getFirstMessageId = function() {

          var firstMessageId = "";
          // call groupme api with limit 100 and get last message id
          // call groupme api with limit 100 with before id as last message id
            // if returns messages array with length <= 100
              // set firebase first message id
            // else
              // recurse, call groupme api with last message id
          var recursiveMessageCaller = function(lastMessageId) {
            $http({
              method: 'GET',
              url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
              params: {
                limit: 100,
                before_id: lastMessageId
              }
            })
            .then(function (resp) {
              var messages = resp.data.response.messages;
              var lastMessageId = messages[messages.length - 1].id;
              if (messages.length === 100) {
                console.log('calling groupme api with id: ', lastMessageId);
                recursiveMessageCaller(lastMessageId)
              } else {
                firstMessageId = lastMessageId;
                console.log('firstMessageId', firstMessageId);
              }              
            });
          };

          $http({
            method: 'GET',
            url: 'https://api.groupme.com/v3/groups/4496439/messages?token=ec8ada30e3d90132ed085a146521cb31',
            params: {
              limit: 100
            }
          })
          .then(function (resp) {
            var messages = resp.data.response.messages;
            var lastMessageId = messages[messages.length - 1].id
            recursiveMessageCaller(lastMessageId);
          });

          return firstMessageId;
        };

        getFirstMessageId();

        // var addNewestMessagesToFirebase = function() {
        //   // 
        // };

        return {
            addAMessage: addAMessage,
            storeAllMessages: storeAllMessages,
            getFirstMessageId: getFirstMessageId
        }
});
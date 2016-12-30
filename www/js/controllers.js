angular.module('controllers', [])

  .controller('SessionCtrl', function ($scope, sessionsSrvc) {

    var sessionLength = 0;
    var firstSession;
    var sessions;
    $scope.sessions = {};

    function getAllSessions() {
      sessionsSrvc.getSessions()
        .then(function (result) {
          sessions = result;
          sessionLength = sessions.length;
        })
        .then(function () {
          for (var i = 0; i < sessionLength; i++) {
            firstSession = sessions[i].sessiontype;

            if (!$scope.sessions[firstSession]) {
              $scope.sessions[firstSession] = [];
            }
            $scope.sessions[firstSession].push(sessions[i]);
          }
        });
    }

    getAllSessions()
  })

  .controller('SessionDetailCtrl', function ($scope, sessionsSrvc, $stateParams, ionicToast) {
    $scope.session = sessionsSrvc.getSession($stateParams.id);

    $scope.addToSchedule = function (id) {
      var status = sessionsSrvc.addToSchedule(id);
      if (status.sessionId) {
        ionicToast.show('Added to your schedule!', 'bottom', false, 2500);
      }
      if (status.sessionType) {
        ionicToast.show('You already have something for this session', 'bottom', false, 2500);
      }
      if (!status.sessionId && !status.sessionType) {
        ionicToast.show('Already in your schedule', 'bottom', false, 2500);
      }
    }
  })
  .controller('scheduleCtrl', function ($scope, sessionsSrvc) {

    function getSchedule() {
      var scheduledSessions = sessionsSrvc.getSchedule();
      if (scheduledSessions) {
        $scope.scheduledSessions = scheduledSessions;
        $scope.noSchedule = false;
      }
      else {
        $scope.noSchedule = true;
      }
    }

    $scope.removeFromSchedule = function (id) {
      console.log("Removing Session");
      sessionsSrvc.removeFromSchedule(id);
      getSchedule();
    };

    $scope.$on('$ionicView.enter', function (e) {
      getSchedule()
    });
  })
  .controller('ratingCtrl', function ($scope, sessionsSrvc, $stateParams) {
    $scope.session = sessionsSrvc.getSession($stateParams.id);
    $scope.submitReview = function (session) {

      if (session.likeFeedback || session.dislikeFeedback || session.generalFeedback) {
        var review = {
          sessionId: session.id,
          sessionTitle: session.title,
          sessionSpeaker: session.speaker,
          userName: session.userName || "",
          userEmail: session.userEmail || "",
          likeFeedback: session.likeFeedback || "",
          dislikeFeedback: session.dislikeFeedback || "",
          generalFeedback: session.generalFeedback || ""
        };

        sessionsSrvc.submitReview(review)
      }
    };
  })

  .controller('otherCtrl', function ($scope) {
    $scope.test = 'cat';
  });




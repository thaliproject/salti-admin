var myApp = angular.module('myApp', []);

myApp.controller('ValidateController', ['$scope', '$http', function ($scope, $http) {
  $scope.greeting = 'Welcome to SALTI!';
  $scope.errors = 'no errors';
  $scope.messages = 'no messages';
  $scope.secret = 'foobar';

  $scope.newdoc = genDoc();

  $scope.getSecret = getSecret($scope, $http);

  $scope.createDoc = function () {
    
    var body = { 'secret': 'CLEAR ' + $scope.secret, 'doc' : $scope.newdoc};
    
    $http({
      method: 'POST',
      url: '/validate',
      // data: { secret: $scope.secret, doc: $scope.newdoc }
      data: body
    }).then(function successCallback(response) {
      $scope.newdoc = genDoc();
      if (response.data.secret)
        $scope.secret = response.data.secret;
      else
        $scope.messages = JSON.stringify(response);
    }, function errorCallback(response) {
      $scope.errors = JSON.stringify(response);
    });
  }

}]);


function getSecret ($scope, $http) {
    $http({
      method: 'GET',
      url: 'https://localhost:3001/admin/getsecret'
    }).then(function successCallback(response) {
      if (response.data.secret)
        $scope.secret = response.data.secret;
      else
        $scope.secret = JSON.stringify(response);
    }, function errorCallback(response) {
      $scope.errors = JSON.stringify(response);
    });
  }
  


function genDoc(){
  return JSON.stringify({ _id: guid(), "type": "foobar" })
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
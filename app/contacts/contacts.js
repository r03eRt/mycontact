'use strict';

angular.module('myContacts.contacts', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

.controller('ContactsCtrl', ['$scope','$firebaseArray',function($scope,$firebaseArray) {

    //inicializamos la conexion
     var ref = new Firebase('https://mycontacts-2636b.firebaseio.com/contacts');

    $scope.contacts = $firebaseArray(ref);
    console.log($scope.contacts);
}]);
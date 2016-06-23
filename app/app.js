'use strict';

// Declare app level module which depends on views, and components
angular.module('myContacts', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/contacts'});
}]);

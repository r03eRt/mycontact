'use strict';

angular.module('myContacts.contacts', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

.controller('ContactsCtrl', ['$scope','$firebaseArray',function($scope,$firebaseArray) {

    //inicializamos la conexion con la coleccion que queremos
     var ref = new Firebase('https://mycontacts-2636b.firebaseio.com/contacts');

    $scope.msg = '';

    //Cojo los contactos
    $scope.contacts = $firebaseArray(ref);
    //console.log($scope.contacts);

    //controlo si muestro o no el formulario
    $scope.showAddForm = function () {
        $scope.addFormShow = !$scope.addFormShow;
        $scope.msg = '';
        $scope.contactShow = false;
    }

    $scope.addFormSubmit = function() {
        if ($scope.name) {
            var name = $scope.name
        } else {
            var name = null;
        }
        if ($scope.email) {
            var email = $scope.email;
        } else {
            var email = null;
        }
        if ($scope.company) {
            var company = $scope.company;
        } else {
            var company = null;
        }
        if ($scope.mobile_phone) {
            var mobile_phone = $scope.mobile_phone;
        } else {
            var mobile_phone = null;
        }
        if ($scope.home_phone) {
            var home_phone = $scope.home_phone;
        } else {
            var home_phone = null;
        }
        if ($scope.work_phone) {
            var work_phone = $scope.work_phone;
        } else {
            var work_phone = null;
        }
        if ($scope.street_address) {
            var street_address = $scope.street_address;
        } else {
            var street_address = null;
        }
        if ($scope.city) {
            var city = $scope.city;
        } else {
            var city = null;
        }
        if ($scope.state) {
            var state = $scope.state;
        } else {
            var state = null;
        }
        if ($scope.zipcode) {
            var zipcode = $scope.zipcode;
        } else {
            var zipcode = null;
        }

        //construimos el objeto
        $scope.contacts.$add({
            name: name,
            email: email,
            company: company,
            phones: [
                {
                    mobile: mobile_phone,
                    home: home_phone,
                    work: work_phone
                }
            ],
            address: [
                {
                    street_address: street_address,
                    city: city,
                    state: state,
                    zipcode: zipcode
                }
            ]
            //promesa de ok
        }).then(function (ref) {
            //foreign key
            var id = ref.key();
            console.log('added contact with id: '+id);

            //limpiamos formulario


            clearFields();

            //ocultamos formulario
            $scope.addFormShow = false;

            $scope.msg = "Contacto añadido";
        });

    }


    $scope.showContact = function (contact) {
        $scope.addFormShow = false;
        console.log('getting contact');
        $scope.name = contact.name;
        $scope.email = contact.email;
        $scope.company = contact.company;
        $scope.mobile_phone = contact.phones[0].work;
        $scope.work_phone = contact.phones[0].home;
        $scope.home_phone = contact.phones[0].mobile;
        $scope.street_address = contact.address[0].street_address;
        $scope.city = contact.address[0].city;
        $scope.state = contact.address[0].state;
        $scope.zipcode = contact.address[0].zipcode;

        $scope.contactShow = true;
    }
    
    
    function clearFields(){
        $scope.name = '';
        $scope.email = '';
        $scope.company = '';
        $scope.mobile_phone = '';
        $scope.work_phone = '';
        $scope.home_phone = '';
        $scope.street_address = '';
        $scope.city = '';
        $scope.state = '';
        $scope.zipcode = '';
        $scope.myForm.$setPristine();

    }
}]);
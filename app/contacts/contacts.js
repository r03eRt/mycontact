'use strict';

angular.module('myContacts.contacts', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl',
  });
}])

.controller('ContactsCtrl', ['$scope','$firebaseArray', '$firebaseObject', '$firebaseAuth',function($scope,$firebaseArray, $firebaseObject, $firebaseAuth) {

    //inicializamos la conexion con la coleccion que queremos
    var ref = firebase.database().ref().child("contacts");
    // download the data into a local object
    var syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");

     var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
       if (error !== null) {
         console.log("Error authenticating:", error);
       } else if (user !== null) {
         console.log("User is logged in:", user);
       } else {
         console.log("User is logged out");
       }
     });


     $scope.register = function(){
       $firebaseAuth().$createUserWithEmailAndPassword($scope.email2, $scope.password2)
               .then(function(firebaseUser) {
                 $scope.message = "User created with uid: " + firebaseUser.uid;
               }).catch(function(error) {
                 $scope.error = error;
               });
           };

       $scope.deleteUser = function() {
          $scope.message = null;
          $scope.error = null;

          // Delete the currently signed-in user
           $firebaseAuth().$deleteUser().then(function() {
            $scope.message = "User deleted";
          }).catch(function(error) {
            $scope.error = error;
          });
        };




        var provider = new firebase.auth.GoogleAuthProvider();

        $scope.logIn = function() {
          firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
        };



    $scope.auth = $firebaseAuth();

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });


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


    //controlo si muestro o no el formulario
    $scope.showEditForm = function (contact) {
        $scope.editFormShow = true;
        $scope.msg = '';

        /*record.id = $scope.$id;
        record.name = $scope.name;
        record.email = $scope.email;
        record.company = $scope.company;
        record.phones[0].work = $scope.work_phone;
        record.phones[0].home = $scope.home_phone;
        record.phones[0].mobile = $scope.mobile_phone;
        record.address[0].street_address = $scope.street_address;
        record.address[0].city = $scope.city;
        record.address[0].state = $scope.state;
        record.address[0].zipcode = $scope.zipcode;*/

        //bindeo los formularios con los datos
        $scope.id = contact.$id;
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
            console.log(ref);
            var id = ref.key();
            console.log('added contact with id: '+id);

            //limpiamos formulario


            clearFields();

            //ocultamos formulario
            $scope.addFormShow = false;

            $scope.msg = "Contacto añadido";
        });

    }


    $scope.editFormSubmit = function () {

        //cogemos el id del contacto
        var id = $scope.id;

        //cogemos el contact
        var record = $scope.contacts.$getRecord(id);


        record.name = $scope.name;
        record.email = $scope.email;
        record.company = $scope.company;
        record.phones[0].work = $scope.work_phone;
        record.phones[0].home = $scope.home_phone;
        record.phones[0].mobile = $scope.mobile_phone;
        record.address[0].street_address = $scope.street_address;
        record.address[0].city = $scope.city;
        record.address[0].state = $scope.state;
        record.address[0].zipcode = $scope.zipcode;

        //guardamos el cotnacto
        $scope.contacts.$save(record).then(function (ref) {
            console.log('asd');
        });
            //limpiamos el formu
            clearFields();

            //no mostramos el formulario
            $scope.editFormShow = false;

            $scope.msg = "Contact Updated"

    }



    $scope.removeContact = function (contact) {

        //cogemos el id del contacto
        var id = $scope.id;

        //borramos el contacto
        $scope.contacts.$remove(contact);

        $scope.msg = "Contact removed";
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

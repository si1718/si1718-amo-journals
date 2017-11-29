/* global angular */

angular.module("JournalManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        function iniciate() {
            $scope.newJournal = {};
        }

        $scope.createJournal = function(){
            $http
                .post("/api/v1/journals/", $scope.newJournal)
                .then(function(response){
                    console.log("Journal with ID: " +$scope.idJournal +"created OK");
                    $location.path("/");
                },  function(error) {
                     if (error.status != '200') {
                        switch (error.status) {
                            case '422':
                               alert("Please fill in all the text input fields");
                                break;
                            case '409':
                                alert("Journal already exists");
                            default:
                                alert("Internal error, please contact with the administrator");
                        }
                    }
                });
        }
        iniciate();
    }]);

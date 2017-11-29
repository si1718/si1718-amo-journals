/* global angular */

angular.module("JournalManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
        function iniciate() {


            $scope.idJournal = $routeParams.idJournal;
            console.log("EditCtrl inicialized for journal with ID: " + $scope.idJournal);

            $http
                .get("/api/v1/journals/" + $scope.idJournal)
                .then(function(response) {
                    $scope.newJournal = response.data;
                });

        }
        $scope.updateJournal = function() {
            delete $scope.newJournal._id;
            $http
                .put("/api/v1/journals/" + $scope.idJournal, $scope.newJournal)
                .then(function(response) {
                    console.log("Journal with ID: " +$scope.idJournal +"updated OK");
                    $location.path("/");
                }, function(error) {
                    if (error.status != '200') {
                        switch (error.status) {
                            case '422':
                               alert("Please fill in all the text input fields");
                                break;
                            default:
                                alert("Internal error, please contact with the administrator");
                        }
                    }
                });
        }
        iniciate();
    }]);

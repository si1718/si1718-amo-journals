/* global angular */

var API_URL = "/api/v1/journals/";

angular.module("JournalManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
        //a la función le damos tantos parámetros como dependencias hayamos definido 
        function refresh() {
            $http
                .get(API_URL)
                .then(function(response) {
                    $scope.journals = response.data;
                });
        }

        $scope.addJournal = function() {
            $http
                .post(API_URL, $scope.newJournal)
                .then(function(response) {
                    refresh();
                }, function(error) {
                    alert(error.data);

                });
        };
        refresh();

        $scope.deleteJournal = function(idJournal) {
            $http
                .delete(API_URL + idJournal)
                .then(function(response) {
                    if (String(response.status == '404')) {
                        alert("You have deleted this journal");
                        refresh();
                    }
                });
        };
        refresh();

    }]);

/* global angular */
angular.module("JournalManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
        //a la función le damos tantos parámetros como dependencias hayamos definido 
        function refresh() {
            $http
                .get("/api/v1/journals")
                .then(function(response) {
                    $scope.journals = response.data;
                });
        }

        $scope.addJournal = function() {
            $http
                .post("/api/v1/journals/", $scope.newJournal)
                .then(function(response) {
                    refresh();
                }, function(error) {
                    alert(error.data);

                });
        }

        $scope.deleteJournal = function(idJournal) {
            $http
                .delete("/api/v1/journals/" + idJournal)
                .then(function(response) {
                    if(String(response.status == '404')){
                        alert("You have deleted this journal");
                    refresh();
                    }
                });
        }
        refresh();

    }]);

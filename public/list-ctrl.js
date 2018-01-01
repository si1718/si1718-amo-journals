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
                    console.log(error.status);

                    if (String(error.status) != '200') {
                        switch (String(error.status)) {
                            case '422':
                                alert("Please make sure that there are no empty fields");
                                break;
                            case '409':
                                alert("There is another journal with same ISSN");
                                break;
                            default:
                                alert("Error, please contact the administrator");
                        }

                    }

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
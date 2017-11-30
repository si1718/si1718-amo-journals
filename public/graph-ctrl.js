angular.module("JournalManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {

            function refresh() {
                $http
                    .get("/api/v1/journals")
                    .then(function(response) {
                            $scope.data = response.data;
                            for (var i in $scope.data) {
                                var area = $scope.data[i];
                                years.push(area);
                            }
                        }
                    });

        


        refresh();

    }]);

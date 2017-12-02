/* global angular */

var API_URL = "/api/v1/journals";

angular.module("JournalManagerApp")
    .controller("SearchCtrl", ["$scope", "$http", function($scope, $http) {

        function refresh(request) {
            $http
                .get(API_URL + "search" + request)
                .then(function(response) {
                    if (response.data.length == 0) {
                        alert("There are no journals to match your search");
                    }
                    $scope.journals = response.data;
                });
        }

        $scope.searchJournals = function() {
            let request = "?";

            if ($scope.search.title) {
                request += "title=" + ($scope.search.title);
            }
            if ($scope.search.editorial) {
                request += "&editorial=" + $scope.search.editorial;
            }
            if ($scope.search.area) {
                request += "&area=" + $scope.search.area;
            }
            if ($scope.search.issn) {
                request += "&issn=" + $scope.search.issn;
            }
             if ($scope.search.keywords) {
                request += "&keywords=" + $scope.search.keywords;
            }



            refresh(request);
        };
    }]);

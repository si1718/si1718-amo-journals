/* global angular, Highcharts */

angular.module("JournalManagerApp")
    .controller("GraphCtrl3", ["$scope", "$http", function($scope, $http) {

        var myMap = new Map();
        $scope.day = null;

        $scope.select = function(d) {
            $scope.day = d;
            refresh();
        };

        function refresh() {

            $http
                .get("/api/v1/infoTwitsForCharts")
                .then(function(response) {
                    $scope.data = response.data;

                    $scope.days = [];

                    var keywords = [];

                    for (var i = 0; i <= $scope.data.length; i++) {
                        for (var k in $scope.data[i]) {
                            if (k != "_id") {
                                keywords.push(k);
                            }
                        }
                    }

                    for (var keyword in keywords) {
                        var count = 0;
                        for (var elem in $scope.data[keyword][keywords[keyword]]) {
                            if ($scope.data[keyword][keywords[keyword]][elem].indexOf($scope.day) != -1) {
                                count++;
                            }
                        }
                        myMap.set(keywords[keyword], count);
                   
                    }

                    for (var K in keywords) {

                        for (var elem in $scope.data[K][keywords[K]]) {
                            if ($scope.data[K][keywords[K]][elem]) {
                                var date = $scope.data[K][keywords[K]][elem];

                                if ($scope.days.indexOf(date) == -1) {
                                    $scope.days.push(date);
                                }
                            }
                        }
                    }

                    var dataArr = [];
                    var ke;
                    for (var [key, value] of myMap) {
                        ke = {
                            name: key,
                            weight: value
                        }
                        console.log(ke);
                        dataArr.push(ke);
                    }

                    var chart = Highcharts.chart('container', {
                        series: [{
                            type: 'wordcloud',
                            data: dataArr,

                            name: 'Ocurrences'
                        }],
                        title: {
                            text: 'Keyword ocurrences in tweets the day ' + $scope.day
                        }
                    });
                });
        }
        refresh();

    }]);

/* global angular, Highcharts */

angular.module("JournalManagerApp")
    .controller("GraphCtrl2", ["$scope", "$http", function($scope, $http) {

        $scope.month = "Jan";
        $scope.value = "01";
        
        $scope.pickMonth = function(month) {
            $scope.month = month.label;
            $scope.value = month.id;
            refresh();
        };

        function refresh() {
            $scope.monthNameList = [{ "label": "Jan", "id": "01" }, { "label": "Feb", "id": "02" }, { "label": "Mar", "id": "03" }, { "label": "Apr", "id": "04" }, { "label": "May", "id": "05" }, { "label": "Jun", "id": "06" }, { "label": "Jul", "id": "07" }, { "label": "Aug", "id": "08" }, { "label": "Sep", "id": "09" }, { "label": "Oct", "id": "10" }, { "label": "Nov", "id": "11" }, { "label": "Dec", "id": "12" }];
            $http
                .get("/api/v1/infoTwitsForCharts")
                .then(function(response) {
                    $scope.data = response.data;

                    var keywords = [];
                    var timesTweet = [];

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
                            if ($scope.data[keyword][keywords[keyword]][elem].indexOf("/" + $scope.value + "/") != -1) {
                                count++;
                                console.log($scope.data[keyword], count);
                            }
                            else {
                                if ($scope.data[keyword][keywords[keyword]][elem].indexOf("/" + $scope.value + "/") != -1) {
                                    count++;
                                }
                            }
                        }
                        timesTweet.push(count);

                    }
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Number of appeareances of keywords in Twitter for the month of ' + $scope.month + ' 2018'
                        },
                        xAxis: {
                            type: 'category',
                            categories: keywords,
                            labels: {
                                rotation: -45,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Number of tweets'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        series: [{
                            name: $scope.month,
                            data: timesTweet,

                        }]
                    });


                });

        }

        refresh();
    }]);

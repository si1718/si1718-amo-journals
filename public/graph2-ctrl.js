angular.module("JournalManagerApp")
    .controller("GraphCtrl2", ["$scope", "$http", function($scope, $http) {

        function refresh() {

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

                    for (var x in keywords) {
                        var count = 0;
                        for (var elem in $scope.data[x][keywords[x]]) {
                            if ($scope.data[x][keywords[x]][elem] != -1) {
                                count++;
                                console.log($scope.data[x], count);
                            }
                        }
                        timesTweet.push(count);

                    }
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Number of tweets per keyword as for January 2018'
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
                            data: timesTweet,

                        }]
                    });


                });

        }

        refresh();
    }]);

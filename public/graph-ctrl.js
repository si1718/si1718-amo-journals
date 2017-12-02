angular.module("JournalManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh() {

            $http
                .get("/api/v1/journals")
                .then(function(response) {
                    $scope.data = response.data;
                    console.log($scope.data)
                    var editorialsList = [];
                    for (var i in $scope.data) {
                        var editorial = $scope.data[i].editorial;
                        editorialsList.push(editorial);
                    }

                    function countInEditorials(editorialsList, editorials) {
                        var count = 0;
                        for (var i = 0; i < editorialsList.length; i++) {
                            if (editorialsList[i] === editorials) {
                                count++;
                            }
                        }
                        return count;
                    }
                    var editorial1 = countInEditorials(editorialsList, "Elsevier BV");
                    console.log(editorial1);
                    var editorial2 = countInEditorials(editorialsList, "Institute of Electrical and Electronics Engineers");
                    console.log(editorial2);
                    var editorial3 = countInEditorials(editorialsList, "Blackwell Publishing Inc.");
                    console.log(editorial3);
                    var editorial4 = countInEditorials(editorialsList, "Oxford University Press");
                    console.log(editorial4);

                    var others = editorialsList.length - (editorial1 + editorial2 + editorial3 + editorial4);
                    console.log(others);

                    Highcharts.chart('container', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Percentage of Editorials of the Journals'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Editorials',
                            colorByPoint: true,
                            data: [{
                                name: 'Elsevier BV',
                                y: editorial1
                            }, {
                                name: 'Institute of Electrical and Electronics Engineers',
                                y: editorial2
                            }, {
                                name: 'Blackwell Publishing Inc.',
                                y: editorial3
                            }, {
                                name: 'Oxford University Press',
                                y: editorial4
                            }, {
                                name: 'Other',
                                y: others
                            }]
                        }]
                    });


                });
        }


        refresh();

    }]);

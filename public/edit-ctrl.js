/* global angular */

var PUBLICATIONS_URL = "https://si1718-jpg-publications.herokuapp.com/api/v1/articles/";
angular.module("JournalManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {

        var idJournal = $routeParams.idJournal;
        $scope.idJournal = idJournal;

        function refresh() {

            console.log("EditCtrl inicialized for journal with ID: " + idJournal);

            $http
                .get("/api/v1/journals/" + $scope.idJournal)
                .then(function(response) {
                    $scope.newJournal = response.data;

                    $scope.checkValidate = isURL($scope.newJournal.idArticle);

                    if ($scope.keywords && $scope.keywords.length > 0) {
                        $scope.keywords = $scope.keywords.split(",");
                    }

                });


            $scope.updateJournal = function() {

                if (!isURL($scope.newJournal.idArticle)) {
                    $scope.newJournal.articleViewURL = null;
                    $scope.newJournal.articletitle = null;
                }
                if ($scope.keywords && $scope.keywords.length > 0) {
                    $scope.keywords = $scope.keywords.split(",");
                }
                delete $scope.newJournal._id;

                $http
                    .put("/api/v1/journals/" + idJournal, $scope.newJournal)
                    .then(function(response) {
                        refresh();
                        console.log("Journal with ID: " + idJournal + "updated OK");
                        $location.path("/");
                    }, function(error) {
                        if (error.status != '200') {
                            switch (error.status) {
                                case '422':
                                    alert("Please fill in all the text input fields");
                                    break;
                                default:
                                    alert("Internal error, please contact with the administrator");
                                    console.log("Here is the error");
                            }
                        }
                    });
            };

            $scope.validateArticle = function(idArticle) {
                if (!idArticle) {
                    alert("Article not found, may be null");
                    console.log("Article ID null");
                }
                else {
                    $http
                        .get(PUBLICATIONS_URL + idArticle)
                        .then(function(response) {
                            if (isURL($scope.newJournal.idArticle)) {
                                alert("Article already validated");
                                console.log("article already validated");
                            }
                            else {
                                var publicationsAPIData = response.data;
                                if ($.isArray(publicationsAPIData) && publicationsAPIData.length == 0) {
                                    alert("Publication not found");
                                    console.log("publication is null, empty");
                                }
                                else {
                                    var idArticle = publicationsAPIData[0].idArticle;
                                    var articleTitle = publicationsAPIData[0].title;
                                    var endpointPublicationsAPI = "https://si1718-jpg-publications.herokuapp.com/api/v1/articles/" + idArticle;
                                    var articleViewURL = "https://si1718-jpg-publications.herokuapp.com/#!/articles/" + idArticle;

                                    $scope.newJournal.articleTitle = articleTitle;
                                    $scope.newJournal.articleViewURL = articleViewURL;
                                    $scope.newJournal.idArticle = endpointPublicationsAPI;

                                    $http
                                        .put("/api/v1/journals/" + idJournal, $scope.newJournal)
                                        .then(function(response) {
                               
                                            alert("Department has ben validated!");
                                        }, function(error) {
                                            if (error.status != '200') {
                                                switch (error.status) {
                                                    case '422':
                                                        alert("Please fill in all the text input fields");
                                                        break;
                                                    default:
                                                        alert("Internal error, please contact with the administrator");
                                                        console.log("Error is here");
                                                }
                                            }
                                        });

                                }
                            }
                        }, function(error) {
                            alert("Article may be null");
                        });
                }
            };



        }

        refresh();
    }]);

function isURL(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

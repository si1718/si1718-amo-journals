/* global angular */
angular.module("JournalManagerApp", ["ngRoute"])
    .config(function($routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListCtrl"
            }).when("/journal/:idJournal", {
                templateUrl: "edit.html",
                controller: "EditCtrl"
            }).when("/create", {
                templateUrl: "create.html",
                controller: "CreateCtrl"
            }).when("/search?:params", {
                templateUrl: "search.html",
                controller: "SearchCtrl"
            }).when("/graph", {
                templateUrl: "graph.html",
                controller: "GraphCtrl"
            }).when("/graph2", {
                templateUrl: "graph2.html",
                controller: "GraphCtrl2"
            });

        console.log("INFO: App Initialized");

    });

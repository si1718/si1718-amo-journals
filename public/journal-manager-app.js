/* global angular */
angular.module("JournalManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
        $routeProvider
            .when("/",{
                templateUrl: "list.html",
                controller : "ListCtrl"
            }).when("/journal/:idJournal",{
                templateUrl: "edit.html",
                controller : "EditCtrl"
            }).when("/create", {
                templateUrl: "create.html",
                controller : "CreateCtrl"
            });
        
        console.log("INFO: App Initialized");            
        
    });

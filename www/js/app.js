
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var app = angular.module('hciApp', ['ionic', 'firebase', 'ngCordova', 'hciApp.controllers', 'hciApp-services',
    'hciApp-directives', 'hciApp-filters', 'ngAnimate', 'ngTouch', 'angular-gestures']);
   /* var PhoneGapInit = function () {
        this.boot = function () {
            angular.bootstrap(document, ['hciApp']);
        };
        if (window.phonegap !== undefined) {
            document.addEventListener('deviceready', function() {
                this.boot();
            });
        } else {
            console.log('PhoneGap not found, booting Angular manually');
            this.boot();
        }
    };
    angular.element(document).ready(function() {
        new PhoneGapInit();
    });*/
    app.constant('FORECASTIO_KEY', 'e5fb549e22c9c3c729ce5a5ec0c6dff7')
    .constant('FLICKR_API_KEY', '504fd7414f6275eb5b657ddbfba80a2c')
    .constant('AWS_ACCESS_KEY', 'AKIAIIXJM3G6BRX3W4WQ')
    .constant('AWS_SECRETE_KEY', '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')
    .constant('FIREBASE_URL', 'https://hcicontactmessages.firebaseio.com/')
    .constant('KIMONOLABS', 'PBxXzZKLn1a3GJFK34ang11OgF95uY1k')
    .filter('int', [function() {
        return function(v) {
            return parseInt(v) || '';
        };
    }])
    .run(['$rootScope','$ionicPlatform','IntroSettings','$state','$location', '$cordovaSplashscreen', '$cordovaStatusbar',
            function($rootScope,$ionicPlatform,IntroSettings,$state,$location,$cordovaSplashscreen,$cordovaStatusbar) {
        $ionicPlatform.ready(function() {
            steroids.splashscreen.hide();
            /*setTimeout(function() {
                $cordovaSplashscreen.hide();
                alert("I'm ready!")
            }, 100)*/
            if(window.StatusBar) {
                alert("yes")
                StatusBar.styleDefault();
            }
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if(toState.url == '/intro'){
                var intro_page_seen = angular.fromJson(localStorage.settings);
                if (intro_page_seen.showIntroPage){
                    $location.path('/app/home')
                    console.log(intro_page_seen.showIntroPage)
                }
                console.log("To state is ",toState.url)
            }
        });
    }])
    .config(function(AWSServiceProvider){
        AWSServiceProvider.setKeys('AKIAIIXJM3G6BRX3W4WQ', 'G9ffD62jLdSLgMCzJbtjQudOf3Fj3cztP8E0Czac')
    })
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'MenuCtrl'
            })
            .state('app.intro', {
                url: '/intro',
                views: {
                    'menuContent':{
                        templateUrl: 'templates/intro.html',
                        controller: 'IntroCtrl'
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/home.html",
                        controller: "HomeCtrl"
                    }
                }
            })
            .state('app.findUs', {
                url: "/findUs",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/findUs.html",
                        controller: "FindUsCtrl"
                    }
                }
            })
            .state('app.todo', {
                url: "/todo",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/podcastsLists.html",
                        controller: "PodcastsListsCtrl"
                    }
                }
            })
            .state('app.tododetail', {
                url: "/todo/:todoId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/podcast.html",
                        controller: 'PodcastsDetailCtrl'
                    }
                }
            })
            .state('app.photoGal', {
                url: "/photoGal",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/photoGal.html",
                        controller: "PhotoGalCtrl"
                    }
                }
            })
            .state('app.contactMessages', {
                url: "/contactMessages",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/contactMessages.html",
                        controller: "ContactMessagesCtrl"
                    }
                }
            })
            .state('app.contact_Message', {
                url: "/contactMessages/:messageId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/contact_Message.html",
                        controller: "Contact_Message_Ctrl"
                    }
                }
            })
            .state('app.word_for_today', {
                url: "/word_for_today",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/cards.html",
                        controller: 'WordForTodayCtrl'
                    }
                }
            })
            .state('app.word_for_today_full', {
                url: "/word_for_today_full",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/word_for_today.html",
                        controller: 'WordForTodayCtrl'
                    }
                }
            })
            .state('app.send_email', {
                url: "/send_email",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/send_email.html",
                        controller: 'SendEmailCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/intro');
    }]);
/**
 * Created by user on 03/06/2014.
 */
var appCtrl = angular.module('hciApp.controllers', []);

appCtrl.controller('MenuCtrl', ['$scope', function($scope){

}]);
appCtrl.controller('IntroCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', 'IntroSettings','$cordovaSplashscreen','$cordovaStatusbar',
    function($scope, $state, $ionicSlideBoxDelegate,IntroSettings,$cordovaSplashscreen,$cordovaStatusbar) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        //$cordovaSplashscreen.hide();
        $cordovaStatusbar.overlaysWebView(true);
        // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
        $cordovaStatusbar.style(0);
        // supported names: black, darkGray, lightGray, white, gray, red, green,
        // blue, cyan, yellow, magenta, orange, purple, brown
        //$cordovaStatusbar.styleColor('white');
        $cordovaStatusbar.show();
    // Called to navigate to the main app
    $scope.startApp = function() {
        $state.go('app.home');
        IntroSettings.save();
    };
    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
    $scope.$on('$routeChangeStart', function(evt, next, curr){
        $state.go('app.todo');
        console.log("next controller is called ", next)
    });
}]);
appCtrl.controller('HomeCtrl', ['$scope', '$timeout', '$rootScope','Weather','Geo','Flickr','$ionicModal',
    '$ionicPlatform','$ionicSideMenuDelegate','$cordovaStatusbar','$cordovaDevice',
    function($scope, $timeout, $rootScope,Weather, Geo,Flickr,$ionicModal,$ionicPlatform,$ionicSideMenuDelegate,$cordovaStatusbar) {
        //$cordovaStatusbar.show();

        $ionicSideMenuDelegate.canDragContent(false);
        var _this = this;
        $scope.activeBgImageIndex = 0;

        this.getBackgroundImage = function(lat, lng, locString) {
            Flickr.search(locString, lat, lng).then(function(resp) {
                var photos = resp.photos;
                if(photos.photo.length) {
                    $scope.bgImages = photos.photo;
                    _this.cycleBgImages();
                }
            }, function(error) {
                console.error('Unable to get Flickr images', error);
            });
        };

        this.getCurrent = function(lat, lng, locString) {
            Weather.getAtLocation(lat, lng).then(function(resp) {
                /*
                 if(resp.response && resp.response.error) {
                 alert('This Wunderground API Key has exceeded the free limit. Please use your own Wunderground key');
                 return;
                 }
                 */
                $scope.current = resp.data;
                $scope.days = $scope.current.daily.data;
                console.log('GOT CURRENT', $scope.current);
                console.log('GOT DAY', $scope.days);
                $rootScope.$broadcast('scroll.refreshComplete');
            }, function(error) {
                navigator.notification.alert('Unable to get current conditions');
                console.error(error);
            });
        };

        this.cycleBgImages = function() {
            $timeout(function cycle() {
                if($scope.bgImages) {
                    $scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
                }
                $timeout(cycle, 10000);
            });
        };

        $scope.refreshData = function() {
            Geo.getLocation().then(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                Geo.reverseGeocode(lat, lng).then(function(locString) {
                    $scope.currentLocationString = locString;
                    _this.getBackgroundImage(lat, lng, locString);
                });
                _this.getCurrent(lat, lng);
            }, function(error) {
                navigator.notification.alert('Unable to get current location ');
            });
        };
        $scope.refreshData();
    }]);
appCtrl.controller('FindUsCtrl', ['$scope', '$ionicLoading', '$ionicActionSheet', '$timeout', '$ionicModal', '$ionicNavBarDelegate', '$location', '$ionicTabsDelegate',
    function($scope, $ionicLoading, $ionicActionSheet, $timeout, $ionicModal, $ionicNavBarDelegate,$location,$ionicTabsDelegate){
        /*Code for email*/
        $scope.createEmail = function (){
            $location.path('/app/send_email')
        };
        /*end of code for email*/
        $scope.setNavTitle = function(title) {
            $ionicNavBarDelegate.setTitle(title);
        };
        $scope.storeTab = function(tab_number){

            // Needed to switch the view when clicking on a tab
            $ionicTabsDelegate.select(tab_number);

            //Set the Nav bar titile
            if(tab_number == 0){
                $scope.setNavTitle("Activities")
            } else if(tab_number == 2) {
                $scope.showEndChoices();
                $scope.setNavTitle("Directions")
            }

        };
        /*Code for map/directions*/
        $scope.mapCanvas = true; //for the map view
        $scope.controls = false; //for the controls view
        $scope.close = false;
        $scope.stepByStep = false;
        $scope.hideSteps = false;
        $scope.closeMap = function(){ //for closing the map view
            $scope.mapCanvas = true; //for the map view
            $scope.close = false;
            $scope.stepByStep = false;
            $scope.hideSteps = false;
            $scope.controls = false;
        };
        $scope.destinationOptions = { // the various destination options for Fridays saturdays and sundays
            friAndSat:"Ng9 1ae",
            sunday: "NG9 1GL"
        };

        //render step-by-step directions
        $scope.showDirections = function(){
            $scope.mapCanvas = false; //for the map view
            $scope.stepByStep = false;
            $scope.hideSteps = true;
        };
        $scope.hideDirections = function(){
            $scope.mapCanvas = true; //for the map view
            $scope.hideSteps = false;
            $scope.stepByStep = true;
        };

        $scope.showEndChoices = function() { // the modal for choosing destination
            // Show the action sheet
            var actionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Fridays and Saturdays' },
                    { text: 'Sundays' }
                ],
                titleText: 'Choose a destination',
                cancelText: 'Cancel',
                buttonClicked: function(index) {
                    if(index === 0){

                        $scope.close = true;
                        $scope.chooseDestination($scope.destinationOptions.friAndSat);
                    }else if(index === 1){

                        $scope.close = true;
                        $scope.chooseDestination($scope.destinationOptions.sunday);
                    }
                    return true
                }
            });
        };

        function mapDisplayCtrl (){
            $scope.mapCanvas = true; // now show the map
            $scope.close = true;
            $scope.stepByStep = true;
        }
        $scope.chooseDestination = function(end){ // set destinations
            if($scope.destination !== end){
                $scope.end = end
                $scope.getDirection()
            } else {
                mapDisplayCtrl()// now show the map
            }
        };
        var markerArray = [];
        $scope.getDirection = function () {
            mapDisplayCtrl();
            $scope.showLoading();
             /*set the controls to the bottom of the map*/
            var control = document.getElementById("control"),
                map,
                directionsDisplay,
                directionService;
            function initialize() {
                $scope.userLocation = "";
                //instantiate Directions service
                directionService = new google.maps.DirectionsService();

                /*Create a map and center it on Nottingham*/
                var nottingham = new google.maps.LatLng(-34.397, 150.644),
                    mapOptions = {
                        center: nottingham,
                        zoom: 16,
                        panControl: false,
                        zoomControl: false,
                        mapTypeControl: false,
                        streetViewControl: false
                    },
                    geocoder = new google.maps.Geocoder();
                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

                directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map,
                    draggable: true
                });

                directionsDisplay.setMap(map); // set the map and bind any changes
                // Stop the side bar from dragging when mousedown/tapdown on the map
                $scope.domListener1 = google.maps.event.addDomListener(document.getElementById('map-canvas'), 'mousedown', function (e) {
                    e.preventDefault();
                    return false;
                });
                $scope.map = map;
                /*place the controls*/
                control.style.display = "inline-block";
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(control);
                $scope.stepDisplay = new google.maps.InfoWindow();

                // Try HTML5 Geolocation to get user's location.
                // first find the users location
                if (navigator.geolocation){
                    $scope.locationId = navigator.geolocation.watchPosition(function (position) {
                        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        $scope.userLocation= pos;
                        $scope.setDirection("DRIVING");

                        // use reverse geocoding to find the users human readable address
                        geocoder.geocode({latLng: pos},
                            function  (result, status) {
                                if (status === google.maps.GeocoderStatus.OK){
                                    if (result[1]){
                                        map.setZoom(18);
                                        map.setCenter(pos);
                                        $scope.hideLoading()
                                    }
                                } else {
                                    function error () {
                                        if (status === "OVER_QUERY_LIMIT"){
                                            var errorMessage = "Try again in 5 mins"
                                        } else {errorMessage = "Something went wrong"}
                                        navigator.notification.alert(errorMessage, null, "Oops!");
                                        $scope.hideLoading();
                                    }
                                    error()
                                    $scope.closeMap();
                                }
                            }); //End of reverse coding

                    }, function(){
                        handleNoGeolocation(true);
                    });
                } else {handleNoGeolocation(false)}//if browser does not support geolocation
                //end of geocoder

                $scope.listner1 = google.maps.event.addListener(directionsDisplay, 'directions_changed', function(){
                    $scope.deleteMarkers ();
                    $scope.controls = true;
                    showSteps(directionsDisplay.directions);
                    try{
                        if (directionsDisplay.directions.routes[0].legs[0]) {
                            $scope.$apply(function () {
                                $scope.userLocation = directionsDisplay.directions.routes[0].legs[0].start_address;
                            });
                        }
                    } catch (e) { }
                    computeTotalDistance(directionsDisplay.getDirections());
                });
            }

            $scope.setDirection = function (transMod) {
                // First, remove any existing markers from the map.
                $scope.deleteMarkers();// First, clear out any existing markerArray from previous calculations.
                $scope.destination = $scope.end
                var start = $scope.userLocation,
                    selectedMode = transMod || 'DRIVING',
                    request = {
                        origin: start,
                        destination: $scope.destination,
                        travelMode: selectedMode,
                        provideRouteAlternatives: true,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        optimizeWaypoints: true
                    };
                if (selectedMode === 'TRANSIT') {
                    request.transitOptions = {
                        departureTime: new Date()
                    };
                }

                /*resize the map*/
                $scope.ele = document.querySelector("#map-canvas")
                $scope.$watch('ele', function(){
                    window.setTimeout(function(){
                        google.maps.event.trigger(map, 'resize');
                    }, 100)
                })

                // Retrieve the start and end locations and create a DirectionsRequest
                directionService.route(request, function(response, status){
                    if (status == google.maps.DirectionsStatus.OK){
                        directionsDisplay.setDirections(response);
                        //showSteps(response); // !! I found that this calling this function here saves the markers permanently.
                    }
                });

                directionsDisplay.setPanel(document.getElementById("directions-panel")); //set the step by step directions on to a div
            }

            function showSteps (directionResult){
                // For each step, place a marker, and add the text to the marker's
                // info window. Also attach the marker to an array so we
                // can keep track of it and remove it when calculating new
                // routes.
                var myRoute = directionResult.routes[0].legs[0];

                for (var i = 0; i < myRoute.steps.length; i++) {
                    var marker = new google.maps.Marker ({
                        position: myRoute.steps[i].start_location,
                        map: map
                    });
                    attachInstructionText(marker, myRoute.steps[i].instructions);
                    markerArray[i] = marker;
                }
            }

            function attachInstructionText(marker, text){
                $scope.listner2 = google.maps.event.addListener
                (marker, 'click', function(){
                    $scope.stepDisplay.setContent(text);
                    $scope.stepDisplay.open(map, marker);
                });
            }

            function computeTotalDistance (result) {
                var total = 0;
                var mydist = result.routes[0];
                for (var i = 0; i < mydist.legs.length; i++) {
                    total += mydist.legs[0].distance.value;
                };
                total = total/1000;
                $scope.$apply(function (){
                    $scope.totalkm = Math.round(total)+"km";
                });
            }
            $scope.domListener2 = google.maps.event.addDomListener(window, 'load', initialize());

        };
        $scope.stopWatching = function (){
            navigator.geolocation.clearWatch($scope.locationId)
        };
        // Sets the map on all markers in the array.
        function setAllMap (map) {
            for (var i = 0; i < markerArray.length; i++){
                markerArray[i].setMap(map);
            }
        }
        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setAllMap(null);
        }
        $scope.deleteMarkers = function  (){
            clearMarkers();
            markerArray = [];
        };

        // handleNoGeolocation Error
        function handleNoGeolocation(errorFlag) {
            if (errorFlag) {
                var content = 'Error: The Geolocation service failed.';
            } else {
                var content = 'Error: Your browser doesn\'t support geolocation.';
            }

            var options = {
                map: $scope.map,
                position: new google.maps.LatLng(60, 105),
                content: content
            };

            var infowindow = new google.maps.InfoWindow(options);
            $scope.map.setCenter(options.position);
        }

        $scope.showLoading = function () {
            $scope.show = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            })
        };
        $scope.hideLoading = function(){
            $ionicLoading.hide();
        }
        /*end of code for map/directions*/
        $scope.$on('$destroy', function(){
            $scope.stopWatching();
            google.maps.event.removeListener($scope.listner1)
            google.maps.event.removeListener($scope.listner2)
            google.maps.event.removeListener($scope.domListener1)
            google.maps.event.removeListener($scope.domListener2)

        })

        /*Activities model*/
        $scope.activities = [
            {day: 'Friday', title: 'Details Bible study and discusion of the Word of God.', time: '6:30pm - 8:30pm', venue: 'Beston Girls Guide, Nottingham, NG9 1AE'},
            {day: 'Saturday', title: 'Ministry Meetings ', time: '11:00am - 1:00pm', venue: 'Beston Girls Guide, Nottingham, NG9 1AE'},
            {day: 'Sunday', title: 'Worship ', time: '5:00pm - 7:30pm', venue: '25 Forster Avenue, Nottingham, NG9 1GL'}
        ];
    }
]);
appCtrl.controller('SendEmailCtrl', ['$scope', '$timeout', 'FIREBASE_URL', '$firebase', 'ContactMessages', '$location',
    function($scope, $timeout,FIREBASE_URL, $firebase, ContactMessages, $location) {
        var messageId = Math.floor(Math.random() * 5000001);
        $scope.messages = ContactMessages.all;
        var time = Firebase.ServerValue.TIMESTAMP;
        $scope.master = {};
        $scope.user = {
            full_name: "",
            msg: "",
            subjectList: "",
            anonymous: false,
            receiveResponse: false,
            email: "",
            phoneNo: ""
        };
        $scope.anony = [
            { text: "Anonymous" }
        ];
        $scope.replyContact = [
            { text: "l'd like a reply" }
        ];
        $scope.messageAlerts = "";
        $scope.subjectListOptions = {
            'Bug': 'Report a Bug',
            'Feedback': 'Feedback',
            'Prayer Request': 'Prayer Request',
            'Complaint': 'Complaint',
            'Other': 'Other'
        };
        $scope.$watch('user.anonymous', function(newVal){
            if (newVal === true) {
                $scope.user.full_name = "";
            }
        });
        $scope.$watch('user.receiveResponse', function(newVal){
            if (newVal === false) {
                $scope.user.phoneNo = "";
                $scope.user.email = "";
            }
        });
        $scope.addMessage = function(e) {
            //if (e.keyCode != 13) return;
            var _self = this;
            _self.mess = {
                FullName: ($scope.user.anonymous) ? "Anonymous" : $scope.user.full_name,
                Body: $scope.user.msg,
                Type: $scope.user.subjectList,
                Anonymous: $scope.user.anonymous,
                ReplyContact: $scope.user.replyContact,
                Email: (!$scope.user.email) ? "None" : $scope.user.email,
                PhoneNo: (!$scope.user.phoneNo) ? "None" : $scope.user.phoneNo,
                TimeStamp: time,
                ID: messageId,
                completed: {
                    checked: false,
                    text: "Todo"
                }
            }
            console.log(_self.mess);
            ContactMessages.create(_self.mess).then(function(){
                $scope.user = angular.copy($scope.master);
                $scope.closeModal();
            });
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

    }]);
appCtrl.controller('ContactMessagesCtrl', ['$scope', 'ContactMessages', function($scope, ContactMessages){
    $scope.messages = ContactMessages.all;
}])
appCtrl.controller('Contact_Message_Ctrl', ['$http','$scope', '$stateParams', 'ContactMessages',
    function($http, $scope, $stateParams, ContactMessages){
        var key = $stateParams.messageId
        $scope.message = ContactMessages.find(key);
        $scope.update = $scope.message.$on('loaded', function(){
            $scope.$watch('message.completed.checked', function(newVal){
                if(newVal === false) {
                    $scope.message.$child('completed').$update({checked: false, text: "Todo"});
                } else {
                    $scope.message.$child('completed').$update({checked: true, text: "Completed"});
                }
            });
        });
        $scope.complete = {
            checked: false,
            text: "Todo"
        };
    }]);
appCtrl.controller('WordForTodayCtrl', ['$scope', 'HomeCards', '$location', '$timeout',
    function($scope, HomeCards, $location, $timeout) {
        //$scope.cards = { title: 'Swipe down to clear the card', image: 'img/pic.png' }
        $scope.word1 = false;
        function checkWord (){
            if($scope.word) {
                $scope.word1 = true;
            }
            $timeout.cancel(timer)
        }
        var timer
        if (!sessionStorage.word42day){
            HomeCards.getData().then(function(data){
                $scope.word = (sessionStorage.word42today) ? sessionStorage.word42today : data.results
                timer = $timeout(checkWord, 300);
                console.log("data is ", data.results.discussion)
            });
        } else {
            var word42day =
            $scope.word = angular.fromJson(sessionStorage.word42day).results
            timer = $timeout(checkWord);
        }

        $scope.readMore = function () {
            $location.path('app/word_for_today_full')
        }

        $scope.$on('$destroy', function(){
            $timeout.cancel(timer)
        })

    }]);
appCtrl.controller("PhotoGalCtrl", ["$rootScope", "$scope", "$timeout", "$interval", "$stateParams",
    "$ionicGesture", "$ionicNavBarDelegate", "MyService",
    function($rootScope, $scope, $timeout, $interval, $stateParams, $ionicGesture, $ionicNavBarDelegate, MyService){

        $scope.barState = true;
        $scope.fullHide = "expand";
        $scope.loopStop= "loop";
        $scope.loopToggle = "loop";
        $scope.expand = function(){
            if($scope.fullHide === "expand"){
                $scope.fullHide = "shrink"
            }else $scope.fullHide = "expand";
            $scope.barState = !$scope.barState;
            $ionicNavBarDelegate.showBar($scope.barState);
        };
        $scope.loopToggle = function(){
            if($scope.loopStop === "loop"){
                $scope.loopStop = "stop"
                var interval = $interval(function(){
                    $scope.showNext();
                }, 3500)
            }else if ($scope.loopStop === "stop"){
                $scope.loopStop = "loop";
                $scope.stopInterval();
            }
            $scope.stopInterval = function(){
                $interval.cancel(interval)
            }
        };
        var bucket = 'hci-media',
            picturesArray = [];

        MyService.listObjects(bucket, 'pictures/', 'pictures/').then(function(pictures){
            for (var i=0; i<pictures.length; i++){
                var key = pictures[i].Key;
                picturesArray.push('https://s3-eu-west-1.amazonaws.com/'+bucket+'/'+key);
            };
        });
        var timer = $timeout(function(){
            $scope.photos = picturesArray;
            console.log("pictures ",$scope.photos)
        }, 4000);
        //Clean up the timer before we kill this controller
        $scope.$on('$destroy', function() { if (timer) { $timeout.cancel(timer); } });

        // initial image index
        $scope._Index = 0;

        // if a current image is the same as requested image
        $scope.isActive = function (index) {
            return $scope._Index === index;
        };

        // show prev image
        $scope.showPrev = function () {
            $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
        };

        // show next image
        $scope.showNext = function () {
            $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
        };

        // show a certain image
        $scope.showPhoto = function (index) {
            $scope._Index = index;
        };

    }]);
appCtrl.controller('PodcastsListsCtrl', ['$scope', 'PodLists', 'AWSService', 'MyService', '$timeout', '$ionicLoading', '$filter', 'PodService', 'Player',
    function($scope, PodLists, AWSService, MyService, $timeout, $ionicLoading, $filter, PodService, Player){
        /*set the funcion for showing and hiding loading screen*/
        var podcasts;
        $scope.showLoading = function () {
            $scope.show = $ionicLoading.show({
                content: 'Getting Messages...',
                showBackdrop: false
            })
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };
        $scope.player = Player;
        /*List the objects and get their header metadata*/
        var bucket = 'hci-media';
           $scope.showLoading();
        $scope.getMessages = function(){
            PodLists.pods().then(function(obj){
                podcasts = obj;
                $scope.messages = $filter('orderBy')(podcasts, 'object.Metadata.date', true);
                sessionStorage.podsArray = angular.toJson($scope.messages);
                $scope.hide();
                $scope.predicate =  'object.Metadata.title';
                //console.log("messages ",$scope.messages);
            }, function(error){
                navigator.notification.alert('Unable to messages', null, "Error");
                console.log("dondi error is ", error)
            }, function(percentComplete){
                console.log("dondi completes in ", percentComplete)
            }).finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        var timer_mess
        if(!sessionStorage.podsArray){
            timer_mess = $timeout(function(){
                $scope.getMessages();
                $timeout.cancel(timer_mess)
            })
        } else if(sessionStorage.podsArray){
            if(angular.fromJson(sessionStorage.podsArray).length < 1){
                timer_mess = $timeout(function(){
                    $scope.getMessages();
                    $timeout.cancel(timer_mess)
                })
            } else {
                podcasts = angular.fromJson(sessionStorage.podsArray)
                $scope.messages = $filter('orderBy')(podcasts, 'object.Metadata.date', true);
                $scope.hide();
            }

        }
        //Clean up the timer before we kill this controller
        $scope.$on('$destroy', function() { $timeout.cancel()} );
        $scope.playerControl = false;
        $scope.play = function(key, title) {
            var src = 'https://s3-eu-west-1.amazonaws.com/'+bucket+'/'+key;
            console.log("source ", src);
            $scope.player.play(src, title)
        };
        $scope.stop = function() {
            $scope.player.stop();
        };

    }]);
appCtrl.controller('PodcastsDetailCtrl', ['$scope', '$cacheFactory', '$stateParams', '$filter', 'MyService', '$timeout', '$ionicLoading', 'PodService', 'Player',
    function($scope, $cacheFactory, $stateParams, $filter, MyService, $timeout, $ionicLoading, PodService, Player){
        /*set the defaults*/
        //$scope.imageSrc =PodService.getPic()//'http://placehold.it/350x150';
        $scope.imageSrc = null;
        PodService.all('podcast').getList().then(function(podcasts){
            var image = $filter('filter')(podcasts)[0];
            $scope.imageSrc = ($scope.imageSrc != null) ? $scope.$apply(function(){$scope.imageSrc }): image.imageUrl;
        });
        $scope.player = Player;
        $scope.isPlaying = false;
        /*set the loading show and hide functions*/
        $scope.showLoading = function () {
            $scope.show = $ionicLoading.show({
                content: 'loading...',
                showBackdrop: false
            })
        };
        $scope.hide = function(){$ionicLoading.hide();};
        $scope.showLoading();

        var bucket = 'hci-media';
        var eTag = $stateParams.todoId;
        console.log("etag is ", eTag)
        $scope.getMessage = function(){
            /*filter a particular object based on the ETag, then get the Key and call get object metadata. Then model the url for audio*/
            MyService.listObjects(bucket, 'podcasts/', 'podcasts/').then(function(messages){
                var messageObj = $filter('filter')(messages, {ETag: $stateParams.todoId})[0],
                    key = messageObj.Key,
                    params = {
                        Bucket: bucket,
                        Key: key
                    };
                MyService.getObjHead(params).then(function(obj){
                    $scope.podcast = obj;
                    sessionStorage.setItem(eTag, angular.toJson($scope.podcast));
                });
                $scope.messageSrc = 'https://s3-eu-west-1.amazonaws.com/'+bucket+'/'+key;
                $scope.hide();
                //Clean up the timer before we kill this controller
            });
        };
        var timer_mess
        if(!sessionStorage.getItem(eTag)){
            timer_mess = $timeout(function(){
                $scope.getMessage();
                $timeout.cancel(timer_mess)
            })
        } else{
            var podcast = angular.fromJson(sessionStorage.getItem(eTag))
            $scope.podcast = podcast;
            $scope.hide();
        }
        $scope.$on('$destroy', function() { if (timer_mess) { $timeout.cancel(timer_mess); } });
    }]);
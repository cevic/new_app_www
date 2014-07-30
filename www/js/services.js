// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where AngularJS is not loaded from errors
    if ( typeof angular == 'undefined' ) {
        return;
    };

    var forecastioWeather = ['$q', '$resource', '$http', 'FORECASTIO_KEY', function($q, $resource, $http, FORECASTIO_KEY) {
        var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';

        var weatherResource = $resource(url, {
            callback: 'JSON_CALLBACK',
        }, {
            get: {
                method: 'JSONP'
            }
        });

        return {
            getAtLocation: function(lat, lng) {
                return $http.jsonp(url + lat + ',' + lng + '?callback=JSON_CALLBACK');
            },
            getForecast: function(locationString) {
            },
            getHourly: function(locationString) {
            }
        }
    }];
    var appServ = angular.module('hciApp-services', ['restangular', 'ngResource']);
    appServ.factory('PodService', ['Restangular',function(Restangular) {

        return Restangular.withConfig(function(RestangularConfigurer) {

            RestangularConfigurer.setBaseUrl('/data');
            RestangularConfigurer.setRequestSuffix('.json');
            RestangularConfigurer.setRestangularFields({
                id: "podcast_id"
            });

        });
    }]);
    appServ.factory('Player', ['$rootScope', '$ionicLoading', function($rootScope, $ionicLoading){
        function onError(error){
            console.log(error.message);
        }
        function onConfirmRetry(button) {
            if (button == 1) {
                html5audio.play(html5audio.mediaSrc, html5audio.messTitle);
            } else html5audio.stop();
        }
        function pad2(number) {
            return (number < 10 ? '0' : '') + number
        }
        var showLoading = function () {
            var show = $ionicLoading.show({
                content: 'wait a sec...',
                showBackdrop: false
            })
        };
        var hide = function(){$ionicLoading.hide();};
        /*the player object*/
        var myaudio = new Audio(),
            readyStateInterval = null,
            html5audio = {
                playButton: true,
                stopButton: false,
                textPosition: null,
                fileDuration: null,
                progressTimer: null,
                progress: 0,
                maxValue: null,
                isPlaying: false,
                mediaSrc: null,
                messTitle: null,
                play: function(url, title){
                    html5audio.messTitle = title;
                    html5audio.mediaSrc = myaudio.src = url;
                    myaudio.play();
                    //html5audio.isPlaying = true;

                    readyStateInterval = setInterval(function(){
                        if (myaudio.readyState <= 2) {
                            html5audio.playButton = false;//hide play button
                            html5audio.textPosition = '';//pretty obvious! progress!!!
                        }
                    },1000);
                    /*update time*/
                    myaudio.addEventListener("timeupdate", function() {
                        var s = parseInt(myaudio.currentTime % 60);
                        var m = parseInt((myaudio.currentTime / 60) % 60);
                        var h = parseInt(((myaudio.currentTime / 60) / 60) % 60);
                        if (html5audio.isPlaying && myaudio.currentTime > 0) {
                            html5audio.textPosition = pad2(h) + ':' + pad2(m) + ':' + pad2(s);//progress
                            html5audio.progress = myaudio.currentTime; //update the slider
                        }
                    }, false);
                    myaudio.addEventListener("error", function() {
                        html5audio.stop();
                        console.log('myaudio ERROR');
                    }, false);
                    myaudio.addEventListener("canplay", function() {
                        console.log('myaudio CAN PLAY');
                        var s = parseInt(myaudio.duration % 60);
                        var m = parseInt((myaudio.duration / 60) % 60);
                        var h = parseInt(((myaudio.duration / 60) / 60) % 60);
                        if (myaudio.duration > 0) {
                            html5audio.fileDuration = pad2(h) + ':' + pad2(m) + ':' + pad2(s);//progress
                            html5audio.maxValue = myaudio.duration;
                        }
                    }, false);
                    myaudio.addEventListener("waiting", function() {
                        console.log('myaudio WAITING');
                        html5audio.isPlaying = false;
                        /*hide the play and hide buttons and only reveal the activity indicator*/
                        showLoading();
                        html5audio.playButton = false;
                        html5audio.stopButton = false;
                    }, false);
                    myaudio.addEventListener("playing", function() {
                        html5audio.isPlaying = true;
                        /*hide the play buttong and activity indicator and show the stop button*/
                        hide();
                        html5audio.playButton = false;
                        html5audio.stopButton = true;
                    }, false);
                    myaudio.addEventListener("ended", function() {
                        console.log('myaudio ENDED');
                        html5audio.stop();
                        navigator.notification.confirm(
                            'Play ended. What would you like to do?.', // message
                            onConfirmRetry,	// callback to invoke with index of button pressed
                            'Play back',	// title
                            'Repeat,Cancel'		// buttonLabels
                        );
                    }, false);
                },
                pause: function() {
                    html5audio.isPlaying = false;
                    clearInterval(readyStateInterval);
                    myaudio.pause();
                    /*hide the stop and activity indicators*/
                    hide();
                    html5audio.stopButton = false;
                    html5audio.playButton = true;
                },
                stop: function() {
                    html5audio.isPlaying = false;
                    clearInterval(readyStateInterval);
                    myaudio.pause();
                    /*hide the stop and activity indicator buttons and show the play button again*/
                    hide();
                    html5audio.stopButton = false;
                    html5audio.playButton = true;
                    myaudio = null;
                    html5audio.progress = 0;
                    myaudio = new Audio();
                    html5audio.textPosition = '';
                },
                update: function(position){
                    myaudio.currentTime = position;
                }
            };
        return html5audio;
    }]);
    appServ.factory('Photos', [ function(){
        var bCheckEnabled = true;
        var bFinishCheck = false;

        var photos = [];
        var img;
        var i = 1;

        var myInterval = setInterval(loadImage, 1);

        function loadImage() {

            if (bFinishCheck) {
                clearInterval(myInterval);
                console.log(photos)
                return;
            }

            if (bCheckEnabled) {

                bCheckEnabled = false;

                img = new Image();
                img.onload = fExists;
                img.onerror = fDoesntExist;
                img.src = 'images/full/' + i + '.jpg';
            }

        }

        function fExists() {
            photos.push(img.src);
            i++;
            bCheckEnabled = true;
        }

        function fDoesntExist() {
            bFinishCheck = true;
        }
        return photos
    }]);
    appServ.constant('DEFAULT_SETTINGS', {
        'showIntroPage': 'yes'
    });
    appServ.factory('IntroSettings', ['$rootScope','$state','DEFAULT_SETTINGS', function($rootScope,$state, DEFAULT_SETTINGS) {
        var _settings = {};
        try {
            _settings = JSON.parse(window.localStorage['settings']);
        } catch(e) {
        }
        // Just in case we have new settings that need to be saved
        _settings = angular.extend({}, DEFAULT_SETTINGS, _settings);
        if(!_settings) {
            window.localStorage['settings'] = JSON.stringify(_settings);
        }
        var obj = {
            getSettings: function() {
                console.log("getSettings")
                return _settings;
            },
            // Save the settings to localStorage
            save: function() {
                console.log("save settings")
                window.localStorage['settings'] = JSON.stringify(_settings);
                $rootScope.$broadcast('settings.changed', _settings);
            },
            // Get a settings val
            get: function(k) {
                return _settings[k];
            },
            // Set a settings val
            set: function(k, v) {
                _settings[k] = v;
                this.save();
            },
            delete_settings: function(){
                window.localStorage['settings'] = "";
            },
            checkIntroPage: function() {
                return _settings['showIntroPage'];
            }
        }
        return obj;
    }]);
    appServ.factory('Geo', ['$q',function($q) {
        return {
            reverseGeocode: function(lat, lng) {
                var q = $q.defer();

                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'latLng': new google.maps.LatLng(lat, lng)
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log('Reverse', results);
                        if(results.length > 1) {
                            var r = results[1];
                            var a, types;
                            var parts = [];
                            var foundLocality = false;
                            var foundState = false;
                            for(var i = 0; i < r.address_components.length; i++) {
                                a = r.address_components[i];
                                types = a.types;
                                for(var j = 0; j < types.length; j++) {
                                    if(!foundLocality && types[j] == 'locality') {
                                        foundLocality = true;
                                        parts.push(a.long_name);
                                    } else if(!foundState && types[j] == 'administrative_area_level_1') {
                                        foundState = true;
                                        parts.push(a.short_name);
                                    }
                                }
                            }
                            console.log('Reverse', parts);
                            q.resolve(parts.join(', '));
                        }
                    } else {
                        console.log('reverse fail', results, status);
                        q.reject(results);
                    }
                })

                return q.promise;
            },
            getLocation: function() {
                var q = $q.defer();

                navigator.geolocation.getCurrentPosition(function(position) {
                    q.resolve(position);
                }, function(error) {
                    q.reject(error);
                });

                return q.promise;
            }
        };
    }]);
    appServ.factory('Flickr', ['$q', '$resource','FLICKR_API_KEY',function($q,$resource,FLICKR_API_KEY) {
        var baseUrl = 'http://api.flickr.com/services/rest/'


        var flickrSearch = $resource(baseUrl, {
            method: 'flickr.groups.pools.getPhotos',
            group_id: '1463451@N25',
            safe_search: 1,
            jsoncallback: 'JSON_CALLBACK',
            api_key: FLICKR_API_KEY,
            format: 'json'
        }, {
            get: {
                method: 'JSONP'
            }
        });

        return {
            search: function(tags, lat, lng) {
                var q = $q.defer();

                console.log('Searching flickr for tags', tags);

                flickrSearch.get({
                    tags: 'london', //hard coded london in other get pictures from that tag
                    lat: lat,
                    lng: lng
                }, function(val) {
                    q.resolve(val);
                }, function(httpResponse) {
                    q.reject(httpResponse);
                });

                return q.promise;
            }
        };
    }]);
    appServ.factory('Weather', forecastioWeather);
    appServ.factory('PodLists', ['MyService','$timeout','$rootScope','$cacheFactory','$q','$stateParams',
        function(MyService, $timeout, $rootScope, $cacheFactory,$q,$stateParams){
        var pod_Cache = $cacheFactory('podCache'),
            bucket = 'hci-media',
            message = {
                podcasts: [],
                podcast: {},
                pods: function(){
                    var dondi = [],
                        percentComplete = 0,
                        d = $q.defer();
                    MyService.listObjects(bucket, 'podcasts/', 'podcasts/').then(function(messages){
                        //console.log(messages)
                        /*for(var i=0; i<messages.length; i++){
                            var key = messages[i].Key;
                            var cong = {
                                Bucket: bucket,
                                Key: key
                            };
                            (function(i){
                                MyService.getObjHead(cong).then(function(obj){
                                    if((obj.Metadata.title !== undefined) && (obj.Metadata.title !== '') && (obj.Metadata.title!== null)){
                                        var objectAndKey = {
                                            object:obj,
                                            objKey:messages[i].Key
                                        };
                                        //console.log("objectKeys ", objectAndKey)
                                        dondi.push(objectAndKey);
                                    }
                                });
                            })(i)

                            percentComplete = (i+1)/messages.length * 100;
                            d.notify(percentComplete);
                        }
                         if(i = messages.length - 1){
                         $timeout(function(){
                         d.resolve(dondi)
                         }, 2000)
                         }*/
                        angular.forEach(messages, function(value, key) {
                            //console.log("values ", value)
                            var messageKey = value.Key;
                            var cong = {
                                Bucket: bucket,
                                Key: messageKey
                            };
                            //console.log("config ", cong)

                            MyService.getObjHead(cong).then(function(obj){
                                if((obj.Metadata.title !== undefined) && (obj.Metadata.title !== '') && (obj.Metadata.title!== null)){
                                    var objectAndKey = {
                                        object:obj,
                                        objKey:value.Key
                                    };
                                    //console.log("objectKeys ", objectAndKey)
                                    dondi.push(objectAndKey);
                                }
                            });
                            percentComplete = (key+1)/messages.length * 100;
                            d.notify(percentComplete);
                        });


                        if(key = messages.length - 1){
                            $timeout(function(){
                                d.resolve(dondi)
                            }, 2000)
                        }
                    });
                   /* $timeout(function(){
                        d.resolve(dondi)
                    }, 2000)*/
                    return d.promise
                },
                podsArray: function(){
                    var d = $q.defer();
                    var pCache;
                    function mess (){
                        var see = message.pods()
                        if(!pCache){
                            var pCache = see;
                            pod_Cache.put("messagesCache", pCache);
                        } else {
                            pCache = pod_Cache.get("messagesCache");
                        }
                        d.resolve(pCache);
                        return d.promise
                    }
                    return $timeout(mess);
                }
            }
        return message;
    }]);
    appServ.service('MyService', ['$q', 'AWSService', '$cacheFactory', function($q, AWSService, $cacheFactory) {
        var self = this,
            params = { },
            s3Cache = $cacheFactory('s3Cache');
        var service = {
            podcasts: [],
            keys: [],
            currentUser: function(){
                var d = $q.defer();
                AWSService.awsInstance().then(function(){
                    var s3 = s3Cache.get('s3Instance');
                    if(!s3){
                        var s3 = new AWS.S3();
                        s3Cache.put('s3Instance', s3)
                    }
                    d.resolve(s3);
                });
                return d.promise
            },
            listObjects: function (bucket, prefix, marker){
                var d = $q.defer();
                if(prefix) params['Bucket'] = bucket;
                if(prefix) params['Prefix'] = prefix;
                if(marker) params['Marker'] = marker;
                service.currentUser().then(function(obj){
                    obj.listObjects(params, function(err, data){
                        try{
                            var content = data.Contents;
                            if (content == null){
                                return;
                            }
                            d.resolve(content);
                            console.log("content of listObjects ", content);
                        } catch (e){
                            console.log("some error occured ", e.message)
                        }
                    }, function(error){
                        d.reject("Unable to get content");
                        navigator.notification.alert('Unable to messages', null, "Error");
                        console.log("listObjects error ", error)
                    });
                });
                return d.promise
            },
            getObjHead: function(paramz){
                var d = $q.defer();
                service.currentUser().then(function(obj) {
                    obj.headObject(paramz, function (err, data) {
                        var s3Obj = data
                        d.resolve(s3Obj);
                    })
                });
                return d.promise
            }
        };
        return service
    }]);
    appServ.provider('AWSService', [function() {
        var self = this;
        AWS.config.region = 'eu-west-1';
        /*set defaults*/
        self.config = null;

        self.setKeys = function(accesskey, secretekey) {
            var config = {
                accessKeyId: accesskey,
                secretAccessKey: secretekey
            };
            return self.config = config;
        };

        self.$get = function($q, $cacheFactory, $cordovaNetwork,$cordovaDialogs) {
            var params = self.config,
                deferred = $q.defer(),
                awsS3Instance = $cacheFactory("awsS3Instance");
            return {
                awsInstance: function(){
                    var s3Obj = awsS3Instance.get("awsS3Instance");
                    if(!s3Obj){
                        var type =$cordovaNetwork.isOnline();
                        if (type) {
                            var s3Obj = AWS.config.update(params);
                            awsS3Instance.put("awsS3Instance", s3Obj)
                        } else {
                            $cordovaDialogs.alert("Cannot get messages when offline", null, "Offline!");
                        }
                    }
                    deferred.resolve(s3Obj);
                    return deferred.promise;
                }
            }
        }
    }]);
    appServ.factory('ContactMessages', ['$firebase', 'FIREBASE_URL', function($firebase, FIREBASE_URL){
        var ref = new Firebase(FIREBASE_URL + 'contactMessage/');
        var messages = $firebase(ref);
        var Message = {
            all: messages,
            create: function(message){
                return messages.$add(message);
            },
            find: function(messageId){
                return messages.$child(messageId);
            },
            delete: function(messageId){
                return messages.$remove(messageId);
            }
        };
        return Message;
    }]);
    appServ.factory('HomeCards', ['$q', '$http', 'KIMONOLABS', function($q, $http, KIMONOLABS) {
        var baseUrl = 'https://www.kimonolabs.com/api/9qdixyrk?callback=JSON_CALLBACK'

        return {
            getData: getData
        };
        function getData (){
            var kimonoRequest = $http.jsonp(baseUrl,
                { params: {
                    apikey: KIMONOLABS
                }
                });
            if (!sessionStorage.word42day){
                return(kimonoRequest.then(Success, Error))
                console.log("yes")
            }
        }
        function Error( response ) {
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        function Success( response ) {
            sessionStorage.word42day = angular.toJson(response.data)
            return( response.data );
        }

    }]);
})();

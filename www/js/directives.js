/**
 * Created by user on 12/05/2014.
 */
var appdir = angular.module('hciApp-directives', []);

    appdir.directive('audioPlayer', [function(){
    return{
        restrict: 'EA',
        require: ['^ngModel'],
        replace: true,
        scope: {
            ngModel: '=',
            player: '='
        },
        templateUrl: 'templates/playerControls.html',
        link: function(scope, iElm, iAttrs, controller){
            scope.$watch('player.current', function(newVal) {
                if (newVal) {
                    console.log("current is ready")
                    scope.playing = true;
                    scope.$watch('player.ready', function(newVal) {
                        if (newVal) {
                            console.log("Ready is ready")
                            scope.duration = scope.player.currentDuration();
                        }
                    });

                    scope.$watch('player.progress', function(newVal) {
                        scope.secondsProgress = scope.player.progress;
                    });
                }
            });
            scope.stop = function() {
                scope.ngModel.stop();
                scope.playing = false;
            }
        }
    }
}]);
    appdir.constant('WEATHER_ICONS', [{
        'partlycloudy': 'ion-ios7-partlysunny-outline',
        'mostlycloudy': 'ion-ios7-partlysunny-outline',
        'cloudy': 'ion-ios7-cloudy-outline',
        'rain': 'ion-ios7-rainy-outline',
        'tstorms': 'ion-ios7-thunderstorm-outline',
        'sunny': 'ion-ios7-sunny-outline',
        'clear-day': 'ion-ios7-sunny-outline',
        'nt_clear': 'ion-ios7-moon-outline',
        'clear-night': 'ion-ios7-moon-outline'
    }]);
    appdir.directive('weatherIcon', ['WEATHER_ICONS', function(WEATHER_ICONS) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                icon: '='
            },
            template: '<i class="icon" ng-class="weatherIcon"></i>',
            link: function($scope) {

                $scope.$watch('icon', function(v) {
                    if(!v) { return; }

                    var icon = v;

                    if(icon in WEATHER_ICONS) {
                        $scope.weatherIcon = WEATHER_ICONS[icon];
                    } else {
                        $scope.weatherIcon = WEATHER_ICONS['cloudy'];
                    }
                });
            }
        }
    }]);
    appdir.directive('currentTime', ['$timeout','$filter', function($timeout, $filter) {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="current-time">{{currentTime}}</span>',
            scope: {
                localtz: '=',
            },
            link: function($scope, $element, $attr) {
                $timeout(function checkTime() {
                    if($scope.localtz) {
                        $scope.currentTime = $filter('date')(+(new Date), 'h:mm ') + $scope.localtz;
                    }
                    $timeout(checkTime, 500);
                });
            }
        }
    }]);
    appdir.directive('currentWeather', ['$timeout','$rootScope','Settings', function($timeout, $rootScope, Settings) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/current-weather.html?152490s8746',
            scope: true,
            compile: function(element, attr) {
                return function($scope, $element, $attr) {

                    $rootScope.$on('settings.changed', function(settings) {
                        var units = Settings.get('tempUnits');
                        var current = $scope.current;

                        if(settings) {
                            console.log("settings are ", settings)
                            if(units == 'f') {
                                $scope.currentTemp = Math.floor(current.currently.temperature);
                            } else {
                                $scope.currentTemp = Math.floor((current.currently.temperature - 32) * 5 / 9);
                            }
                            if(units == 'f') {
                                $scope.highTemp = Math.floor(current.daily.data[0].temperatureMax);
                                $scope.lowTemp = Math.floor(current.daily.data[0].temperatureMin);
                            } else {
                                $scope.highTemp = Math.floor((current.daily.data[0].temperatureMax - 32) * 5 / 9);
                                $scope.lowTemp = Math.floor((current.daily.data[0].temperatureMin - 32) * 5 / 9);
                            }
                        }

                        /*if($scope.forecast) {

                            console.log("forcast ", $scope.forecast)

                            var forecast = $scope.forecast;
                            var current = $scope.current;
                            console.log("forcast ", forecast)
                            if(units == 'f') {
                                $scope.highTemp = forecast.forecastday[0].high.fahrenheit;
                                console.log("high temp ", $scope.highTemp)
                                $scope.lowTemp = forecast.forecastday[0].low.fahrenheit;
                                $scope.currentTemp = Math.floor(current.temp_f);
                            } else {
                                $scope.highTemp = forecast.forecastday[0].high.celsius;
                                $scope.lowTemp = forecast.forecastday[0].low.celsius;
                                $scope.currentTemp = Math.floor(current.temp_c);
                            }
                        }*/
                    });

                    $scope.$watch('current', function(current) {
                        var units = Settings.get('tempUnits');

                        if(current) {
                            if(units == 'f') {
                                $scope.currentTemp = Math.floor(current.currently.temperature);
                            } else {
                                $scope.currentTemp = Math.floor((current.currently.temperature - 32) * 5 / 9);
                            }
                            if(units == 'f') {
                                $scope.highTemp = Math.floor(current.daily.data[0].temperatureMax);
                                $scope.lowTemp = Math.floor(current.daily.data[0].temperatureMin);
                            } else {
                                $scope.highTemp = Math.floor((current.daily.data[0].temperatureMax - 32) * 5 / 9);
                                $scope.lowTemp = Math.floor((current.daily.data[0].temperatureMin - 32) * 5 / 9);
                            }
                        }
                    });

                    // Delay so we are in the DOM and can calculate sizes
                    $timeout(function() {
                        var windowHeight = window.innerHeight;
                        var thisHeight = $element[0].offsetHeight;
                        var headerHeight = document.querySelector('#header').offsetHeight;
                        $element[0].style.paddingTop = (windowHeight - (thisHeight)) + 'px';
                        angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
                        $timeout(function() {
                            angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
                        }, 50);
                    });
                }
            }
        }
    }]);
    appdir.directive('forecast', ['$timeout','$rootScope','Settings', function($timeout,$rootScope,Settings) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/forecast.html?6d3d5eyg964h4g5h8',
            link: function($scope, $element, $attr) {
                $scope.$watch('current', function(current) {
                    var units = Settings.get('tempUnits');
                    if(current) {
                        $scope.tempUn = units
                    }
                });
                $rootScope.$on('settings.changed', function(settings) {
                    var units = Settings.get('tempUnits');
                    var current = $scope.current;

                    if (settings) {
                        $scope.tempUn = units;
                    }
                });

            }
        }
    }]);
    appdir.directive('weatherBox', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@'
            },
            template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
            link: function($scope, $element, $attr) {
            }
        }
    }]);
    appdir.directive('scrollEffects', [ function() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var amt, st, header;
                var bg = document.querySelector('.bg-image');
                $element.bind('scroll', function(e) {
                    if(!header) {
                        header = document.getElementById('header');
                    }
                    st = e.detail.scrollTop;
                    if(st >= 0) {
                        header.style.webkitTransform = 'translate3d(0, 0, 0)';
                    } else if(st < 0) {
                        header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
                    }
                    amt = Math.min(0.6, st / 1000);

                    ionic.requestAnimationFrame(function() {
                        header.style.opacty = 1 - amt;
                        if(bg) {
                            bg.style.opacity = 1 - amt;
                        }
                    });
                });
            }
        }
    }]);
    appdir.directive('backgroundCycler', ['$compile', '$animate', function($compile, $animate) {
        var animate = function($scope, $element, newImageUrl) {
            var child = $element.children()[0];

            var scope = $scope.$new();
            scope.url = newImageUrl;
            var img = $compile('<background-image></background-image>')(scope);

            $animate.enter(img, $element, null, function() {
                console.log('Inserted');
            });
            if(child) {
                $animate.leave(angular.element(child), function() {
                    console.log('Removed');
                });
            }
        };

        return {
            restrict: 'E',
            link: function($scope, $element, $attr) {
                $scope.$watch('activeBgImage', function(v) {
                    if(!v) { return; }
                    console.log('Active bg image changed', v);
                    var item = v;
                    var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
                    animate($scope, $element, url);
                });
            }
        }
    }]);
    appdir.directive('backgroundImage', ['$compile', '$animate', function($compile, $animate) {
        return {
            restrict: 'E',
            template: '<div class="bg-image"></div>',
            replace: true,
            scope: true,
            link: function($scope, $element, $attr) {
                if($scope.url) {
                    $element[0].style.backgroundImage = 'url(' + $scope.url + ')';
                }
            }
        }
    }]);
    appdir.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
        return {
            require: '^form',
            restrict: 'A',
            link: function(scope, element, attrs, form) {
                form.$submitted = false;
                var fn = $parse(attrs.onValidSubmit);
                element.on('submit', function(event) {
                    scope.$apply(function() {
                        element.addClass('ng-submitted');
                        form.$submitted = true;
                        if (form.$valid) {
                            if (typeof fn === 'function') {
                                fn(scope, {$event: event});
                                form.$submitted = null;
                                element.removeClass('ng-submitted');
                            }
                        }
                    });
                });
            }
        }

    }]);
    appdir.directive('validated', ['$parse', function($parse) {
        return {
            restrict: 'AEC',
            require: '^form',
            link: function(scope, element, attrs, form) {
                var inputs = element.find("*");

                var processInputs = function(input) {
                    var attributes = input.attributes;
                    if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                        var field = form[attributes.name.value];
                        if (field != void 0) {
                            scope.$watch(function() {
                                return form.$submitted + "_" + field.$valid;
                            }, function() {
                                if (form.$submitted != true) {
                                    element.removeClass('has-success');
                                    return;
                                }
                                var inp = angular.element(input);
                                if (inp.hasClass('ng-invalid')) {
                                    element.removeClass('has-success');
                                    element.addClass('has-error');
                                } else {
                                    element.removeClass('has-error').addClass('has-success');
                                }
                            });
                        }
                    }
                };

                for(var i = 0; i < inputs.length; i++) {
                    processInputs(inputs[i]);
                }
            }
        }
    }]);
/**
 * Created by user on 10/06/2014.
 */
appFil = angular.module('hciApp-filters', ['hciApp-services'])
appFil.filter('temp', function(Settings) {
    return function(input) {
        if(Settings.getTempUnits() == 'f') {
            return input.fahrenheit;
        }
        return input.celsius;
    };
})

// Silly Wunderground uses a different name for f/c in the hourly forecast
    appFil.filter('tempEnglish', function(Settings) {
        return function(input) {
            if(Settings.getTempUnits() == 'f') {
                return input.english;
            }
            return input.metric;
        };
    })

    appFil.filter('tempIntToFer', function() {
        return function(input, scope) {
            var fer;
            if(scope.tempUn == 'f'){
                fer = parseInt(input)
            } else {
                fer = (input - 32) * 5/9
            }
            return parseInt(fer);
        }
    });

    appFil.filter('dateFil', function($filter)
    {
        return function(input)
        {
            if(input == null){ return ""; }

            var _date = $filter('date')(new Date(input), 'MMM dd yyyy');

            return _date.toUpperCase();

        };
    });


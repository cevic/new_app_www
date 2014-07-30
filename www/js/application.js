
/*var player = {
 devicePath: null,
 mediaTimer: null,
 mediaDuration: null,
 mediaDurationShow: null,
 media: null,
 progress: null,
 progressShow: null,
 isPlaying: false,
 /*initialize the media object *///player.devicePath+path,
/*initMedia: function(path){
    player.media = new Media(path,
        function(){
            console.log("media is successfull");
            if (player.media !== null)
                player.media.release();
            player.resetLayout()
        },
        function(error){
            navigator.notification.alert('unable to read file', function(){}, 'Error');
            console.log('Unable to read file.');
        })
},

play: function(path){
    if(player.media === null){
        player.initMedia(path);
    }
    if (player.isPlaying === false){
        player.loadingIndicator();
        player.media.play({ playAudioWhenScreenIsLocked : true });
        player.mediaTimer = setInterval(player.currentPosition, 1000);
        var counter = 0;
        var timeDuration = setInterval(function(){
            counter++;
            if(counter > 20)
                clearInterval(timeDuration);

            var duration = player.media.getDuration();
            if(duration > 0){
                clearInterval(timeDuration);
                $rootScope.$apply(function(){
                    player.mediaDuration = duration;
                    player.mediaDurationShow = player.utility.formatTime(duration);
                })
            } else $rootScope.$apply(function(){
                player.mediaDuration = null
            })
        }, 100);
        player.isPlaying = true;
        player.hideLoading();
    }
},

pause: function(){
    if (player.isPlaying = true)
        player.media.pause();
    clearInterval(player.mediaTimer)
    player.isPlaying = false;
},

stop: function (){
    if (player.media !== null){
        player.media.stop();
        player.media.release();
    }
    clearInterval(player.mediaTimer);
    player.media = null;
    player.isPlaying = false;
    player.resetLayout();
},

currentPosition: function(){
    player.media.getCurrentPosition(function(position){
            if (position > -1){
                $rootScope.$apply(function(){
                    player.progressShow = player.utility.formatTime(position)
                    player.updateSliderPosition(position);
                })
            }
        },
        function(error) {
            console.log('Oops!' + '\n'+ error.message + '\n');
        }
    )
},
update: function(newVal){
    player.seekPosition(newVal)
},
seekPosition: function(seconds){
    if(player.media === null)
        return;
    player.media.seekTo(seconds * 1000);
    player.updateSliderPosition(seconds)
},

resetLayout: function() {
    $rootScope.$apply(function(){
        player.utility.formatTime(0)
        player.updateSliderPosition(0);
    });
    player.isPlaying = false;
},
updateSliderPosition: function(position){
    player.progress = position;
},
/*loading overlay to indicate activity while blocking user interaction*/
/*loadingIndicator: function(){
    show = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
    })
},
hideLoading: function(){
    $ionicLoading.hide();
},
/*Utility for formatting time*/
/*utility: {
    formatTime: function(milliseconds) {
        if (milliseconds <= 0)
            return '00:00';

        var seconds = Math.round(milliseconds);
        var minutes = Math.floor(seconds / 60);
        if (minutes < 10)
            minutes = '0' + minutes;

        seconds = seconds % 60;
        if (seconds < 10)
            seconds = '0' + seconds;

        return minutes + ':' + seconds;
    },
    endsWith: function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    }
}
}

ionic.Platform.ready(function(){
    var device = ionic.Platform.device()
    if (device.platform === "iOS"){
        player.devicePath = 'http://localhost/'
    } else {
        player.devicePath = 'file://' + steroids.app.absolutePath + '/'
    }
})
return player*/

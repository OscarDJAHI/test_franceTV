document.addEventListener("DOMContentLoaded", function() { OskPlayerApp(); }, false);

function OskPlayerApp() {

    var i = 0;

    // MediaPlayer Model
    MediaPlayer = function(player,video,src,w,h,autoplay,controls){
      var player = document.getElementById(player);
      var media = document.createElement(video);
      
      media.src = src;
      media.setAttribute('width',w);
      media.setAttribute('height',h);
      media.setAttribute(autoplay,autoplay);
      media.setAttribute(controls,controls);

      player.appendChild(media);

      return media;
    }
    
    // Create MediaPlayer instance
    Video = new MediaPlayer('player-container','video','http://player.ftven.net/video/big_streamable.MP4','','','null','null');

    // Append MediaPlayer Controllers
    Video.parentNode.querySelector('#controls').innerHTML =  
          "<progress id='progress-bar' min='0' max='100' value='0'>0% played</progress>"
          +"<button id='btn_play' class='play' title='play'>Play</button>"
          +"<button id='btn_pause' class='pause' title='play'>Pause</button>"
          +"<button id='btn_stop' class='stop' title='stop'>Stop</button>";

    Pub = new MediaPlayer('player-container','video','http://videos-pub.ftv-publicite.fr/media/1237/1237477/1237477.mp4','','null','autoplay','null');
    // Pub.style ='position:absolute; top:8px; left:8px; z-index:0';
    Pub.style ='position:absolute; top:0px; left:0px; z-index:10';


    Video.addEventListener('ended',function(){i = 0;},false);

    Pub.addEventListener('ended',function(){
        i=1;
        this.style.display = 'none';
        Video.play();
    },false);

    Video.addEventListener('pause',function(){
      i=0;
    },false)

    Video.addEventListener('play', function(){
      if (this.currentTime == 0 && i!=1) {
        this.pause();
        Pub.style.display = 'block';
        Pub.play(); 
      }
      else if(this.currentTime > 0 && i == 0){
        this.pause();
        Pub.style.display = 'block';
        Pub.play();
        i = 1;
      }
      else {
        this.play();
      }
    });

    PlayerManager(Video);
}

///// Manage MediaPlayers
PlayerManager = function(player){

  // Videos controls buttons
  btnPlay     = document.getElementById("btn_play");
  btnPause    = document.getElementById("btn_pause");
  btnStop     = document.getElementById("btn_stop");
  progressBar = document.getElementById('progress-bar');

  // Add Click Event on button 
  btnPlay.addEventListener("click", playPlayer, false);
  btnPause.addEventListener("click", pausePlayer, false);
  btnStop.addEventListener("click", stopPlayer, false);

  // Add a listener on MediaPlayer
  player.addEventListener('timeupdate', updateProgressBar, false);
  player.addEventListener('play', function() { disableButton(btnPlay); enableButton(btnPause); }, false);
  player.addEventListener('pause', function() { disableButton(btnPause); enableButton(btnPlay); }, false);

  function playPlayer() {
    if (player.paused || player.ended) {
      player.play();
    }
  }

  function pausePlayer(){
    player.pause();
  }

  function stopPlayer() {
    player.pause();
    player.currentTime = 0;
  }

  // Update the progress bar
  function updateProgressBar() {
    // Work out how much of the media has played via the duration and currentTime parameters
    var percentage = Math.floor((100 / player.duration) * player.currentTime);
    // Update the progress bar's value
    progressBar.value = percentage;
    // Update the progress bar's text (for browsers that don't support the progress element)
    progressBar.innerHTML = percentage + '% played';
  }

  function enableButton(btn) {
    btn.removeAttribute('disabled');
  }

  function disableButton(btn) {
    btn.setAttribute('disabled',true);
  }
}
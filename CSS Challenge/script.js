  //GLOBAL variables:
  var score = 0;
  var sixSecCount = 6;
  var secBallTimer = 0;
  var selectedBall = "";
  var secBallRandomTime = getRandomRange(20, 30);
  var isActive = true;
  var secBallActive = false;

  //countdown timer in seconds
  var sec = 180;
  //intervall callback for timer <=> isActive=true
  var countdownTimer = setInterval(function() {
    if(isActive){
      countdown();
    }
  }, 1000);

  
  //TODO: drop allowance
  function allowDrop(ev) {
    ev.preventDefault();
  }

  //TODO: allow ball dragging
  function drag(ev, src) {
      ev.dataTransfer.setData("text", ev.target.id);
      selectedBall = src;
  }

  //TODO: ball drop in the zone
  function drop(ev) {
    var scoreLabel = document.getElementById('score');
    var data = ev.dataTransfer.getData("text");
  
    console.log(selectedBall);
    // if secBallActive allow dragging secBall only else score--;
    if (secBallActive){
      
      if(selectedBall == 'ball2'){
        console.log('sec ball identified')
        score += 2;
        changeColor(true);
        secBallActiveToggle(false);
      } else {
        console.log('first ball identified')
        score -= 4;
        changeColor(false);
      }
    } else {
      // handle for regular ball
      console.log("regualr ball handler")
      score++;
      changeColor(true);
      ballReposition(document.getElementById('ball'));
    }

    ev.preventDefault();
    ev.target.appendChild(document.getElementById(data));
    scoreLabel.innerHTML = score; 
  }

  //TODO: change the border color accordingly
  function changeColor(cond) {
    var hook = document.getElementById('hook');
    hook.style.animation = 'none';
    window.requestAnimationFrame(function(){
      if (cond) {
        hook.style.animation = 'blinkGreen .2s step-end 3';
      } else {
        hook.style.animation = 'blinkRed .2s step-end 3';
      }
    });
  }

  //TODO: reposition's the ball inside gameBox
  function ballReposition(ball) {
    var gameBox_H = document.getElementById('gameBox').clientWidth;
    var gameBox_V = document.getElementById('gameBox').clientHeight;
    
    var random_V = Math.round((Math.random() * (gameBox_V - ball.clientWidth)));
    var random_H = Math.round((Math.random() * (gameBox_H - ball.clientHeight)));
    

    //reset dragable propeties
    ball.draggable = false;
    sixSecCount = 6;
    if (secBallActive){
      secBallTimer = 0;
    }
    
    if(!isOusideOfHook(random_H,random_V)){
      ballReposition(ball);
    } else {
      ball.style.top = random_V + "px";
      ball.style.left = random_H + "px";
    }
 
  }

  //TODO: check if ball position outside hook with (x,y) cord.
  function isOusideOfHook(h,v){
    var hook = document.getElementById('hook');
    var ball = document.getElementById('ball');
    var startPoint_H = hook.offsetLeft - ball.offsetWidth;
    var endPoint_H = hook.offsetWidth + startPoint_H;
    var startPoint_V = hook.offsetTop - ball.offsetWidth;
    var endPoint_V = hook.offsetHeight + ball.offsetWidth;
    

    if( (h >= startPoint_H) && (h <= endPoint_H) ){
      if( (v >= startPoint_V) && (v <= endPoint_V) ){
        return false;
      }
    }
  
    return true;
  }

  //TODO: replay the game button
  function replayHandler() {
    var popupBox = document.getElementById('popupBox');
    window.location.reload();

    popupBox.style="display: none;"
  }

  //TODO: calculate the timer display
  function countdown() {
      var timer = document.getElementById('timer');
      var ball = document.getElementById('ball');
      var secBall = document.getElementById('ball2');
      var popup = document.getElementById('popup');
      var min = Math.round((sec - 30) / 60);
      var remainSec = sec % 60;

      console.log("timer:"+secBallTimer+" secBallRand:"+secBallRandomTime);
      
      // display score
      document.getElementById('score').innerHTML = score;

      if (remainSec < 10) {
          remainSec = "0" + remainSec;
      }

      // display main timer
      timer.innerHTML = "0" + min + ":" + remainSec;
      
      // random time bw 20-30s secBall appear
      if (secBallRandomTime == secBallTimer){
        secBallActiveToggle(true);
        ballReposition(secBall);
      }

      // sixSecCount reposition the balls / allow dragging
      // also if player didn't move secBall it will shift again
      if (sixSecCount == 0){
        ballReposition(ball);
        if (secBallActive){
          ballReposition(secBall);
        }
        changeColor(false);
        score--;
      }else if (sixSecCount > 2){
        ball.draggable = true;
        if (secBallActive){
          ball2.draggable = true;
        }
      }
      
      // when time's up / action for each interval
      if (sec == 0){
          clearInterval(countdown);
          timer.innerHTML = "Time's up!";
          checkScore();
          popup.style="display:block;";
          isActive = false;
      } else {
          sec --;
          sixSecCount --;
          secBallTimer ++;
          document.getElementById('countCircle').innerHTML = sixSecCount
      }

  }

  //TODO: get random number in range
  function getRandomRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  //TODO: activate secBall
  function secBallActiveToggle(cond) {
    var secBall = document.getElementById('ball2');
    if (cond){
      secBallActive = true;
      secBall.style.visibility = "visible";
      sec
    } else {
      secBallActive = false;
      secBall.style.visibility = "hidden";
      secBallRandomTime = getRandomRange(20, 30);
    }
    console.log("secBall active: "+ secBallActive)
  }

  //TODO: check player score
  function checkScore() {
    var popupTtile = document.getElementById('popupTitle');
    if (score > 10) {
      popupTtile.innerHTML = "Victory !"
    } else {
      popupTtile.innerHTML = " You Lost ! "
    }
  }

  //TODO: timer on/off toggle
  function timerToggle() {
    isActive = !isActive
    if(!isActive){
      document.getElementById('timerButton').className = "fas fa-play";
    }else {
      document.getElementById('timerButton').className = "fas fa-pause";
    }
  }
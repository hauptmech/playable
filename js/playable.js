window.editmode = false;
function toggleEdit(){
  window.editmode = !window.editmode;
  if (window.editmode) {
    document.getElementById('nav').style.display = 'none';
  }
  else {
    document.getElementById('nav').style.display = '';
  }
}

var mic, recorder, soundFile;

var state = 0; // mousePress will increment from Record, to Stop, to Play
var mainimage;
var mysound = p5.SoundFile();
var myelement = null;
var mytime;
var active_bubble=null;

function playablesetup(){
  //d3.select("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("xmlns:xlink","http://www.w3.org/1999/xlink");
  var elts = d3.select("svg").selectAll(".recordable")
  .attr("onclick","window.top.myplaysound(this)")//.style("stroke","red");

  d3.select("#edit").style("display","none");

  p5.prototype.soundFormats("wav","mp3","ogg");
  // create an audio in
  mic = new p5.AudioIn();
/**** Hide recording
  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);
  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();
***/
}
function actuallyplay(){
  mysound.playMode('restart');
  mysound.play();
  console.log("playing")
}

function checkPlayState(){
  if (mysound.isPlaying() && mytime < mysound.duration()){
    setTimeout(checkPlayState,200);
    if (mysound.currentTime() > mytime){mytime = mysound.currentTime()}
    else {mytime = mytime + mysound.currentTime()}
    //console.log("playing",mytime,mysound.duration())
  }
  else{
    stopPlaying();
    //console.log("stopped playing",mysound.currentTime(),mysound.duration())

  }
}

function stopPlaying(e){
      mysound.stop();
      state = 0;
      active_bubble = null;
      mytime = 0.0;
      myelement.style.stroke = "black";
}
function myplaysound(e){
  if (editmode){

    console.log(e.style.fill);
    // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
    if (state === 0 && mic.enabled) {
      e.style.stroke = "red";
      active_bubble = e;
      // Tell recorder to record to a p5.SoundFile which we will use for playback
      recorder.record(soundFile);
      state++;
    }
    else if (state === 1 && e == active_bubble) {
      recorder.stop(); // stop recorder, and send the result to soundFile
      p5.prototype.saveSound(soundFile, myname+"_"+e.id+'.wav'); // save file
      e.style.stroke = "black";
      state=0;
      active_bubble = null;
    }
    else {
      console.log("Undefined record state",e.id,active_bubble.id)
    }

  }
  else {
    if (state == 0 && active_bubble==null) {
       active_bubble = e;
      mysound = p5.prototype.loadSound( myname+"_"+e.id+'.wav',actuallyplay);
      e.style.stroke = "green";
      state = 1;
      myelement = e;
      mytime=0.0;

      setTimeout(checkPlayState,250);

    }
    else if (e == active_bubble){
      stopPlaying();

    }
    else {
      console.log("Undefined play state",e.id,active_bubble.id)
    }


  }



}


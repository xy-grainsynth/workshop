//audio buffer containing the currently selected recording
var audioBuffer;

var posX, posY;
var h, w;

var voices = []; //an array for touch events - polyphonic
var voicesmono = []; //this will be used for mouse events - monophonic

var bg = [];
var dots = []
var points = [];

/*
var attack = parseFloat(PARAMS.attack.toFixed(2));
var release = parseFloat(PARAMS.decay.toFixed(2));
var sustain = parseFloat(PARAMS.sustain.toFixed(2));
var spread = parseFloat(PARAMS.spread.toFixed(2));
var delay = parseFloat(PARAMS.delay.toFixed(1));
var feedback = parseFloat(PARAMS.feedback.toFixed(1));
var density = parseFloat(PARAMS.density.toFixed(2));
var transpose = parseFloat(PARAMS.pitch.toFixed(2));

*/

//declare audio context
var ctx, master;
// declare master volume
//var master;



//initial grain params
var attack = 0.40;
var release = 0.40;
var density = 1;
var transpose = 1.0;
var spread = 0.2;







// ####### WEB AUDIO CONTEXT DEFINITION ##############

// "loadbang"
window.onload = function () {

    //web audio setup
    ctx = new (window.AudioContext || window.webkitAudioContext);

    //master volume
    master = ctx.createGain();
    master.connect(ctx.destination);



    //load buffer with page
    bufferSwitch(0);




}

/*
// suspend audio context upon page start up
ctx.suspend().then(() => {
    console.log(ctx.state);
});

*/


function setup() {

    // create a p5 canvas the same size as the browser window
    gcanvas = createCanvas(windowWidth, windowHeight);
    // tie the canvas to canvasContainer html node
    gcanvas.parent("canvasContainer");


    ellipseMode(RADIUS);
    noStroke();
}


function draw() {

    posX = mouseX;
    posY = mouseY;


    clear();

    //limit drawing and sound generation to within canvas
    if (posX > 0 && posX < windowWidth && posY > 0 && posY < windowHeight) {
        if (mouseIsPressed) {

             console.log("mouse is pressed");
            //  voicesmono[0].playmouse();
            //    var g = playgrain(posX, mouseY);

        }


    }

    stroke(0);
    strokeWeight(4);
    noFill();
    noStroke();

    //   frameRate(density);

}


function mousePressed() {
    // mouseState = true;
    console.log("create a new voice");
        var v = new voice();
        v.playmouse();
        voicesmono[0] = v;
        console.log(voicesmono);
    
}



function mouseReleased() {
    mouseIsPressed = false;
    console.log("Stop voice");
    console.log(voicesmono[0]);
    for (var i = 0; i < voicesmono.length; i++) {
        voicesmono[i].stop();
        voicesmono.splice(i);
    }
}


function voice(id) {

    this.touchid = id;
}


//play function for mouse event
voice.prototype.playmouse = function () {
    this.grains = [];
    this.graincount = 0;
    var that = this; //for scope issues	
    this.play = function () {
        //create new grain
        var g = new playgrain(mouseX, mouseY);
        //push to the array
        that.grains[that.graincount] = g;
        that.graincount += 1;
        /*
                if (that.graincount > 20) {
                    that.graincount = 0;
                }
                */
        //next interval
        this.dens = map(density, 1, 0, 0, 1);
        this.interval = (this.dens * 500) + 30;
        console.log("dens: "+ this.dens + " interval: " + this.interval);
        that.timeout = setTimeout(that.play, this.interval);
        

    }
    this.play();
}


//stop method
voice.prototype.stop = function () {
    clearTimeout(this.timeout);
}





//the grain class
function playgrain(positionx, positiony) {

    var that = this; //for scope issues
    var now = ctx.currentTime; //update the time value
    //create the source
    this.grain = ctx.createBufferSource();
    this.grain.buffer = audioBuffer;
    //create the gain for enveloping
    this.contour = ctx.createGain();

    /*
    //experimenting with adding a panner node - not all the grains will be panned for better performance
    var yes = parseInt(rand(3),10);
    if( yes === 1){
        this.panner = context.createPanner();
        this.panner.panningModel = "equalpower";
        this.panner.distanceModel = "linear";
        this.panner.setPosition(p.random(pan * -1,pan),0,0);
        //connections
        this.source.connect(this.panner);
        this.panner.connect(this.gain);
    }else{
        this.source.connect(this.gain);
    }
    */

    this.contour.connect(master);

    this.grain.connect(this.contour);

    //update the position and calcuate the offset
    var len = this.grain.buffer.duration;
    this.positionx = positionx;
    this.offset = this.positionx * (len / windowWidth); //pixels to seconds

    //update and calculate the amplitude
    this.positiony = positiony;
    this.amp = this.positiony / windowHeight;
    this.amp = map(this.amp, 0.0, 1.0, 1.0, 0.0) ;

    this.grain.playbackRate.value = this.grain.playbackRate.value * transpose;
   //this.grain.playbackRate.value = transpose;
  
    this.spread = spread;

    this.randomoffset = (Math.random() * this.spread) - (this.spread / 2); //in seconds
    ///envelope
    //  grain.start(ctx.currentTime, offset);
    this.grain.start(ctx.currentTime, Math.max(0.0, this.offset + this.randomoffset)); //parameters (when,offset,duration)
    this.contour.gain.setValueAtTime(0.0, ctx.currentTime);
    this.contour.gain.linearRampToValueAtTime(this.amp, ctx.currentTime + attack);
    this.contour.gain.linearRampToValueAtTime(0.0, ctx.currentTime + (attack + release));


    console.log("playgrain: " + attack + " " + release + " " + this.amp + " " + this.offset + " " + density + " " + + " " + this.randomoffset + " " + this.spread);

    //garbage collection
    this.grain.stop(ctx.currentTime + attack + release + 0.1);
    var tms = (attack + release) * 1000; //calculate the time in miliseconds
    setTimeout(function () {
        that.contour.disconnect();
        /*
        if (yes === 1) {
            that.panner.disconnect();
        }
        */
    }, tms + 200);

}



////////////////////////////////////////////////////////////////////////////////

function grains(pos, pitch) {

    var grain = ctx.createBufferSource();
    var contour = ctx.createGain();
    var verbLevel = ctx.createGain();
    var len, factor, position, randFactor;


    const delay = ctx.createDelay();
    delay.delayTime.value = del;

    const feedback = ctx.createGain();
    feedback.gain.value = fb;

    console.log("grains: att " + att + " dec " + dec + " density " + density + " delay " + del + " fb " + fb + " pitch " + pitch);

    contour.gain.setValueAtTime(0, ctx.currentTime);
    contour.gain.linearRampToValueAtTime(0.5 * rand(0.2, 1), ctx.currentTime + att + sust); // volume ramp is a bit randomized 
    contour.gain.linearRampToValueAtTime(0, ctx.currentTime + (att + + sust + dec) + 0.1);
    //contour.gain.linearRampToValueAtTime(0.6 * rand(0.5, 1), ctx.currentTime + grain_x_mapped);
    //contour.gain.linearRampToValueAtTime(0, ctx.currentTime + (grain_x_mapped + grain_y_mapped));

    delay.connect(feedback);
    feedback.connect(delay);
    // delay.connect(master);

    contour.connect(delay);
    // contour.connect(verbLevel);
    contour.connect(master);
    //   delay.connect(master);

    //verbLevel.gain.setValueAtTime(0.6, ctx.currentTime);
    //verbLevel.connect(master);

    var gRate = pitch;
    //  var gRate = (2.5 * (0.8 - (pitch / windowHeight))) + 0.5;
    //  console.log("gRate " + gRate + " pitch "+ pitch);
    //console.log("posY "+posY + " - pitch/wh "+ pitch/windowHeight + " - reverse pitch val "+0.8 - (pitch/windowHeight) + " -grate " + gRate);

    grain.buffer = audioBuffer;
    len = grain.buffer.duration;
    factor = pos;
    position = windowWidth;
    //spread
    randFactor = spread; // smaller randFactor makes larger density, larger randFactor makes density smaller and the sounds more recognizable, its the grain length, spread

    //grainsize = map(pos, 0, windowWidth, 0.01, 1.00);
    //  if(usepitch){
    grain.playbackRate.value = gRate;
    /* 
     if (gRate < 1) {
         grain.playbackRate.value = 0.5;
     } else {
         grain.playbackRate.value = gRate;
     }
     */

    grain.connect(contour);

    playtime = att + sust + dec;
    randval = rand(0, spread);
    startPos = (len * (pos / position)) + randval;
    //   console.log(startPos);
    // grain start point = buf len * mouse position / x dimension + rand
    //grain.start(ctx.currentTime, (len * factor / position) + rand(0, randFactor));
    grain.start(ctx.currentTime, startPos);
    //console.log("len "+len + " - start  "+ startPos + " - randval " + randval +  " - playtime "+playtime);

    //stop old grains
    grain.stop(ctx.currentTime + playtime + 0.1);

    const disconnectTime = (att + sust + dec) * 1000;

    setTimeout(() => {
        contour.disconnect();
    }, disconnectTime + 200);


}













// ################ HELPER FUNCTIONS ############################


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



//https://stackoverflow.com/questions/10592411/disable-scrolling-in-all-mobile-devices

window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event) {
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}


function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//audio buffer containing the currently selected recording
var audioBuffer;

var posX, posY;
var h, w;

var voices = []; //an array for touch events - polyphonic
var voicesmono = []; //this will be used for mouse events - monophonic

var bg = [];
var dots = []
var points = [];


var attack = parseFloat(PARAMS.attack.toFixed(2));
var release = parseFloat(PARAMS.release.toFixed(2));
var spread = parseFloat(PARAMS.spread.toFixed(2));
var transpose = parseFloat(PARAMS.pitch.toFixed(2));
var density = parseFloat(PARAMS.density.toFixed(2));




//declare audio context
var ctx, master;
// declare master volume
//var master;






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
            //graingenerator_main(posX,posY);

            if (voicesmono.length == 0) {
                console.log("create a new voice");
                var v = new voice_main();
                v.playmouse();
                voicesmono[0] = v;
            }

        } else {
            for (var i = 0; i < voicesmono.length; i++) {
                console.log("Stop voice");
                voicesmono[i].stop();
                voicesmono.splice(i);
            }
        }
    }

    else {
        for (var i = 0; i < voicesmono.length; i++) {
            console.log("Stop voice");
            voicesmono[i].stop();
            voicesmono.splice(i);
        }
    }

    stroke(0);
    strokeWeight(4);
    noFill();
    noStroke();

    //   frameRate(density);

}



//the grain class
function graingenerator_main(positionx, positiony) {

    console.log("in grain generator");

    var grain = ctx.createBufferSource();
    grain.buffer = audioBuffer;
    //create the gain for enveloping
    var contour = ctx.createGain();
    contour.connect(master);
    grain.connect(contour);

    //update the position and calcuate the offset
    var len = grain.buffer.duration;
    var offset = len * (positionx / windowWidth); //pixels to seconds

    //update and calculate the amplitude
    amp = positiony / windowHeight;
    amp = map(amp, 0.0, 1.0, 1.0, 0.0);

    grain.playbackRate.value = grain.playbackRate.value * transpose;

    randomoffset = (Math.random() * spread) - (spread / 2); //in seconds

    grain.start(ctx.currentTime, Math.max(0.0, offset + randomoffset));
    contour.gain.setValueAtTime(0.0, ctx.currentTime);
    contour.gain.linearRampToValueAtTime(amp, ctx.currentTime + attack);
    contour.gain.linearRampToValueAtTime(0.0, ctx.currentTime + (attack + release));
    grain.stop(ctx.currentTime + attack + release + 0.1);


    var tms = (attack + release) * 1000; //calculate the time in miliseconds
    setTimeout(function () {
        contour.disconnect();
    }, tms + 200);

}


function voice_main(id) {
    this.touchid = id;
    this.grains = [];
    var that = this;
    this.playmouse = function () {
        this.play = function () {
            graingenerator_main(mouseX, mouseY);
            this.dens = map(density, 1, 0, 0, 1);
            this.interval = (this.dens * 500) + 30;
            that.timeout = setTimeout(that.play, this.interval);
        }
        this.play();
    }
    this.stop = function () {
        clearTimeout(this.timeout);
    }
}





function voice(id) {
    this.touchid = id;
}
//play function for mouse event
voice.prototype.playmouse = function () {
    this.grains = [];
    var that = this; //for scope issues	
    this.play = function () {
        //create new grain
        var g = new graingenerator(mouseX, mouseY);
        //push to the array
        that.grains[that.graincount] = g;
        this.dens = map(density, 1, 0, 0, 1);
        this.interval = (this.dens * 500) + 30;
        console.log("dens: " + this.dens + " interval: " + this.interval);
        that.timeout = setTimeout(that.play, this.interval);
    }
    this.play();
}
//stop method
voice.prototype.stop = function () {
    clearTimeout(this.timeout);
}



//the grain class
function graingenerator(positionx, positiony) {

    var that = this; //for scope issues
    var now = ctx.currentTime; //update the time value
    //create the source
    this.grain = ctx.createBufferSource();
    this.grain.buffer = audioBuffer;
    //create the gain for enveloping
    this.contour = ctx.createGain();

    var pan = 0.1;
    //experimenting with adding a panner node - not all the grains will be panned for better performance
    var yes = parseInt(rand(3), 10);
    if (yes === 1) {
        this.panner = ctx.createPanner();
        this.panner.panningModel = "equalpower";
        this.panner.distanceModel = "linear";
        this.panner.setPosition(Math.random(pan * -1, pan), 0, 0);
        //connections
        this.grain.connect(this.panner);
        this.panner.connect(this.contour);
    }
    /* 
    else {
        this.grain.connect(this.contour);
    }
    */



    // add a feedback delay to the grain
    this.delay = ctx.createDelay();
    this.delay.delayTime.value = delay;

    this.feedback = ctx.createGain();
    this.feedback.gain.value = feedback;

    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.contour.connect(this.feedback);
    this.grain.connect(this.feedback);

    this.contour.connect(master);

    this.grain.connect(this.contour);

    //update the position and calcuate the offset
    var len = this.grain.buffer.duration;
    this.positionx = positionx;
    this.offset = this.positionx * (len / windowWidth); //pixels to seconds

    //update and calculate the amplitude
    this.positiony = positiony;
    this.amp = this.positiony / windowHeight;
    this.amp = map(this.amp, 0.0, 1.0, 1.0, 0.0);

    this.grain.playbackRate.value = this.grain.playbackRate.value * transpose;

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

        if (yes === 1) {
            that.panner.disconnect();
        }

    }, tms + 200);

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

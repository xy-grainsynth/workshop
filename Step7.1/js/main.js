//audio buffer containing the currently selected recording
var audioBuffer;

var posX, posY;
var h, w;

var voices = []; //an array for touch events - polyphonic
var voicesmono = []; //this will be used for mouse events - monophonic

var bg = [];
var dots = []
var points = [];


//declare audio context
var ctx, master;
// declare master volume
//var master;



//initial grain params
var attack = 0.40;
var release = 0.40;
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
            graingenerator_main(posX, posY);
        }
    }

    stroke(0);
    strokeWeight(4);
    noFill();
    noStroke();

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

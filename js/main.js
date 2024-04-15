//declare audio context
var ctx;
// declare master volume
var master;
//audio buffer containing the currently selected recording
var audiobuffer;

var posX, posY;

// define the audio context when the page/window is opened
//web audio setup
ctx = new (window.AudioContext || window.webkitAudioContext);
//master volume
master = ctx.createGain();
// connect to output
master.connect(ctx.destination);

// suspend audio context upon page start up
ctx.suspend().then(() => {
    console.log(ctx.state);
});




function setup() {

    // create a p5 canvas the same size as the browser window
    canvas = createCanvas(windowWidth, windowHeight);
    // tie the canvas to canvasContainer html node
    canvas.parent("canvasContainer");
}


function draw() {

    posX = mouseX;
    posY = mouseY;


    //limit drawing and sound generation to within canvas
   if (posX > 0 && posX < windowWidth && posY > 0 && posY < windowHeight) {
        if (mouseIsPressed) {
            console.log(mouseX);
        }
   }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}





const PARAMS = {
  source: 0, //sample file number in GUI drop down list
  attack: 0.3, //in seconds
  release: 0.3, //in seconds
  density: 0.8,
  spread: 0.5,
  pitch: 1.0
};


const pane = new Tweakpane({
    title: 'Web Grain Synth',
    expanded: true,
});

pane.addSeparator();



// sound/tone context on and off
const btnSound = pane.addButton({
    title: '► | ◼︎',
    label: 'audio on/off',
  });
  
  
  btnSound.on('click', () => {
    if (ctx.state == "running") {
      ctx.suspend().then(() => {
        console.log(ctx.state);
      });
    }
    else {
      ctx.resume().then(() => {
        console.log(ctx.state);
      });   
    }
  }
  )


const SourceInput =
    pane.addInput(PARAMS, 'source', { options: { "river water": 0, "blackbird": 1} });
SourceInput.on('change', function (ev) {
    //console.log(ev.value);
    if (ev.value == 0) {
        bufferSwitch(0);
    }
    if (ev.value == 1) {
        bufferSwitch(1);
    }
});







function bufferSwitch(input) {
    var getSound = new XMLHttpRequest();
    getSound.responseType = "arraybuffer";

    console.log("in buffer switch " + input);
    if (input == 0) {
        getSound.open("get", "recordings/riverwater.wav", true);
    }
    if (input == 1) {
        getSound.open("get", "recordings/bbc_blackbird-_nhu0510417/NHU05104173.wav", true);
    }

    getSound.onload = function () {
        ctx.decodeAudioData(getSound.response, function (buffer) {
            audioBuffer = buffer;
            console.log(audioBuffer.length);
        });
    };
    getSound.send();
}
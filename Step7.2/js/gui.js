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
  
  
  
  
  
  const area = pane.addFolder({
    title: 'Grain Params',
    expanded: true
  });
  
  
  
  
  const attInput = area.addInput(PARAMS, 'attack', { min: 0.01, max: 1.0, step: 0.01 });
  attInput.on('change', function (ev) {
    attack = parseFloat(ev.value.toFixed(2));
  });
  
  const decInput = area.addInput(PARAMS, 'release', { min: 0.01, max: 1.0, step: 0.01 });
  decInput.on('change', function (ev) {
    release = parseFloat(ev.value.toFixed(2));
  });

  
  const sprInput = area.addInput(PARAMS, 'spread', { min: 0, max: 3, step: 0.1 });
  sprInput.on('change', function (ev) {
    spread = parseFloat(ev.value.toFixed(2));
  });
  
  
  
  const effects = pane.addFolder({
    title: 'Effect Params',
    expanded: true
  });
  
  
  
  const pInput = effects.addInput(PARAMS, 'pitch', { min: 0.01, max: 10, step: 0.01 });
  pInput.on('change', function (ev) {
    transpose = parseFloat(ev.value.toFixed(2));
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
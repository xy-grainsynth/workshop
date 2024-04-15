const PARAMS = {
    source: 0, //sample file number in GUI drop down list
    map: 3,
    attack: 0.3, //in seconds
    decay: 0.3, //in seconds
    sustain: 0.2,
    density: 0.8,
    delay: 0.1,
    feedback: 0.1,
    spread: 0.5,
    pitch: 1,
    numcentr: 3
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
    att = parseFloat(ev.value.toFixed(2));
    console.log(" att in gui " + att);
  });
  
  const decInput = area.addInput(PARAMS, 'decay', { min: 0.01, max: 1.0, step: 0.01 });
  decInput.on('change', function (ev) {
    dec = parseFloat(ev.value.toFixed(2));
    console.log(" dec in gui " + dec);
  });
  
  const sustInput = area.addInput(PARAMS, 'sustain', { min: 0.01, max: 1.0, step: 0.01 });
  sustInput.on('change', function (ev) {
    sust = parseFloat(ev.value.toFixed(2));
    console.log(" dec in gui " + sust);
  });
  
  const densInput = area.addInput(PARAMS, 'density', { min: 0, max: 1, step: 0.01 });
  densInput.on('change', function (ev) {
    density = parseFloat(ev.value.toFixed(2));
  });
  
  
  const sprInput = area.addInput(PARAMS, 'spread', { min: 0, max: 3, step: 0.1 });
  sprInput.on('change', function (ev) {
    spread = parseFloat(ev.value.toFixed(2));
  });
  
  
  const effects = pane.addFolder({
    title: 'Effect Params',
    expanded: true
  });
  
  
  const delInput = effects.addInput(PARAMS, 'delay', { min: 0.0, max: 0.9, step: 0.1 });
  delInput.on('change', function (ev) {
    del = parseFloat(ev.value.toFixed(1));
  });
  
  
  const fbInput = effects.addInput(PARAMS, 'feedback', { min: 0.0, max: 0.9, step: 0.1 });
  fbInput.on('change', function (ev) {
    fb = parseFloat(ev.value.toFixed(1));
  });
  
  const pInput = effects.addInput(PARAMS, 'pitch', { min: 0.01, max: 10, step: 0.01 });
  pInput.on('change', function (ev) {
    transpose = parseFloat(ev.value.toFixed(2));
  });
  
  
  
  const grain = pane.addFolder({
    title: 'Grain Param Monitor',
    expanded: true
  });
  
  
  pane.addMonitor(PARAMS, 'density', { view: 'graph', min: 1, max: 100 });
  pane.addMonitor(PARAMS, 'attack', { view: 'graph', min: 0.01, max: 1.0 });
  pane.addMonitor(PARAMS, 'decay', { view: 'graph', min: 0.01, max: 1.0 });
  
  
  
  
  
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
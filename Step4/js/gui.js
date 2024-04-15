const PARAMS = {
    source: 0,  // default value of tweakpane param source
};


const pane = new Tweakpane({
    title: 'Web Grain Synth',
    expanded: true,
});

pane.addSeparator();

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


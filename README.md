# CX Class 16.04.2024 "Experiments with Web-based Audio"
Bela Usabaev, speech synthesis, media art, web-based applications

Eleni-Ira Panourgia, Postdoctoral Researcher, sound and visual art, web art, interactive applications, sound and climate change

## Introduction to the workshop
- What is Web Audio?
- ClimaSynth web application - a case study
- Hands-on experimentation with ClimaSynth and testing: https://ctechfilmuniversity.github.io/project_ClimaSynth/

<img src="https://github.com/xy-grainsynth/xy-prototype/assets/115570643/34b7190e-8a4f-4ede-9a6f-cfd78e3b5bac"  width="200" height="200">

## Practical session: creating a mini web synth
1. create index.html, load p5 and tweakpane library, add css stylesheet, test in VS studio code, check for errors using the console output [Step 1](https://github.com/xy-grainsynth/workshop/tree/3e2b8b6582ee4d3fdd18285555bde1f1e51077b2)
2. p5 framework and web audio
   1. create js/Step2/main.js file in VS Studio Code
   1. in main.js create p5 sketch with setup() and draw()
     ```
     function setup() {

     }

     function draw() {
     }
     ```
   1. in setup() create a p5 canvas the same size as the browser window
     ```
     canvas = createCanvas(windowWidth, windowHeight);
     ```
   1. in setup() tie the canvas to canvasContainer html node
       ```
       canvas.parent("canvasContainer");
       ```
   1. declare audio context at the top of the main script
      ```
      ctx = new (window.AudioContext || window.webkitAudioContext);
      master = ctx.createGain();
      master.connect(ctx.destination);
      ```
   - p5 sketch stub and web audio context definition
5. defining/setting gain, connecting to master output
6. sourcing own recordings .wav format max. duration 1 minute (think of a sound that would be interesting to use for transitions from natural to extreme/unfamiliar state) Search on [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/search?q=nature&resultSize=30) or other open-access libraries
7. sounds laden/defining and loading buffers
8. connection between web audio und canvas
9. grains generator: how are the granulator work
   - example stub
   - continue adding one effect and exposing the value to test it 
10. setting up a GUI to control the web audio context and expose the granular synth parameters
   - tweakpane library
   - grain param monitors
11. test/play with the built synth, and define a sound that associates with a climate condition, defining associations with climate scenarios

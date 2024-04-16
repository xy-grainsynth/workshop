Web Audio is a web technology to build sound applications in the web browser based on Javascript. The [Web audio api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) is a modular kind of system to work with sound in the browser and allows to process audio but also to build own synthesizers.<br>
<br>
The api works via the web audio context which has to be declared and instantiated, everything sound related happens as part of this audio context, providing functionality to work with sound files. <br>
<br>
The api consists of different nodes that represent audio processing algorithms or functions or properties, and can be put together via the method connect.<br>
<br>
So it is a bit like when putting together a sound or modular and audio equipment setup, the effects are plugged onto a sampler, the sampler is pluged onto a main out speakers etc.<br>
![Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/audio-context_.png)
<br>
The low level sound processing capabilities allow to write all parts by oneself.<br>
<br>
On the other hand [p5 js](https://p5js.org/) is a creative coding library, stemming from the processing framework, but more focused on interactivity, and visual rendering in the 2d (and 3d) environment, also including the [WebGL rendering](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).<br>
<br>
P5 works with the [\<canvas\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) HTML element and provides built-in interactive functionality. The rendered visual information can be interacted with using sound and mouse or touch input.<br>
<br>
Since the web audio api and p5 js both exist in the browser and are based on Javascript, they are part of the same ecosystem and can be used together.<br>
<br>
We will implement a granular synthesizer using web audio and use it as part of a blank p5 canvas. We will control the synth via a Gui, implemented using the [TweakPane](https://tweakpane.github.io/docs/v3/) Javascript library, to make adjustments to the sound and effectively build a small digital sound instrument.<br>
<br>
[Granular synthesis](https://www.soundonsound.com/techniques/granular-synthesis)  is a sound processing technique where a sample recording is processed by splitting it up into small chunks, and resynthesizing them in different ways according to different grain synth parameters. Especially granular synthesis is the idea of time stretching a sample without changing the pitch, or pitch shifting a recording without changing the length of the sample. [explanation from izotope with sound examples](https://www.izotope.com/en/learn/the-basics-of-granular-synthesis.html)<br>
<br>
We will implement the basic functionality of granular synthesis based on individually chosen sound recordings.

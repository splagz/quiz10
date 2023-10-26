let song;
let fft;
let r;
let img;

function preload() {
  song = loadSound("sound/sample-visualisation.mp3");
  img = loadImage("image/pexels-francesco-ungaro-998641.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(RGB);
  img.filter(BLUR, 10);

  fft = new p5.FFT();
}

function draw() {
  background(0);
  strokeWeight(4);
  noFill();
  image(img, 0, 0, width, height);

  translate(width / 2, height / 2);

  let wave = fft.waveform();
  //The loop should run twice to create the circle
  for (let t = -1; t <= 1; t += 2) {
    stroke(102, 106, 183);
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));
      //used floor to make sure that the value would be an integer.

      r = map(wave[index], -1, 1, 200, 400);

      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  //volume changes depending on mouse position (Left- decrease, Right- increase)
  let volume = map(mouseX, 0, width, 0, 1);
  volume = constrain(volume, 0, 1);
  song.amp(volume);

  let spectrum = fft.analyze();
  beginShape()
  for (let i = 0; i < spectrum.length; i++) {
    let angle = map(i, 0, spectrum.length, 0, 360); //map to make it 360 degrees
    let amp = spectrum[i];
    let r = map(amp, 0, 256, 100, 300);
    //sin and cos to make the position of the points
    let x = r * cos(angle);
    let y = r * sin(angle);
    stroke(166, 221, 56);
    line(0, 0, x, y);
  }
  endShape();
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}
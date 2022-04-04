// Teachable Machine
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/TeachableMachine/1-teachable-machine.html
// https://editor.p5js.org/codingtrain/sketches/PoZXqbu4v

// The video
let video;
// For displaying the label
let label = "waiting...";
// The classifier
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/EZG4eISEi/';

// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}


const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');






function setup() {
   canvas = createCanvas(640, 520);
  //canvas = canvasCtx;
  
  // Create the video
  const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }});
  hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.23,
  minTrackingConfidence: 0.42
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});

  camera.start();
  //canvas = canvasCtx;
  
  //video = 'input_video';
  
  video = createCapture(VIDEO);
  //video = hands.onResults(onResults); 
  //video.hide();
  // STEP 2: Start classifying
  classifyCanvas();
  //classifyVideo();
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#FF5217', lineWidth: 1.75});
      drawLandmarks(canvasCtx, landmarks, {color: '#2AB0AA', lineWidth: .1});
    }
  }
  canvasCtx.restore();
}

// STEP 2 classify the videeo!
function classifyVideo() {
  classifier.classify(video, gotResults);
}

function classifyCanvas() {
  classifier.classify(canvasElement, gotResults);
}


function draw() {
  background(0);

  // Draw the video
  image(video, 0, 0);
  //image(canvas, 0, 0);
  //camera.start();

  // STEP 4: Draw the label
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, width / 2, height - 16);

  // Pick an emoji, the "default" is train
  let media = "play video";
  if (label == "palms open") {
    media = "pause video";
  } else if (label == "thumbs down") {
    media = "last song ";
  } else if (label == "thumbs up") {
    media = "next song";
  }else if (label == "one") {
    media = "play";
  }

  // Draw the emoji
  textSize(50);
  text(media, width / 2, height / 2);
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again!
  //console.log(results);
  // Show the first label and confidence
  //label.html('Label: ' + results[0].label);
  //classifyVideo();
   label = results[0].label;
  classifyCanvas();
}

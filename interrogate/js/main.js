var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = "#JSGF V1.0;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = "en-US";
recognition.interimResults = false;
$(document).ready(function () {
  $("#live").hide();
  $(".vids").hide();
  $("#intro").hide();
  $(".line-2").hide();
  //   $("speech").hide();
  $("#begin").on("click", function () {
    $("#wrap").hide();
    $("#intro").show();
    setTimeout(function () {
      $(".line-1").hide();
      $(".line-2").show();
      setTimeout(function () {
        $("#intro").hide();
        initCamera();
        recognizeSpeech();
        setTimeout(function () {
          $("#live").show();
        }, 2000);

        $(".vids").show();
        $("#secvideo").hide();

        $("#introvideo").get(0).play();
        $("#introvideo").on("ended", function () {
          $("#secvideo").show();
          $("#introvideo").hide();
          $("#secvideo").get(0).play();
          setTimeout(function () {
            recognizeSpeech();
          }, 3000);
        });
      }, 4000);
    }, 5000);
  });
  // initCamera();
});

function recognizeSpeech() {
  recognition.start();
  recognition.onspeechend = function () {
    recognition.stop();
  };
  recognition.onerror = function () {
    alert("ERROR");
  };
  recognition.onresult = function (event) {
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;

    console.log(command);
  };
  recognition.onnomatch = function (event) {
    alert("I didnt recognize your speech");
  };
}

function initCamera() {
  var vid = document.getElementById("videoel");
  var overlay = document.getElementById("cam_overlay");
  var overlayCC = overlay.getContext("2d");

  var p = navigator.mediaDevices.getUserMedia({ video: true });

  p.then(function (mediaStream) {
    var video = document.querySelector("video");

    try {
      video.srcObject = mediaStream;
      console.log("video captured");
    } catch (error) {
      video.src = window.URL.createObjectURL(mediaStream);
    }
    video.onloadedmetadata = function (e) {};
  });
  p.catch(function (err) {
    console.log(err.name);
    $("#nomedia").show();
    annyang.abort();
  });

  var ctrack = new clm.tracker({ useWebGL: true });
  ctrack.init(pModel);
  var ec = new emotionClassifier();
  ec.init(emotionModel);
  var emotionData = ec.getBlank();

  startVideo();

  function startVideo() {
    vid.play();

    ctrack.start(vid);

    drawLoop();
  }

  function drawLoop() {
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, 400, 300);

    if (ctrack.getCurrentPosition()) {
      ctrack.draw(overlay);
    }
    var cp = ctrack.getCurrentParameters();

    var er = ec.meanPredict(cp);
    if (er) {
      updateData(er);
    }
  }

  var margin = { top: 20, right: 20, bottom: 10, left: 40 },
    width = 300 - margin.left - margin.right,
    height = 30 - margin.top - margin.bottom;

  var x = d3.scale
    .linear()
    .domain([0, ec.getEmotions().length])
    .range([margin.left, width + margin.left]);

  var y = d3.scale.linear().domain([0, 1]).range([0, height]);
  var count = 0;
  var svg = d3
    .select("#emotion_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  svg
    .selectAll("text.labels")
    .data(emotionData)
    .enter()
    .append("svg:text")
    .attr("x", function (datum, index) {
      count += 1;
      if (count == 3) {
        return 182;
      }
      if (count == 4) {
        count = 0;
        return 255;
      }
      return x(index) + 15;
    })
    .attr("y", 10)
    .attr("dx", -1)
    .attr("dy", "1.2em")
    .attr("id", function (datum, index) {
      return "weite" + x(index);
    })
    .attr("text-anchor", "middle")
    .text(function (datum) {
      return datum.value;
    })
    .attr("fill", "rgba(255, 3, 3, 0.89)")
    .attr("class", "labels");

  function updateData(data) {
    var texts = svg
      .selectAll("text.labels")
      .data(data)
      .text(function (datum) {
        if (datum.value > 0.8) {
          console.log(datum.emotion);
        }
        return datum.value.toFixed(1);
      });
  }

  setTimeout(function () {
    startVideo();
  }, 1000);
}

$("#reloader").click(function () {
  location.reload();
});

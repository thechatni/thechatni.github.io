var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = "#JSGF V1.0;";

var ready = 0;
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = "en-US";
recognition.interimResults = false;

ran1 = Math.floor(Math.random() * 3);
ran2 = Math.floor(Math.random() * 3);
ran3 = Math.floor(Math.random() * 3);
ran4 = Math.floor(Math.random() * 3);
ran5 = Math.floor(Math.random() * 3);

wrong = 0;
correct = 0;
// count = 0;
num = 0;
happy = 0;
surp = 0;
emotionCount = 0;
emotionLimit = 0;
vidStop = 0;
score = 0;

var vid = document.getElementById("videoel");
var overlay = document.getElementById("cam_overlay");
var overlayCC = overlay.getContext("2d");
var ctrack = new clm.tracker({ useWebGL: true });
var p;

first = {};
second = {};
third = {};
fourth = {};
fifth = {};

first[0] = {
  number: "1",
  ans: "I was leaving the shop",
};
first[1] = {
  number: "2",
  ans: "It was in a street",
};
first[2] = {
  number: "3",
  ans: "I hid",
};

second[0] = {
  number: "1",
  ans: "There were two people",
};
second[1] = {
  number: "2",
  ans: "They came on a bike",
};
second[2] = {
  number: "3",
  ans: "I don't think so",
};

third[0] = {
  number: "1",
  ans: "A couple of seconds",
};
third[1] = {
  number: "2",
  ans: "Casual clothes",
};
third[2] = {
  number: "3",
  ans: "I couldn't see their faces",
};

fourth[0] = {
  number: "1",
  ans: "No I was hiding",
};
fourth[1] = {
  number: "2",
  ans: "I think they were young",
};
fourth[2] = {
  number: "3",
  ans: "I think they were amateurs",
};

fifth[0] = {
  number: "1",
  ans: "He was young and wearing casual clothes",
};
fifth[1] = {
  number: "2",
  ans: "They got on their bikes and went away",
};
fifth[2] = {
  number: "3",
  ans: "I went and checked on the victim",
};

function getSimilarity(input, condition) {
  $.ajax({
    type: "POST",
    url: "/similarity/",
    dataType: "json",
    async: "true",
    data: {
      csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
      input: input,
      condition: condition,
    },
    success: showSimilarity,
  });
  // console.log("similarity");
}

function showSimilarity(json) {
  // count += 1;
  score = score + parseFloat(json.label);
  if (json.label < 0.55) {
    wrong += 1;
    console.log(json.label);
    console.log("wrong: " + wrong);
  } else {
    correct += 1;
    console.log(json.label);
    console.log("correct: " + correct);
  }
  // if (count == 5) {
  //   if (correct < 3) {
  //     console.log("GUILTY");
  //   } else {
  //     console.log("INNOCENT");
  //   }
  // }
}

function showVids() {
  $("#v1").html(
    '<source src="main/static/main/vids/one/' +
      first[ran1].number +
      '.mp4" type="video/mp4"></source>'
  );
  // speechRecognitionList();

  $("#v2").html(
    '<source src="main/static/main/vids/two/' +
      second[ran2].number +
      '.mp4" type="video/mp4"></source>'
  );
  // console.log(second[ran2].ans);
  $("#v3").html(
    '<source src="main/static/main/vids/three/' +
      third[ran3].number +
      '.mp4" type="video/mp4"></source>'
  );
  // console.log(third[ran3].ans);
  $("#v4").html(
    '<source src="main/static/main/vids/four/' +
      fourth[ran4].number +
      '.mp4" type="video/mp4"></source>'
  );
  // console.log(fourth[ran4].ans);
  $("#v5").html(
    '<source src="main/static/main/vids/five/' +
      fifth[ran5].number +
      '.mp4" type="video/mp4"></source>'
  );
  // console.log(fifth[ran5].ans);
  $("#innocent").html(
    '<source src="main/static/main/vids/innocent.mp4" type="video/mp4"></source>'
  );

  $("#guilty").html(
    '<source src="main/static/main/vids/guilty.mp4" type="video/mp4"></source>'
  );

  $("#v1").get(0).play();
  setTimeout(function () {
    console.log(first[ran1].ans);
    recognizeSpeech(first[ran1].ans);
  }, 2000);
  $("#v1").on("ended", function () {
    $("#v1").hide();
    $("#v2").show();
    $("#v2").get(0).play();
    setTimeout(function () {
      console.log(second[ran2].ans);
      recognizeSpeech(second[ran2].ans);
    }, 2000);
    $("#v2").on("ended", function () {
      $("#v2").hide();
      $("#v3").show();
      $("#v3").get(0).play();
      setTimeout(function () {
        console.log(third[ran3].ans);
        recognizeSpeech(third[ran3].ans);
      }, 2000);
      $("#v3").on("ended", function () {
        $("#v3").hide();
        $("#v4").show();
        $("#v4").get(0).play();
        setTimeout(function () {
          console.log(fourth[ran4].ans);
          recognizeSpeech(fourth[ran4].ans);
        }, 2000);
        $("#v4").on("ended", function () {
          $("#v4").hide();
          $("#v5").show();
          $("#v5").get(0).play();
          setTimeout(function () {
            console.log(fifth[ran5].ans);
            recognizeSpeech(fifth[ran5].ans);
          }, 2000);
          $("#v5").on("ended", function () {
            emotionLimit = emotionCount / 1500;
            // alert("FINIS");
            setTimeout(function () {
              $("#v5").hide();
              if (correct >= 3 && emotionLimit < 0.4) {
                $("#innocent").show();
                $("#innocent").get(0).play();
                $("#innocent").on("ended", function () {
                  addScore();
                });
              } else {
                $("#guilty").show();
                $("#guilty").get(0).play();
                $("#guilty").on("ended", function () {
                  addScore();
                });
              }
            }, 1500);
          });
        });
      });
    });
  });
}

var firebaseConfig = {
  apiKey: "AIzaSyAFi7t9Pz2-OAMS0fxsbbBRjiXLmJw-6iU",
  authDomain: "leaderboard-interrogate.firebaseapp.com",
  projectId: "leaderboard-interrogate",
  storageBucket: "leaderboard-interrogate.appspot.com",
  messagingSenderId: "1013047541462",
  appId: "1:1013047541462:web:81313a5cdc41e6f02f1377",
  measurementId: "G-3V1LCLQL8X",
};
firebase.initializeApp(firebaseConfig);

var srNo = 0;
function addToTable(name, points) {
  var tbody = document.getElementById("tbody1");
  var trow = document.createElement("tr");
  // var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  // td1.innerHTML = ++srNo;
  td2.innerHTML = name;
  td3.innerHTML = points;
  // trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  tbody.appendChild(trow);
}

function selectData() {
  firebase
    .database()
    .ref("player")
    .once("value", function (AllRecords) {
      AllRecords.forEach(function (CurrentRecord) {
        var name = CurrentRecord.val().Name;
        var points = CurrentRecord.val().Points;
        addToTable(name, points);
      });
    });
  showTable();
}

function addScore() {
  stopVideo();
  $("#live").hide();
  $("#dt").hide();
  $("#leaderboard").show();
  $("#sub").click(function () {
    var name = $("#name").val();
    num = Math.floor(Math.random() * 10000000);
    console.log(score);
    firebase
      .database()
      .ref("player/" + num)
      .set({
        Name: name,
        Points: parseInt(score * 20),
      });

    setTimeout(function () {
      selectData();
    }, 2000);
  });
}

function showTable() {
  $("#leaderboard").show();
  $("#user").hide();
  $("#live").hide();
  $(".videos").hide();

  setTimeout(function () {
    $("#dt").DataTable({
      pagingType: "simple",
      searching: false,
      // info: false,
      lengthChange: false,
      pageLength: 5,
      // sorting: false,
      order: [[1, "desc"]],
    });
  }, 2000);
  setTimeout(function () {
    $("#dt").show();
  }, 1000);

  // $(".dataTables_length").addClass("bs-select");
}

$(document).ready(function () {
  $("#nopermission").hide();
  $("#live").hide();
  $(".videos").hide();
  $("#intro").hide();
  $(".line-2").hide();
  $(".line-3").hide();
  $("#v2").hide();
  $("#v3").hide();
  $("#v4").hide();
  $("#v5").hide();
  $("#innocent").hide();
  $("#guilty").hide();
  $("#leaderboard").hide();

  $("#begin").on("click", function () {
    $("#wrap").hide();
    // showTable();
    selectData();

    // $("#wrap").hide();
    // $("#intro").show();
    // setTimeout(function () {
    //   $(".line-1").hide();
    //   $(".line-2").show();

    //   setTimeout(function () {
    //     testMic();
    //   }, 2500);
    // }, 4000);
  });
});

function recognizeSpeech(condition) {
  recognition.start();

  recognition.onspeechend = function () {
    recognition.stop();
    ready = 1;
  };

  recognition.onerror = function () {
    console.log("ERROR");
    ready = 0;
    // permissionDenied();
  };
  recognition.onresult = function (event) {
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;

    console.log(command);
    getSimilarity(command, condition);
  };
  recognition.onnomatch = function (event) {
    console.log("I didnt recognize your speech");
  };
  setTimeout(function () {
    recognition.stop();
  }, 7000);
}

function testMic() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      $(".line-2").hide();
      $(".line-3").show();
      ready = 1;
      setTimeout(function () {
        initCamera();
      }, 2500);
    })
    .catch(function (err) {
      permissionDenied();
    });
}

function permissionDenied() {
  $("#live").hide();
  $("#wrap").hide();
  $(".videos").hide();
  $("#intro").hide();
  $("#nopermission").show();
}

function stopVideo() {
  p.then(function (mediaStream) {
    mediaStream.getTracks().forEach(function (track) {
      track.stop();
    });
  });
  // vidStop = 1;
  vid.pause();

  ctrack.stop(vid);

  // drawLoop();
}

function initCamera() {
  // var vid = document.getElementById("videoel");
  // var overlay = document.getElementById("cam_overlay");

  // var overlayCC = overlay.getContext("2d");
  p = navigator.mediaDevices.getUserMedia({ video: true });
  p.then(function (mediaStream) {
    var video = document.querySelector("video");
    // if (vidStop == 1) {
    //   mediaStream.getTracks().forEach(function (track) {
    //     track.stop();
    //   });
    // }
    try {
      video.srcObject = mediaStream;
      console.log("video captured");
      // getSimilarity();
      // if (flag == 1) {
      //   permissionDenied();
      // } else {
      if (ready == 1) {
        $("#intro").fadeOut(1000);
        $("#live").fadeIn(1000);
        // $("#live").show();
        // $(".videos").show();
        $(".videos").fadeIn(1000);
        setTimeout(function () {
          showVids();
          // $("#secvideo").hide();

          // $("#introvideo").get(0).play();
          // $("#introvideo").on("ended", function () {
          //   $("#secvideo").show();
          //   $("#introvideo").hide();
          //   $("#secvideo").get(0).play();
          //   setTimeout(function () {
          //     recognizeSpeech();
          //     // testMic();
          //     // getSimilarity();
          //   }, 3000);
          // });
        }, 1000);
      }
    } catch (error) {
      video.src = window.URL.createObjectURL(mediaStream);
      console.log(error);
      permissionDenied();
    }
    video.onloadedmetadata = function (e) {};
  });
  p.catch(function (err) {
    console.log(err.name);
    permissionDenied();
    // $("#nomedia").show();
    // annyang.abort();
  });

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
          if (datum.emotion == "happy") {
            emotionCount += 1;
            console.log("Count: " + emotionCount);
          }
          if (datum.emotion == "surprised") {
            emotionCount += 1;
            console.log("Count: " + emotionCount);
          }
          // console.log(datum.emotion);
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

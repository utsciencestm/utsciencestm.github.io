// MUST READ
// https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/
var data;
var entry;
var offset=1;

$(document).ready(function() {
  // if (isSignedIn) {
  //   listNames();
  //  }
  loadData();
});

var meeting_col = 1;

function whois(role) {
  role = role.trim();
  // problemetic if there are empty cells
  // for (let i = 0; i < entry.length; i++) {
  //   if(entry[i].content.$t.includes(role)) {
  //   return  entry[i+offset].content.$t;
  //   }
  // }
  var i;
  for (i = 0; i < entry.length; i++) {
    if(entry[i].content.$t.includes(role)) {
      break;
    }
  }
  if (i == entry.length) {return 'ERROR'}
  let row = entry[i].gs$cell.row;
  for (let j = 1; entry[i+j].gs$cell.row == row; j++) {
    if(entry[i+j].gs$cell.col == meeting_col) {
        return  entry[i+j].content.$t;
    }
  }
  return 'TBA';
}

function getData(row, col) {
  row = '' + row // to string
  col = '' + col
  for (let i = 0; i < entry.length; i++) {
    if(entry[i].gs$cell.row == row && entry[i].gs$cell.col == col) {
      return  entry[i].content.$t;
    }
  }
}


// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function loadData() {
  // compute offset if meeting id is none
  // 36

  // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
  var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
  jQuery.getJSON(url, function (json) {
    console.log(json);
    data = json;
    entry = data.feed.entry;
    // console.log(whois('Date'));
    // var meetingNo = '' +
    if (getUrlVars()["number"] == undefined) {
      var today = new Date();
      // show the coming meeting (or current meeting)
      for (let i = 0; i < entry.length; i++) {
        if(entry[i].content.$t.trim() == 'Date') {
          for (let j = 1; j < 10; j++) {
            let date = new Date(entry[i+j].content.$t.trim())
            if(today.getMonth() === date.getMonth() && today.getDate() <= date.getDate()) {
                offset = j;
                meeting_col = entry[i+j].gs$cell.col;
                break;
            }
          }
        }
      }
    } else {
      number = getUrlVars()["number"].trim()
      for (let i = 0; i < entry.length; i++) {
        if(entry[i].content.$t.includes('Meeting #')) {
          for (let j = 1; j < 10; j++) {
            if(entry[i+j].content.$t.trim() == number) {
                offset = j;
                meeting_col = entry[i+j].gs$cell.col;
                break;
            }
          }
        }
      }
    }

    // problem: if is empty, will go to next

    $('#whatIsDate').html(whois('Date'));
    $('#meetingNo').html(whois('Meeting #'));
    $('#whoIsToastmaster').html(whois('Toastmaster'));
    $('#whichRoom').html(whois('Room'));
    $('#whoIsAhCounter').html(whois('Ah Counter'));
    $('#whoIsGrammarian').html(whois('Grammarian')); // not Grammerian's word of the day, match the first one
    $('#whoIsTimeKeeper').html(whois('Time Keeper'));
    $('#whoIsSpeaker1').html(whois('Speaker # 1'));
    $('#whoIsSpeaker2').html(whois('Speaker # 2'));
    $('#whoIsSpeaker3').html(whois('Speaker # 3'));
    $('#whoIsGeneralEvaluator').html(whois('General Evaluator'));
    $('#whoIsTableTopicsEvaluator').html(whois('TableTopics Evaluator'));
    $('#whoIsEvaluator1').html(whois('Evaluator # 1'));
    $('#whoIsEvaluator2').html(whois('Evaluator # 2'));
    $('#whoIsEvaluator3').html(whois('Evaluator # 3'));
    $('#whoIsTopicsMaster').html(whois('Topics Master'));
    $('#whatWordOfTheDay').html(whois('Word of the Day'));
    $('#whatTheme').html(whois('Theme'));
    $('#whatSpeech1').html(whois('#1 Manual,'));
    $('#whatSpeech2').html(whois('#2 Manual,'));
    $('#whatSpeech3').html(whois('#3 Manual,'));
    $('#announcement').html(whois('annoucement'));
  });

  // <I>
  // </I></FONT></FONT><FONT FACE="Arial, serif"><FONT SIZE=1 STYLE="font-size: 8pt">disillusioned
  // </FONT></FONT><FONT FACE="Arial, serif"><FONT SIZE=1 STYLE="font-size: 8pt"><I>adj.</I></FONT></FONT></P>
  // <P ><FONT FACE="Arial, serif"><FONT SIZE=1 STYLE="font-size: 8pt">


// CORS problem, blocked
// xmlhttp=new XMLHttpRequest();
// xmlhttp.onreadystatechange = function() {
//   if(xmlhttp.readyState == 4 && xmlhttp.status==200){
//     document.getElementById("display").innerHTML = xmlhttp.responseText;
//   }
// };
// xmlhttp.open("GET",url,true);
// xmlhttp.send(null);
}
  // $.ajax("https://docs.google.com/spreadsheet/pub?key=0Auwt3KepmdoudE1iZFVFYmlQclcxbW85YzNZSTYyUHc&single=true&gid=0&range=b5&output=csv").done(function(result){
  //     alert(result);
  // });

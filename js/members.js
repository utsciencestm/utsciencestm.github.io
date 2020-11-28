// MUST READ
// https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/

$(document).ready(function() {
  // if (isSignedIn) {
  //   listNames();
  //  }
  loadMembers();
});

const getFirstWord = string => {
    const words = string.split(' ');
    return words[0];
};

// list members
// find the cell and then get all following rows with col=0 and col1 

function listMembers(data, entry) {
  text = 'Total Points'
  var i;
  for (i = 0; i < entry.length; i++) {
    if(entry[i].content.$t.includes(text)) {
      break;
    }
  }
  console.log('row: ' + i + '-content:' + entry[i].content.$t)

  if (i == entry.length) {return 'ERROR'}
  let row = entry[i].gs$cell.row;
  
  // TODO: compute how many columns might be more efficient
  var members = {};
  for (let j = 1; entry[i+j]; j++) {
    if(entry[i+j].gs$cell.col == 1) {
    	name = entry[i+j].content.$t;
    	points = entry[i+j+1].content.$t;
    	if(name == ''){
    		break;
    	}
        members[getFirstWord(name)] = Number(points);
        j ++;
        // console.log(name + ':' + points);
    }
  }
  
  return members;
}




 

// function getData(row, col) {
//   row = '' + row // to string
//   col = '' + col
//   for (let i = 0; i < entry.length; i++) {
//     if(entry[i].gs$cell.row == row && entry[i].gs$cell.col == col) {
//       return  entry[i].content.$t;
//     }
//   }
// }



function loadMembers() {
  // compute offset if meeting id is none
  // 36
  // simply use the google sheet id in address bar 

  // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
  // var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
  var url="https://spreadsheets.google.com/feeds/cells/1E9VdBM1YSS0ykQG-U8yAopu8a2c9_G9U66DG_pmBmw4/1/public/full?alt=json";

  // https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Viig2-DlkSkufg6xBK6IdVRFJR2pwkUmq0NzyfOIAi3cCdCkGuf8ZARUa3HoF2Il17WKvOA7pomh/pubhtml
  jQuery.getJSON(url, function (json) {
    console.log(json);
    data = json;
    entry = data.feed.entry;
    members = listMembers(data, entry)
    active_members = Object.keys(members).filter(key => members[key] >= 10);
    
    n_members = Object.keys(members).length
    n_active_members = Object.keys(active_members).length
    console.log(n_members + ' members: ' + members);
    console.log(n_active_members + ' active members: ' + active_members);
    return 
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
    // highlight roles that have not been assigned 
    // add presiding officer

    // $('#whatIsDate').html(whois('Date'));
    // $('#meetingNo').html(whois('Meeting #'));
    // $('#whoIsToastmaster').html(whois('Toastmaster'));
    // $('#whichRoom').html(whois('Room'));
    // $('#whoIsAhCounter').html(whois('Ah Counter'));
    // $('#whoIsGrammarian').html(whois('Grammarian')); // not Grammerian's word of the day, match the first one
    // $('#whoIsTimeKeeper').html(whois('Time Keeper'));
    // $('#whoIsVoteCounter').html(whois('Vote Counter'));
    // $('#whoIsSpeaker1').html(whois('Speaker # 1'));
    // $('#whoIsSpeaker2').html(whois('Speaker # 2'));
    // $('#whoIsSpeaker3').html(whois('Speaker # 3'));
    // $('#whoIsGeneralEvaluator').html(whois('General Evaluator'));
    // $('#whoIsTableTopicsEvaluator').html(whois('TableTopics Evaluator'));
    // $('#whoIsEvaluator1').html(whois('Evaluator # 1'));
    // $('#whoIsEvaluator2').html(whois('Evaluator # 2'));
    // $('#whoIsEvaluator3').html(whois('Evaluator # 3'));
    // $('#whoIsTopicsMaster').html(whois('Topics Master'));
    // $('#whatWordOfTheDay').html(whois('Word of the Day'));
    // $('#whatTheme').html(whois('Theme'));
    // $('#whatSpeech1').html(whois('#1 Manual,'));
    // $('#whatSpeech2').html(whois('#2 Manual,'));
    // $('#whatSpeech3').html(whois('#3 Manual,'));
    // $('#announcement').html(whois('annoucement'));
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

// MUST READ
// https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/
var data;
var entry;
var offset=1;
const on_members_loaded = new Event('memberListLoaded');
const on_roles_loaded = new Event('signUpSheetLoaded');
var meeting_col = 1;
var unavailable_members;
var active_members;
var assigned_members = [];
var available_active_members;


$(document).ready(function() {
  // if (isSignedIn) {
  //   listNames();
  //  }
  // loadData();

  // wait for all sheets are loaded 
  var members_loaded = new Promise(function(resolve) {
      document.addEventListener("memberListLoaded",resolve,false);
  })
  var roles_loaded = new Promise(function(resolve) {
      document.addEventListener("signUpSheetLoaded", resolve, false);
  })

  // dispatch the event
  // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
  var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
  jQuery.getJSON(url, function (json) {
    console.log(json);
    data = json;
    entry = data.feed.entry;
    meeting_col = getMeetingCol(entry);
    document.dispatchEvent(on_roles_loaded);
  });

  var url="https://spreadsheets.google.com/feeds/cells/1E9VdBM1YSS0ykQG-U8yAopu8a2c9_G9U66DG_pmBmw4/1/public/full?alt=json";
  // https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Viig2-DlkSkufg6xBK6IdVRFJR2pwkUmq0NzyfOIAi3cCdCkGuf8ZARUa3HoF2Il17WKvOA7pomh/pubhtml
  jQuery.getJSON(url, function (json) {
    console.log(json);
    members = listMembers(json, json.feed.entry)
    active_members = Object.keys(members).filter(key => members[key] >= 10);
    
    n_members = Object.keys(members).length
    n_active_members = Object.keys(active_members).length
    console.log(n_members + ' members: ' + members);
    console.log(n_active_members + ' active members: ' + active_members);
    document.dispatchEvent(on_members_loaded);
  });

  Promise.all([members_loaded, roles_loaded]).then(function() {
      //both are ready

      // after getting meeting col

    // get a fixed list of people and shuffle it
    
    seed = Number(whois('Meeting #'));
    console.log('seed:', seed);
    shuffle(active_members, seed);
    unavailable_members = getUnavailableMembers(data, entry);
    console.log('Unavailable: ' + unavailable_members);


    // get assigned people 
    fillInForm();

    // problem: if is empty, will go to next
    // highlight roles that have not been assigned 
    // add presiding officer

  });

} );

function fillInRole(role, element) {
    let who = whois(role);
    console.log(element + ':' + who);
    $(element).html(who);
    assigned_members.push(getFirstWord(who))
}

function fillInInfo(role, element) {
    let who = whois(role);
    console.log(element + ':' + who);
    $(element).html(who);
}

function fillInSuggestion(element) {
    if ($(element).text() == 'TBA') {
      let who = available_active_members.shift()
      $(element).html(who+'?');
    }
}

function fillInForm() {
  var info = {
  "#whatIsDate": "Date",
  "#meetingNo": "Meeting #",
  "#whoIsPresidingOfficer": "Presiding Officer",
  "#whichRoom": "Room",
  "#whatTheme": "Theme",
  "#whatWordOfTheDay": "Word of the Day",
  "#whatSpeech1": "#1 Manual,",
  "#whatSpeech2": "#2 Manual,",
  "#whatSpeech3": "#3 Manual,",
  "#announcement": "annoucement",
  }
  var roles = {
  "#whoIsToastmaster": "Toastmaster",
  "#whoIsAhCounter": "Ah Counter",
  "#whoIsGrammarian": "Grammarian",
  "#whoIsTimeKeeper": "Time Keeper",
  "#whoIsVoteCounter": "Vote Counter",
  "#whoIsSpeaker1": "Speaker # 1",
  "#whoIsSpeaker2": "Speaker # 2",
  "#whoIsSpeaker3": "Speaker # 3",
  "#whoIsGeneralEvaluator": "General Evaluator",
  "#whoIsTableTopicsEvaluator": "TableTopics Evaluator",
  "#whoIsEvaluator1": "Evaluator # 1",
  "#whoIsEvaluator2": "Evaluator # 2",
  "#whoIsEvaluator3": "Evaluator # 3",
  "#whoIsTopicsMaster": "Topics Master",
  };

  for(var element in info) {
    fillInInfo(info[element], element);
  }
  for(var element in roles) {
    var role = roles[element];
    fillInRole(role, element);
  }

  console.log('Assigned: ' + assigned_members);
  // add those who already assigned 

  available_active_members = $.grep(active_members, function(el){return $.inArray(el, unavailable_members) == -1 &&  ($.inArray(el, assigned_members) == -1) }); 
  console.log('To be assigned: ' + available_active_members);


  for(var element in roles) {
    var role = roles[element];
    fillInSuggestion(element);
  }
}

function getMeetingCol(entry) {
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
                console.log('offset: ' + offset + ', meeting_col:' + meeting_col)
                break;
            } 
            // next month 
            else if(today.getMonth() < date.getMonth() ) {
                offset = j;
                meeting_col = entry[i+j].gs$cell.col;
                console.log('offset: ' + offset + ', meeting_col:' + meeting_col)
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
    return meeting_col;
}




function getUnavailableMembers(data, entry) {
  text = 'Unavailable'
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
  let members = [];
  for (let j = 1; entry[i+j]; j++) {
    if(entry[i+j].gs$cell.col == meeting_col) {
      name = entry[i+j].content.$t;
      if(name == ''){
        break;
      }
      members.push(getFirstWord(name));
    }
  }
  return members;
}

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
      let val = entry[i+j].content.$t;
        return  val;
    }
  }
  // give suggestions instead of returning TBA
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

////////////////////////////////////////////////////////////////////////////

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

  // compute offset if meeting id is none
  // 36
  // simply use the google sheet id in address bar 

  // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
  // var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
  




  // compute offset if meeting id is none
  // 36



    



    


    // automatically assign people roles
    // shuffle the list according to the number of meetting - fixed for each meeting
    // ask people to put their names under unavailable if so
    // remove those who are not available and those already got roles, get available people list
    // for each empty spot, pop one person from the list. (so once you got picked, unless you are not available, that's the arrangment)
    // Adi puts in the name of the suggestion if they agree with that.
    // if not, select other roles (ask to switch with other people)

    // todo: add a next meeting link 

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
  // $.ajax("https://docs.google.com/spreadsheet/pub?key=0Auwt3KepmdoudE1iZFVFYmlQclcxbW85YzNZSTYyUHc&single=true&gid=0&range=b5&output=csv").done(function(result){
  //     alert(result);
  // });

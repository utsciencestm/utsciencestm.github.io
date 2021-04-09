// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
const getFirstWord = string => {
    const words = string.split(' ');
    return words[0];
};
var INFO = {
"#whatIsDate": "Date",
"#meetingNo": "Meeting #",
"#whoIsPresidingOfficer": "Presiding Officer",
"#whichRoom": "Room",
"#whatTheme": "Theme",
"#whatWordOfTheDay": "Grammarian's Word of the Day",
"#whatSpeech1": "#1 Manual, Project, Speech Title and Duration",
"#whatSpeech2": "#2 Manual, Project, Speech Title and Duration",
"#whatSpeech3": "#3 Manual, Project, Speech Title and Duration",
// "#announcement": "annoucement",
}
var ROLES = {
"#whoIsAhCounter": "Ah Counter.     (2 mins) ",
"#whoIsToastmaster": "Toastmaster",
"#whoIsGrammarian": "Grammarian     (2 mins)",
"#whoIsTimeKeeper": "Time Keeper",
"#whoIsVoteCounter": "Vote Counter",
"#whoIsSpeaker1": "Speaker # 1",
"#whoIsSpeaker2": "Speaker # 2",
"#whoIsSpeaker3": "Speaker # 3",
"#whoIsGeneralEvaluator": "General Evaluator",
"#whoIsTableTopicsEvaluator": "TableTopics Evaluator (2-3 mins)",
"#whoIsEvaluator1": "Evaluator # 1 (2-3 mins)",
"#whoIsEvaluator2": "Evaluator # 2 (2-3 mins)",
"#whoIsEvaluator3": "Evaluator # 3 (2-3 mins)",
"#whoIsTopicsMaster": "Topics Master",
};

class ToastiesSheet {
  constructor() {
    console.log('---' + this.constructor.name);
  }
  loadJson(json) {
    // https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Viig2-DlkSkufg6xBK6IdVRFJR2pwkUmq0NzyfOIAi3cCdCkGuf8ZARUa3HoF2Il17WKvOA7pomh/pubhtml
    // console.log('---' + this.constructor.name);
    console.log(json);
    this.data = json;
    console.log(this.data);
    console.log('---' + this.constructor.name);
    let members = this.listMembers();
    let active_members = Object.keys(members).filter(key => members[key] >= 10);
    let n_members = Object.keys(members).length
    let n_active_members = Object.keys(active_members).length
    console.log(n_members + ' members: ' + members);
    console.log(n_active_members + ' active members: ' + active_members);
    document.dispatchEvent(new Event('memberListLoaded'));
  }
  // list members
  // find the cell and then get all following rows with col=0 and col1
  listMembers() {
    let data = this.data;
    let entry = this.data.feed.entry;
    console.log('locating cell with the content being Total Points')
    let text = 'Total Points'
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
        name = entry[i+j+1].content.$t; // column 'abbr'
        let points = entry[i+j+2].content.$t; // column 'scores'
        if(name == ''){
          break;
        }
        console.log(name + ':' + points);
        members[getFirstWord(name)] = Number(points);
        j ++;
      }
    }
    return members;
  }
}


class SignupSheet {
  constructor() {

  }
  loadJson(json) {
    // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
    // var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
    console.log(json);
    this.data = json;
    this.entry = json.feed.entry;
    // meeting_col = this.meetingCol();
    document.dispatchEvent(new Event('signUpSheetLoaded'));
    this._meetingCol = null;
    this.assignedMembers = [];
  }
  get meetingCol() { // cached
    if (this._meetingCol == null) {
      // console.log(whois('Date'));
      // var meetingNo = '' +
      // let j = 1;
      // let i = 0;
      var j = 1;
      var i = 0;
      var offset=1;

      let entry = this.entry;
      if (getUrlVars()["number"] == undefined) {
        var today = new Date();
        // show the coming meeting (or current meeting)

        for (;i < entry.length; i++) {
          if(entry[i].content.$t.trim() == 'Date') {
            for (;j < 10; j++) {
              let date = new Date(entry[i+j].content.$t.trim())
              if( today.getFullYear() === date.getFullYear() ) {
                if (today.getMonth() === date.getMonth() && today.getDate() <= date.getDate()) {
                  break;
                } // next month
                else if (today.getMonth() < date.getMonth() ) {
                    break;
                }
              }  // next year
              else if( today.getFullYear() < date.getFullYear()) {
                  break;
              }
            }
            break;
          }
        }

      } else {
        let number = getUrlVars()["number"].trim()
        for (i = 0; i < entry.length; i++) {
          if(entry[i].content.$t.includes('Meeting #')) {
            for (j = 1; j < 10; j++) {
              if(entry[i+j].content.$t.trim() == number) {
                  break;
              }
            }
            break;
          }
        }
      }
      offset = j;
      this._meetingCol = entry[i+j].gs$cell.col;
      console.log('offset: ' + offset + ', meeting_col:' + this._meetingCol)
    }
    return this._meetingCol;
  }
  // move the tab to the second
  nextMeeting() { // error if in another tab
    // var meeting_no = Number($('#meetingNo').text()) - 1;
    let entry = this.entry;
    var i = this.cellIndex('Meeting #');
    if (i == entry.length) {return 'ERROR'}
    if(entry[i+1].gs$cell.row == entry[i].gs$cell.row ) {
      let meeting_no = Number(entry[i+1].content.$t)
      location.href = window.location.origin + '/agenda.html?number='+meeting_no;
      console.log(location.href)
    } else {
      alert('Not found! Create a new tab and put it as the second tab in the sign up sheet.')
    }
    return false
  }
  prevMeeting() {
    let entry = this.entry;
    var i = this.cellIndex('Meeting #');
    if (i == entry.length) {return 'ERROR'}
    if(entry[i-1].gs$cell.col > 1) {
      let meeting_no = Number(entry[i-1].content.$t);
      location.href = window.location.origin + '/agenda.html?number='+meeting_no;
      console.log(location.href)
    } else {
      alert('The last meeting has been archived.');
    }
    return false
  }
  cellIndex(role, strict=true) {
    let entry = this.entry;
    let meeting_col = this.meetingCol;
    role = role.trim();
    let i = this.whereis(role, strict); // index
    let row = entry[i].gs$cell.row;
    for (let j = 1; entry[i+j].gs$cell.row == row; j++) {
      if(entry[i+j].gs$cell.col == meeting_col) {
        return i+j;
      }
    }
    return -1
  }
  // locate the cell
  whereis(text, strict=true) {
    let entry = this.entry;
    text = text.trim();
    // problemetic if there are empty cells
    // for (let i = 0; i < entry.length; i++) {
    //   if(entry[i].content.$t.includes(role)) {
    //   return  entry[i+offset].content.$t;
    //   }
    // }
    var i;
    for (i = 0; i < entry.length; i++) {
      if(strict && entry[i].content.$t.trim() == text) {
        break;
      }
      if( !strict && entry[i].content.$t.includes(text)) {
        break;
      }
      // console.log(entry[i].content.$t.trim())
    }
    if (i == entry.length) {return -1}
    return i;
  }
  whois(role, strict=true) {
    let entry = this.entry;
    var idx = this.cellIndex(role, strict);
    if (idx == -1) {return 'TBA'; }
    else {return entry[idx].content.$t;}
  }
  // not used?
  getData(row, col) {
    let entry = this.entry;
    row = '' + row // to string
    col = '' + col
    for (let i = 0; i < entry.length; i++) {
      if(entry[i].gs$cell.row == row && entry[i].gs$cell.col == col) {
        return  entry[i].content.$t;
      }
    }
  }
  get unavailableMembers() {
    console.log('getting unavailable members..')
    let entry = this.entry;
    let data = this.data;
    let meeting_col = this.meetingCol;
    let i = this.whereis('Unavailable');
    let row = entry[i].gs$cell.row;
    // TODO: compute how many columns might be more efficient
    let members = [];
    for (let j = 1; entry[i+j]; j++) {
      if(entry[i+j].gs$cell.col == meeting_col) {
        let name = entry[i+j].content.$t;
        if(name == ''){
          break;
        }
        members.push(getFirstWord(name));
      }
    }
    console.log('unavailable members: ' + members)
    return members;
  }
  get availableActiveMembers() {
    return $.grep(active_members, function(el){
      return $.inArray(el, unavailable_members) == -1 &&  ($.inArray(el, assigned_members) == -1)
    });
  }
  fillInRole(role, element) {
      let who = this.whois(role);
      console.log(element + ':' + who);
      $(element).html(who);
      this.assignedMembers.push(getFirstWord(who))
  }
  fillInInfo(role, element) {
      let who = this.whois(role);
      console.log(element + ':' + who);
      $(element).html(who);
  }
  fillInSuggestion(element) {
    console.log('To be assigned: ' + available_active_members);
      if ($(element).text() == 'TBA') {
        let who = available_active_members.shift()
        $(element).html(who+'?');
      }
  }
  fillInForm() {
    for(var element in INFO) {
      this.fillInInfo(INFO[element], element);
    }
    for(var element in ROLES) {
      var role = ROLES[element];
      this.fillInRole(role, element);
    }

    console.log('Assigned: ' + this.assignedMembers);
    // add those who already assigned

    // disable speech role suggestion, don't show it if there are no speaker
    if ($('#whoIsSpeaker1').text() == 'TBA') {
      $('#whoIsSpeaker1').html('&nbsp;')
      $('#whatSpeech1').html('&nbsp;')
      $('#whoIsEvaluator1').html('&nbsp;')
      $('#eval1').html('&nbsp;')
    }
    if ($('#whoIsSpeaker2').text() == 'TBA') {
      $('#whoIsSpeaker2').html('&nbsp;')
      $('#whatSpeech2').html('&nbsp;')
      $('#whoIsEvaluator2').html('&nbsp;')
      $('#eval2').html('&nbsp;')
    }
    if ($('#whoIsSpeaker3').text() == 'TBA') {
      $('#whoIsSpeaker3').html('&nbsp;')
      $('#whatSpeech3').html('&nbsp;')
      $('#whoIsEvaluator3').html('&nbsp;')
      $('#eval3').html('&nbsp;')
    }
    //////// disable fillInSuggestion for now (add a switch to control showing it)
    // for(var element in roles) {
    //   var role = roles[element];
    //   fillInSuggestion(element);
    // }
  }
  computeMeetingScores() {

  }
}

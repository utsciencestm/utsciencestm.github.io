// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
const getFirstWord = string => {
    const words = string.trim().split(' ');
    return words[0];
    // .toUpperCase();
    // return words[0].toUpperCase();
};
var INFO = {
"#whatIsDate": "Date",
"#meetingNo": "Meeting #",
"#whichRoom": "Room",
"#whatTheme": "Theme",
"#whatWordOfTheDay": "Grammarian's Word of the Day",
"#whatSpeech1": "#1 Manual, Project, Speech Title and Duration",
"#whatSpeech2": "#2 Manual, Project, Speech Title and Duration",
"#whatSpeech3": "#3 Manual, Project, Speech Title and Duration",
// "#announcement": "annoucement",
}
var ROLES = {
"#whoIsPresidingOfficer": "Presiding Officer", // 
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
var SCORES = {
"Participants": 1, // don't include those who has roles
"Social Participants": 1,
"Early TM sign-up": 1,
"Speaker # 1": 2+1,
"Speaker # 2": 2+1,
"Speaker # 3": 2+1,
"Evaluator # 1 (2-3 mins)": 1+1,
"Evaluator # 2 (2-3 mins)": 1+1,
"Evaluator # 3 (2-3 mins)": 1+1,
"TableTopics Evaluator (2-3 mins)": 2+1,
"General Evaluator": 1+1,
"Topics Master": 1+1,
"Toastmaster": 1+1,
"Best Speaker": 3,
"Best Table Topics": 2,
"Best Evaluator": 2,
"Traveling Award": 2,
"Member Sign-up": 4,
};
// removed table topic speakers. no need to track

class SheetV4 {
  constructor(spreadsheetId, sheetname=null) {
    var json;
    console.log('---' + this.constructor.name);
    var url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;
    if (sheetname != null) {
      url += '&sheet=' + sheetname
    }
    fetch(url)
        .then(res => res.text())
        .then(text => {
            this.table = JSON.parse(text.substr(47).slice(0, -2)).table
            document.dispatchEvent(new Event('loaded_'+this.constructor.name));
    })
    console.log('done')
  }
  getColumn(col) { // return a dict: key: row title, value: column value
    // if row title is duplicated, values will be joined with ','
    var d_roles = {};
    this.table.rows.forEach(row => {
      let cell = row['c'][0];
      if (cell != null) {
        var key = cell.v
        var val = row['c'][col];
        if (val != null) {val = val.v}
        if (key in d_roles) {
          d_roles[key] +=  ',' + val;
        } else {
          d_roles[key] =  val;
        }

      }
    })
    console.log(d_roles)
    return d_roles
  }
  getData(d, key) {
    return (key in d) ? d[key] : null;
  }
}

class ToastiesSheet extends SheetV4{
  loadJson(json) {
    // https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3Viig2-DlkSkufg6xBK6IdVRFJR2pwkUmq0NzyfOIAi3cCdCkGuf8ZARUa3HoF2Il17WKvOA7pomh/pubhtml
    // console.log('---' + this.constructor.name);
    console.log(json);
    this.data = json;
    console.log(this.data);
    console.log('---' + this.constructor.name);
    this.members = this.listMembers();
    // let active_members = Object.keys(this.members).filter(key => this.members[key] >= 10);
    // let n_members = Object.keys(this.members).length
    // let n_active_members = Object.keys(active_members).length
    // console.log(n_members + ' members: ' + this.members);
    // console.log(n_active_members + ' active members: ' + active_members);
    //
  }
  // list members
  // find the cell and then get all following rows with col=0 and col1
  listMembers() {
    // member and toastie scores...
    // nick name --> full name and scores dictonary
    var members = {};
    this.table.rows.forEach(row => {
      if (row['c'] != null) {
        members[getFirstWord(row['c'][1]['v'])] = {
          'full_name': row['c'][0]['v'],
          'point': Number(row['c'][2]['v'])
        }
      }
    })
    return members;
  }
}


class SignupSheet extends SheetV4{
  loadJson(json) {
    // var url="https://docs.google.com/spreadsheet/pub?key=p_aHW5nOrj0VO2ZHTRRtqTQ&single=true&gid=0&range=A1&output=csv";
    // var url="https://spreadsheets.google.com/feeds/cells/17Vtxbeh7Q6-ic89sWC8_U8RUoUAr6dlvi3jxADRMNQU/2/public/full?alt=json";
    console.log(json);
    this.data = json;
    this.entry = json.feed.entry;
  }
  getMeetingCol() {
    var date_row = this.table.rows[0].c;
    var today = new Date();
    var index, cell;
    for ([index, cell] of date_row.entries()) {
      let date = new Date(cell.v.trim());
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
    var meeting_col = index;
    console.log(`meeting_col: ${meeting_col}`)
    return meeting_col;
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
    var result = this.getData(this.roles, text);
    console.log(text)
    console.log(result)
    return (result == null)? 'TBA' : result;
  }
  whois(role, strict=true) {
    var result = this.getData(this.roles, role);
    //get full name if possible
    if(result in this.members) {result = this.members[result]['full_name']}
    return (result == null)? 'TBA' : result;
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
      let who = this.whereis(role);
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
    Object.entries(INFO).forEach(e => this.fillInInfo(e[1], e[0]))
    this.assignedMembers = [];
    Object.entries(ROLES).forEach(e => this.fillInRole(e[1], e[0]))
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
  computeMeetingScores(members) {
    var short_names = Object.keys(members);
    var meeting_points = {...members};
    for(let name in meeting_points) {
      meeting_points[name] = 0; // init as zero
    }
    for(var item in SCORES) {
      var point = SCORES[item];
      // Participants
      // signupSheet.whois('Participants').trim().split(',');
      var s = this.whois(item).trim();
      if (s == 'TBA') {
        continue;
      }
      s.split(',').forEach(function (name, index, array){
        name = getFirstWord(name);
        let r = short_names.indexOf(name);
        if (r == -1) {
          return '[' + item + ']:' + name + ' is not a member.(Check spelling?) ';
        }
        meeting_points[name] += point;
        console.log(`add ${point} to ${name} for ${item}`)
      });
    }
    return Object.values(meeting_points).join('\n');
  }
}

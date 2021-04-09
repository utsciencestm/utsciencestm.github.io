// load member list from the toastiesaward page
const on_members_loaded = new Event('memberListLoaded');
// const on_roles_loaded = new Event('signUpSheetLoaded');

const getFirstWord = string => {
    const words = string.split(' ');
    return words[0];
};
function listMembers(data, entry) {
  console.log('locating cell with the content being Total Points')
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
      name = entry[i+j+1].content.$t; // column 'abbr'
      points = entry[i+j+2].content.$t; // column 'scores'
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

function loadMembers() {
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
}

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

  loadMembers();
});
function updateText() {
  addPeopleAbove();
  let s = "";
  // let s = $('#bestSpeaker').val();
  // s += '\n' + $('#toastmaster').val() + '\t';
  // s += '\n' + $('#topicsmaster').val() + '\t';
  // s += '\n' + $('#participants').val() + '\t';
  // s += '\n' + $('#bestEvaluator').val() +'\t';
  // s += '\n' + $('#travelingAward').val() +'\t';
  $('form select').each(function() {console.log($(this).val());
    s += $(this).val() +'\t\n';
  } )

  s += 'Meeting Points\tReason';

  $("select#names option").each(function(){
    // console.log($(this).val())
    let score = 0;
    let reason = '';
    let v = $(this).val()
    if ($('#attendingSocial').val().indexOf(v)!= -1) { score += 1; reason += 'attendingSocial,'; }
    if ($('#toastmaster').val().indexOf(v)!= -1) { score += 1; reason += 'toastmaster,'; }
    if ($('#topicsmaster').val().indexOf(v)!= -1) { score += 1; reason += 'topicsmaster,'; }
    if ($('#generalEvaluator').val().indexOf(v)!= -1) { score += 1; reason += 'generalEvaluator,'; }
    if ($('#preparedSpeeches').val().indexOf(v)!= -1) { score += 2; reason += 'preparedSpeeches,'; }
    if ($('#tableTopics').val().indexOf(v)!= -1) { score += 1; reason += 'tableTopics,'; }
    if ($('#evaluator').val().indexOf(v)!= -1) { score += 1; reason += 'evaluator,'; }
    if ($('#bestSpeaker').val().indexOf(v)!= -1) { score += 3; reason += 'bestSpeaker,'; }
    if ($('#bestTableTopics').val().indexOf(v)!= -1) { score += 2; reason += 'bestTableTopics,'; }
    if ($('#bestEvaluator').val().indexOf(v)!= -1) { score += 2; reason += 'bestEvaluator,'; }
    if ($('#travelingAward').val().indexOf(v)!= -1) { score += 2; reason += 'travelingAward,'; }
    if ($('#participants').val().indexOf(v)!= -1) { score += 1; reason += 'participants,'; }
    if ($('#earlyTMSignUp').val().indexOf(v)!= -1) { score += 1; reason += 'earlyTMSignUp,'; }
    if ($('#memberSignUp').val().indexOf(v)!= -1) { score += 4; reason += 'memberSignUp,'; }
    s += '\n' + score + '\t' + reason;
  });

  $('#myInput').val(s);
}

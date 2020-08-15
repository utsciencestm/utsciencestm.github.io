
function addParticipant(element) {  // , index, array
  $('select#participants option[value='+element+']').attr('selected','selected');
}
function addPeopleAbove() {
  
  $('#preparedSpeeches').val().forEach(addParticipant);
  $('#tableTopics').val().forEach(addParticipant);
  $('#evaluator').val().forEach(addParticipant);
  addParticipant($('#travelingAward').val());
  addParticipant($('#toastmaster').val());
  addParticipant($('#topicsmaster').val());
  addParticipant($('#generalEvaluator').val());
  // time keeper, grammian... 
  $('#participants').multiselect('rebuild');
}
function updateSelect(source, target) {
  $(target).html($(source).html()+'<option value="NA"> NA </option>');
  $(target).val("NA");
}
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
var choices = {}
function init() { // call it after names are loaded
//copies all contents of myDropDownListDiv into anotherDiv
  $("[class^=select]").append($("#names").html());

  // new Choices('.selectLimit3', {
  //   removeItemButton: true,
  //   maxItemCount: 3,
  //   searchResultLimit: 5,
  //   renderChoiceLimit: 5
  // });

  // choices = new Choices('[class^=selectMulti]', {
  //   removeItemButton: true,
  //   // maxItemCount:5,
  //   searchResultLimit: 5,
  //   renderChoiceLimit: 5
  // });
  choices.preparedSpeeches = new Choices('#preparedSpeeches', {removeItemButton: true, searchResultLimit: 8, renderChoiceLimit: 3});
  choices.tableTopics = new Choices('#tableTopics', {removeItemButton: true, searchResultLimit: 8, renderChoiceLimit: 10});
  choices.evaluator = new Choices('#evaluator', {removeItemButton: true, searchResultLimit: 8, renderChoiceLimit: 3});
  choices.earlyTMSignUp = new Choices('#earlyTMSignUp', {removeItemButton: true, searchResultLimit: 8});
  choices.memberSignUp = new Choices('#memberSignUp', {removeItemButton: true, searchResultLimit: 8});
  choices.attendingSocial = new Choices('#attendingSocial', {removeItemButton: true, searchResultLimit: 8});

  // after adding options
  $('#participants').multiselect();
  // $('#selectDropdowns #participants').multiselect({ buttonWidth:'100px',listWidth:'300px',maxHeight:'70vh' });

  // load column
  var column = getUrlVars()["column"];
  loadData(column);
}

$(document).ready(function() {
  // if (isSignedIn) {
  //   listNames();
  //  }
});

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_copy_clipboard2
function copy_text() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");

  var my_tooltip = document.getElementById("myTooltip");
  my_tooltip.innerHTML = "Copied: " + copyText.value;
}

function outFunc() {
  var my_tooltip = document.getElementById("myTooltip");
  my_tooltip.innerHTML = "Generate and copy to clipboard";
}


// read from google sheets 

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
var names = [];
function listNames() {
  if (names.length != 0) {return;}

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1E9VdBM1YSS0ykQG-U8yAopu8a2c9_G9U66DG_pmBmw4',
    // spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'dontRenameMe!A17:100',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      // appendPre('Names:');
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        if (row[0] == "") {break;}
        // appendPre(row[0]); // + ', ' + row[4]
        let firstName = row[0].split(' ')[0];
        names.push(firstName);
        $('<option>').val(firstName).text(firstName).appendTo('#names');
      }
      init();
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });

}

var range;
function loadData(col) {
  col = col.trim()
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1E9VdBM1YSS0ykQG-U8yAopu8a2c9_G9U66DG_pmBmw4',
    // spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'dontRenameMe!' + col + '2:15',
  }).then(function(response) {
    range = response.result;
    if (range.values.length > 0) {
    $('#toastmaster').val(range.values[0][0]);
    $('#topicsmaster').val(range.values[1][0]);
    $('#generalEvaluator').val(range.values[2][0]);

    // $('#preparedSpeeches').val(range.values[3][0]);
    // $('#tableTopics').val(range.values[4][0]);
    // $('#evaluator').val(range.values[5][0]);
    choices.preparedSpeeches.setValue(range.values[3][0].split(','));
    choices.tableTopics.setValue(range.values[4][0].split(','));
    choices.evaluator.setValue(range.values[5][0].split(','));

    $('#preparedSpeeches')[0].onchange();
    $('#tableTopics')[0].onchange();
    $('#evaluator')[0].onchange();

    $('#bestSpeaker').val(range.values[6][0]);
    $('#bestTableTopics').val(range.values[7][0]);
    $('#bestEvaluator').val(range.values[8][0]);
    $('#travelingAward').val(range.values[9][0]);
    
    range.values[10][0].split(',').forEach(addParticipant);
    $('#participants').multiselect('rebuild');
    
    // $('#earlyTMSignUp').val(range.values[11][0]);
    // $('#memberSignUp').val(range.values[12][0]);
    // $('#attendingSocial').val(range.values[13][0]);
    if (range.values[11][0]) {choices.earlyTMSignUp.setValue(range.values[11][0].split(','));}
    if (range.values[12][0]) {choices.memberSignUp.setValue(range.values[12][0].split(','));}
    if (range.values[13][0]) {choices.attendingSocial.setValue(range.values[13][0].split(','));}
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });

}

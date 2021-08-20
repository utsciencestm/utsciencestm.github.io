// MUST READ
// https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/
var meeting_col = 1;
var unavailable_members;
var active_members;

var available_active_members;


















////////////////////////////////////////////////////////////////////////////





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

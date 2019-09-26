/*
Set config
*/

function getStructure(sheetName){
  var sheets = {
    present: [
      "nis","nama","status","deleted_at",
    ],
  }
  return sheets[sheetName];
}

function typeData(sheetName){
  var sheets = {
    present: {
      nis : 'alfanumerik|min_length[5]|max_length[20]|required',
      nama: 'alfanumerik|min_length[3]|max_length[50]|required',
      status: 'integer|min[0]|max[3]|required'
    }
  }
  return sheets[sheetName];
}
  
  function alfanumerik(column, data){
   return true; 
  }
  
  function integer(column, data){
    var check = parseInt(data) == data*1;
    if(check){
      return true;
    }
    return column +' must be an integer.';
  }
  
  function required(column, data){
    if(data){
      return true;
    }
    return column +' can not be empty.';
  }
  
  function min(column, data, minimum){
    data = parseInt( data );
    if(data > minimum){
      return true;
    }
    return column +' minimum is '+minimum+'.';
  }
  
  function max(column, data, maximum){
    data = parseInt( data );
    if(data < maximum){
      return true;
    }
    return column +' maximum is '+maximum+'.';
  }
  
  function min_length(column, data, minimun){
    data =  data.toString();
    if(data.length > minimun){
      return true;
    }
    return column +' minimum length is '+minimun+'.';
  }
  
  function max_length(column, data, maximum){
    data =  data.toString();
    if(data.length < maximum){
      return true;
    }
    return column +' maximum length is '+maximum+'.';
  }
  
  function validation(sheetName, fields, request){
    var columns = typeData(sheetName);
    var field = [];
    var valid = {};
    for(var i=0; i < fields.length ; i++){
      if(columns[fields[i]]){
        valid[fields[i]] = [];
        field.push(fields[i]);
        var rules = columns[fields[i]].split('|');
        for(var j=0; j<rules.length; j++){
          var matches = rules[j].replace(/\]/,'').split('[');
          if(matches[0]=='alfanumerik'){
            var test = alfanumerik(fields[i], request.parameter[fields[i]]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }else if(matches[0]=='integer'){
            var test = integer(fields[i], request.parameter[fields[i]]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }else if(matches[0]=='required'){
            var test = required(fields[i], request.parameter[fields[i]]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }else if(matches[0]=='min'){
            var test = min(fields[i], request.parameter[fields[i]],matches[1]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }else if(matches[0]=='max'){
            var test = max(fields[i], request.parameter[fields[i]],matches[1]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }else if(matches[0]=='max_length'){
            var test = max_length(fields[i], request.parameter[fields[i]],matches[1]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }else if(matches[0]=='min_length'){
            var test = min_length(fields[i], request.parameter[fields[i]],matches[1]);
            if(test !== true){
              valid[fields[i]].push(test);  
            }
          }
        }
      }
    }                                   
    return [field, valid];
  }
/*
Set initial variable
*/

function init(){
  return {
    id : "ISIKAN ID SPREADSHEET YANG DIJADIKAN SEBAGAI DATABASE",
    sheetName: '',
    action : '',
    columns: [],
    key: '',
  }
}

/*
bootstraping
*/
function bootstrap(request){
  var chekInit = init();
  var route = cekRoute(request);
  if(route == false){
    return respond({
      status: false,
      message: "You dont have authorisation.",
    })
  }
  
  chekInit.sheetName = route.sheetName;
  chekInit.action = route.action;
  chekInit.columns = getStructure(route.sheetName);
  chekInit.key = chekInit.columns[0];
  
  var integrity = checkColumn(request, chekInit);
  if(integrity.status==false){
    respond(integrity);
    return false;
  }
  return chekInit;
}

/*
Config/Route
*/
  
function postRoute(){
  return {
      "present/put" : ["insert","update"],
      "present/delete" : ["delete"], 
  }
}

function getRoute(){
  return {
    "present":true,
  }
}

/*
Routing
*/

function cekRoute(request){
  var route = request.parameter.route;
  
  if(route){
    var segments = route.split("/");
    return {
      sheetName: segments[0],
      action: segments[1]
    }
  }
  return false;
}

/*
Verify table structure
*/
  
function checkColumn(request, activeSheet){
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  
  if(! sheet){
    return {
      status: false,
      message: "Table "+ activeSheet.sheetName+" is not exists",
    }
  }
  
  var key = request.parameter[activeSheet.columns[0]];
  var withKey = sheet.getRange(1,1).getValue() != key;
  
                              
  for(var i = 1; i<=activeSheet.columns.length; i++){
    var fieldName = sheet.getRange(1,i).getValue();
    if(activeSheet.columns[i-1] != fieldName){
      return {
        status: false,
        key: withKey,
        message: "Column "+fieldName+" not exists."+JSON.stringify([activeSheet.columns,sheet]),
      }
      break;
    }
  }
        
  return {
    status: true,
    key: withKey,
    message: "All Columns available",
  }    
}

/*
filter request for post method
*/
function doPost(request) {
  
  if(typeof postRoute()[request.parameter.route] == "undefined"){
    return respond({
      status: false,
      message:"Route parameters must be sent.",
    })
  }
  
  var myInit = bootstrap(request);
  
  if(myInit==false){
    return false;
  }
      
  var activeRow = getRow(request, myInit);
  
  var rule = validation(myInit.sheetName, myInit.columns, request);
  var valid = true;
  var message = [];
  for(var i=0; i< rule[0].length; i++){
    var test = rule[1][rule[0][i]];
    if(test.length >0){
      valid = false;
      message.push(test.join());
    }
  }
  
  if(!valid){
    return respond(message);
  }
  
  if(myInit.action=="put")
  {
    if(activeRow==-1){
      if((postRoute()[request.parameter.route]).indexOf("insert") ==-1){
        return respond({
          status: false,
          message: myInit.key+" does not exists.",
        })
      }
      var id= insertData(request, myInit);
      return respond({
        status: true,
        message: "Data has been added.",
      })
    }
    var id= updateData(request, myInit, activeRow);
    return respond({
      status: true,
      message: "Data has been updated.",
    })   
  }
  if(activeRow==-1){
    return respond({
      status: false,
      message: myInit.key+" does not exists.",
    })
  }
  
  var id= deleteData(myInit, activeRow);
  return respond({
    status: false,
    message: "Data has beeen deleted.",
  })
}

/*
filter request for post method
*/

function doGet(request){
  if(typeof getRoute()[request.parameter.route] == "undefined"){
    return respond({
      status: false,
      message:"Action "+request.parameter.route+" does not allowed.",
    })
  }
  
  var myInit = bootstrap(request);
  
  if(myInit==false){
    return false;
  }

  if(request.parameter[myInit.key]){
    var activeRow = getRow(request, myInit);

    if(activeRow==-1 || activeRow==false){
      return respond({
        status: false,
        message: "Data not found.",
      })
    }
    return respond({
      status: true,
      data: getOne(myInit, activeRow),
    })
  }
   
  var offset = request.parameter.offset;
  var limit = request.parameter.limit;
  
  if(typeof offset == 'undefined'){
    offset = 0;
  }
  
  if(typeof limit == 'undefined'){
    limit = 0;
  }
  
  return respond({
    status: true,
    data:getMany(myInit, offset, limit),
  })
}

  
function respond(message){
  return ContentService.createTextOutput(JSON.stringify(message)).setMimeType(ContentService.MimeType.JSON);
}

function getRow(request,activeSheet){
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  var key = request.parameter[activeSheet.key];
  var lastRow = sheet.getLastRow();
  if(typeof key == "undefined"){
    return false;
  }
  
  if(key*1==key){
    key = key*1;
  }
  
  var indexs = sheet.getRange(2, 1, lastRow).getValues();
  var flags = sheet.getRange(2, activeSheet.columns.indexOf('deleted_at')+1, lastRow).getValues();
  
  for(var row = 0; row<indexs.length; row++){
    var deleted = flags[row][0];  
    if(key == indexs[row][0] && deleted ==""){
      return row+2;
      break;
    }
  }
  return -1;
}

function insertData(request, activeSheet){
  var protectFields = ["deleted_at"];
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  var data = [];
  
  for(var i=0; i<activeSheet.columns.length;i++){
    if(protectFields.indexOf(activeSheet.columns[i])==-1){
      data.push(request.parameter[activeSheet.columns[i]]);
    }
  }
  sheet.appendRow(data);
}

function updateData(request, activeSheet, activeRow){
  var protectFields = ["deleted_at"];
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  var data = [];
  
  for(var i=1; i<activeSheet.columns.length;i++){
    if(protectFields.indexOf(activeSheet.columns[i])==-1){
      sheet.getRange(activeRow, i+1).setValue(request.parameter[activeSheet.columns[i]]);
    }
  }
}

function deleteData(activeSheet, activeRow){  
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  sheet.getRange(activeRow, activeSheet.columns.indexOf('deleted_at')+1).setValue(new Date());
}

  
function getOne(activeSheet, activeRow){
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  var data = {}
  var protectFields = ["deleted_at"];
  for(var i=0; i<activeSheet.columns.length;i++){
    if(protectFields.indexOf(activeSheet.columns[i])==-1){
      data[activeSheet.columns[i]] = sheet.getRange(activeRow, i+1).getValue();
    }
  }
  return data;
}

  
function getMany(activeSheet, offset, limit){
  var ss = SpreadsheetApp.openById(activeSheet.id);
  var sheet = ss.getSheetByName(activeSheet.sheetName);
  var flag = activeSheet.columns.indexOf('deleted_at')+1;
  var lastRow =  sheet.getLastRow();
  var dataSheet = sheet.getRange(2,1, flag, lastRow).getValues();
  var result = [];
  
  for(var i=0; i<dataSheet.length; i++){
    if(dataSheet[i][flag-1] == ""){
      var row = {};
      for(var j =0; j<flag-1; j++){
        row[activeSheet.columns[j]] = dataSheet[i][j];
      }
      result.push(row);
    }
  }  
  return result.slice(offset, offset+limit); 
}

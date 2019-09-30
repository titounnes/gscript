var Database = {};
 
Database.checkColumn = function(){
  var connection = SpreadsheetApp.openById('1uYiE6KdjZLN_0nrVetTFUEGP_Pf5fiqAuinMhgUYaTY');
  App.config.sheetName = App.config.request.parameter.route.split('/')[0];
  App.config.action = App.config.request.parameter.route.split('/')[1];
  App.config.sheet = connection.getSheetByName(App.config.sheetName);
  App.config.columns = Config.getStructure(App.config.sheetName);
  App.config.key = App.config.columns[0];

  /* 
  create new sheet if not exists
  */
  if(! App.config.sheet){
    connection.insertSheet(App.config.sheetName);
    App.config.sheet = connection.getSheetByName(App.config.sheetName)
    App.config.columns.push('deleted_at');
    App.config.sheet.appendRow(App.config.columns);    
  }
 
  App.config.withKey = App.config.sheet.getRange(1,1).getValue() != App.config.request.parameter[App.config.key]; 
  
  for(var i = 1; i<=App.config.columns.length; i++){
    if(App.config.sheet.getRange(1, i).getValue() != App.config.columns[i-1]){
      App.config.sheet.getRange(1, i).setValue(App.config.columns[i-1]);
    }
  }

  var lastColumn = App.config.sheet.getLastColumn();
  var lastField = App.config.sheet.getRange(1, lastColumn).getValue();
  if(lastField != 'deleted_at'){
    App.config.sheet.getRange(1, lastColumn+1).setValue('deleted_at');
  }

}

Database.getRow = function(){
  
  if(! App.config.request.parameter[App.config.key]){
    Response.message.push('Parameter '+App.config.key+' not sent.');
    return false;
  }
  
  var lastRow = App.config.sheet.getLastRow();
  var lastColumn = App.config.sheet.getLastColumn();
    
  if(lastRow <= 1){
    return -1;
  }
    
  var indexs = App.config.sheet.getRange(2,1, lastRow).getValues();

  var flags = App.config.sheet.getRange(2, lastColumn, lastRow).getValues();
  
  for(var row = 2; row <= lastRow; row++){
    var deleted = flags[row-2][0];  
    if(App.config.request.parameter[App.config.key] == indexs[row-2][0] && deleted ==""){
      return row;
      break;
    }
  }
  return -1;
}

Database.insertData = function(){
  var sheet = App.config.sheet;
  var dataRow = [];
  
  for(var i=0; i< App.config.columns.length; i++){
    var data = App.config.request.parameter[App.config.columns[i]];
    if(App.config.columns[i]=='password'){
      data = Password.hash(data);
    }
    dataRow.push(data);
  }
  sheet.appendRow(dataRow);
  //sendMail();
}

Database.updateData = function(activeRow){
  var protectFields = ["deleted_at"];
  var sheet = App.config.sheet;
  
  for(var i=1; i< App.config.columns.length; i++){
    var data = App.config.request.parameter[App.config.columns[i]];
    if(App.config.columns[i]=='password'){
      if(data != ''){
        sheet.getRange(activeRow, i+1).setValue(Password.hash(data));
      }
    }else{
      sheet.getRange(activeRow, i+1).setValue(data);
    }
  }
}

Database.deleteData = function(activeRow){  
  App.config.sheet.getRange(activeRow, App.config.columns.length+1).setValue(new Date());
}

  
Database.getOne = function(activeRow){
  return App.config.sheet.getRange(activeRow, 1, 1, App.config.columns.length).getValues();
}

  
Database.getMany = function(){
  var dataSheet = App.config.sheet.getRange(2, 1, App.config.sheet.getLastRow()-1, App.config.columns.length).getValues();
  var flag = App.config.sheet.getRange(2, App.config.columns.length+1, App.config.sheet.getLastRow()-1, 1 ).getValues();
  return dataSheet;
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

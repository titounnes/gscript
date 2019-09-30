var Validation = {};
  
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
    data =  data+'';
    if(data.length > minimun){
      return true;
    }
    return column +' minimum length is '+minimun+'.';
  }
  
  function max_length(column, data, maximum){
    data =  data + '';
    if(data.length < maximum){
      return true;
    }
    return column +' maximum length is '+maximum+'.';
  }
  
  Validation.run = function(){
    var alphanumeric = function(column, data){
      return true;
    }
    
    Validation.valid = true;
    Validation.message = [];
    
    var columns = Config.typeData(App.config.sheetName);
    var fields = App.config.columns; 
    var param = App.config.request.parameter;
   
    for(var i=0; i < fields.length ; i++){
      if(columns[fields[i]]){
        
        var rules = columns[fields[i]].split('|');
        for(var j=0; j<rules.length; j++){
          var matches = rules[j].replace(/\]/,'').split('[');
          matches[0] = alphanumeric;
          var func = matches[0]+"('"+fields[i]+"','"+param[fields[i]]+"'"+(matches[1]?",'"+matches[1]+"'" :"")+")";
          var test = eval(func);
          Logger.log(test);
          if(test !==true){
            Validation.valid = false;
            Validation.message.push(test);
            }
          //Response.message.push(eval(func));
          //Response.log();
          /*
          if(matches[0]=='alfanumerik'){
            var test = alfanumerik(fields[i], param[fields[i]]);
            if(test !== true){
              Validation.valid = false;
              Validation.message.push(test)
            }
          }else if(matches[0]=='integer'){
            var test = integer(fields[i], param[fields[i]]);
            if(test !== true){
              Validation.valid = false;
              Response.message.push(test)
            }
          }else if(matches[0]=='required'){
            var test = required(fields[i], param[fields[i]]);
            if(test !== true){
              Validation.valid = false;
              Response.message.push(test)
            }
          }else if(matches[0]=='min'){
            var test = min(fields[i], param[fields[i]],matches[1]);
            if(test !== true){
              Validation.valid = false;
              Response.message.push(test)
            }
          }else if(matches[0]=='max'){
            var test = max(fields[i], param[fields[i]],matches[1]);
            if(test !== true){
              Validation.valid = false;
              Response.message.push(test)
            }
          }else if(matches[0]=='max_length'){
            var test = max_length(fields[i], param[fields[i]],matches[1]);
            if(test !== true){
              Validation.valid = false;
              Response.message.push(test)
            }
          }else if(matches[0]=='min_length'){
            var test = min_length(fields[i], param[fields[i]],matches[1]);
            if(test !== true){
              Validation.valid = false;
              Response.message.push(test)
            }
          }
          */
        }
      }
    }               
    
    return Validation.valid;
}

function foo(x) {return x+5};
function testValidation(){
  
  var a = 'foo(5)';
  Response.message.push(eval(a))
  
  Response.log();
}
  
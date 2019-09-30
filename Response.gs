var Response = {};

Response.message = [];

Response.respond = function(message){
  return ContentService.createTextOutput(JSON.stringify(message)).setMimeType(ContentService.MimeType.JSON);
}

Response.fail = function(){
  Response.respond({
    status: false,
    message: Response.message
    })
  Response.log();
}

Response.success = function(){
  Response.respond({
    status: true,
    message: Response.message
    })
  Response.log();
}

Response.result = function(data){
  Response.respond({
    status: true,
    data: data,
    })  
  Response.message = data;
  Response.log();
}
  
Response.log = function(){
  Logger.log(Response.message);
}
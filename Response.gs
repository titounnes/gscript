var Response = {};

Response.message = [];

Response.respond = function(message){
  return ContentService.createTextOutput(JSON.stringify(message)).setMimeType(ContentService.MimeType.JSON);
}

Response.fail = function(){
  Response.log();
  return Response.respond({
    status: false,
    message: Response.message
    })
}

Response.success = function(){
  Response.log();
  return Response.respond({
    status: true,
    message: Response.message
    })
}

Response.result = function(data){
  Response.message = data;
  Response.log();
  return Response.respond({
    status: true,
    data: data,
    })  
}
  
Response.log = function(){
  Logger.log(Response.message);
}
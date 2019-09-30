function testPost(request) {
  //begin test
  var request = {};
  var parameter = {
    route :'books/delete',
    id: '132498588',
    title: 'B',
    author: 'Ha',
    publisher: 'Kimia Jaya Baya',
  }
  
  request.parameter = parameter;
  
  //end test
  var route = Config.route.post(request.parameter.route)

  if(! route){
    Response.message.push('Route paramerer must be set on config');
    return Response.fail();
  }
  
  App.init(request);
  
  Database.checkColumn();
  
  var activeRow = Database.getRow();
  
  var rule = Validation.run();
  
  if(!rule){
    return Response.fail();
  }
  
  App.config.allowMethod = Config.route.post(App.config.request.parameter.route)
  
  if(App.config.action=="put")
  {
    if(activeRow==-1){
      if(App.config.allowMethod.indexOf("insert") ==-1){
        Response.message.push(App.config.key+" does not exists.");
        return Response.fail();
      }
      var id= Database.insertData();
      Response.message.push("Data has been added.");
      return Response.success();
    }
    var id= Database.updateData(activeRow);
    Response.message.push("Data has been updated.");
    return Response.success();
  }

  if(activeRow==-1){
    Response.message.push(App.config.key+" does not exists.");
    return Response.fail();
  }
  
  Database.deleteData(activeRow);
  Response.message.push("Data has beeen deleted.");
  return Response.success();
}

/*
filter request for post method
*/

function testGet(request){
  var request = {};
  var parameter = {
    route :'books',
    ids: '13249888',
    title: 'Bukan itu',
    author: 'Harjito6hh haha',
    publisher: 'Kimia Jaya Baya',
  }
  
  request.parameter = parameter;
  
  //end test
  var route = Config.route.get(request.parameter.route)

  if(! route){
    Response.message.push('Route paramerer must be set on config');
    return Response.fail();
  }
  App.init(request);
  
  Database.checkColumn();
  
  if(App.config.request.parameter[App.config.key]){
    
    var activeRow = Database.getRow();
  
    if(activeRow==-1 || activeRow==false){
      Response.message.push('Data with '+myInit.key+ ' not found.');
      return Response.fail();
    }
    
    return Response.result(Database.getOne(activeRow));
    
  }
  
  return Response.result(Database.getMany());
}

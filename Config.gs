/* data structure */
var Config = {};

Config.getStructure = function(sheetName){
  var sheets = {
    users: [
      'username','name','email','password',
    ],
    present: [
      "nis","nama","status","deleted_at",
    ],
    books: [
      "id","title","author","publisher",
    ]
  }
  return sheets[sheetName];
}

/*  Route */

Config.route = {};
  
Config.route.post = function(route){
  return {
    "users/put" : ["insert","update"],
    "users/delete" : ["delete"],
    "present/put" : ["insert","update"],
    "present/delete" : ["delete"], 
    "books/put" : ["insert","update"],
    "books/delete": ["delete"],
  }[route]
}

Config.route.get = function(){
  return {
    "users" : true,
    "present":true,
    "books":true,
  }
}

Config.typeData = function(sheetName){
  var sheets = {
    users: {
      username: 'alfanumerik|required',
      email: 'required',
      name: 'required',
      password: 'required',
    },
    present: {
      nis : 'alphanumeric|min_length[5]|max_length[20]|required',
      nama: 'alphanumeric|min_length[3]|max_length[50]|required',
      status: 'integer|min[0]|max[3]|required'
    },
    books: {
      id : 'alphanumeric|min_length[5]|max_length[20]|required',
      title: 'alphanumeric|min_length[3]|max_length[50]|required',
      author: 'alphanumeric|min_length[3]|max_length[50]|required',
      publisher: 'alphanumeric|min_length[3]|max_length[50]|required',
    }
  }
  return sheets[sheetName];
}

function testConfig(){
  var structure = Config.getStructure('books');
  Logger.log(structure);
  var typeData = Config.typeData('books');
  Logger.log(typeData);
}
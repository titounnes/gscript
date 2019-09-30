/* jwt */
//(function(){
 var base64Decode = function (str) {

    return JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(str, Utilities.Charset.UTF_8 )).getDataAsString());
 
  };

  var base64Encode = function (str) {

    return Utilities.base64EncodeWebSafe(str).replace(/=+$/, '');
    
  };

  var secret = function(){

    return base64Encode('Gjh5$321ki8&6xLk2jsjj*655w0kjdjh#gsgs?>jusgt5436777%%%43****0--=6Loi')

  }

  var Jwt = {};
  Jwt.encode = function(data){

    var header = JSON.stringify({
        typ: 'JWT',
        alg: 'HS256'
    });

    var encodedHeader =  base64Encode(header);

    var iat = new Date().getTime() / 1000 + 24*3600;

    var payload = JSON.stringify({
      iat: iat,
      data: JSON.stringify(data),
    });

    var encodedPayload = base64Encode(payload);
 
    var toSign = [encodedHeader, encodedPayload].join('.');

    var signature = base64Encode(Utilities.computeHmacSha256Signature(toSign, secret()));

    return [toSign, signature].join('.');
  }

  Jwt.decode = function(token){
    var segment = token.split('.');
  
    if(segment.length <3){
      return false;
    }
  
    var toSign = [segment[0],segment[1]].join('.');
    var signature = base64Encode(Utilities.computeHmacSha256Signature(toSign, secret()));
  
    if(signature != segment[2]){
      return false;
    }
  
    var decoded = base64Decode(segment[1]); 
  
    if(decoded.iat < new Date().getTime() / 1000){
      return false;
    }
  
    return decoded.data;

  }
  

  var Password = {}

  Password.hash = function(str){
    return new cCryptoGS.Cipher(secret()+base64Encode(str), 'TripleDES').encrypt(str);
  }
  
  Password.verify = function(str, hashed){
    var decrypt = function(key, hashed){
      return new cCryptoGS.Cipher(secret()+base64Encode(key), 'TripleDES').decrypt(hashed);
    }
    return str == decrypt(str, hashed);
 }

function testJwt(){
  var encoded = Jwt.encode({foo:'bar'});
  Logger.log(encoded);
  var decoded = JSON.stringify(Jwt.decode(encoded));
  Logger.log(decoded);
  var hashed = Password.hash('foo');
  Logger.log(hashed);
  var plain = Password.verify('foo', hashed);
  Logger.log(plain);
}
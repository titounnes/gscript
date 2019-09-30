var sendMail = function(email, subject, body) {
  var quotaRemain = MailApp.getRemainingDailyQuota();
  if(quotaRemain > 0){
    var email = 'john.doe@example.com';
    var subject = 'Hello world Again and gain';
    var body = '<h1>Some one test your script</h1>';
    MailApp.sendEmail({to:email, subject:subject, htmlBody:body});
    return 'Email sent.';
  }
  return 'Your quota remain is 0';
}

function testEmail(){  
  var email = 'harjito@mail.unnes.ac.id';
  var subject = 'Hello world Again and gain';
  var body = '<h1>Some one test your script</h1>';
  sendMail(email, subject, body);
}


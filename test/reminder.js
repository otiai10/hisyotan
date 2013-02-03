var exec = require('child_process').exec;

exec('node /home/hiromu/node/projects/hisyotan/reminder.js weekly true', function(err, stdout, stderror){


});

exec('node /home/hiromu/node/projects/hisyotan/reminder.js daily true', function(err, stdout, stderror){


});

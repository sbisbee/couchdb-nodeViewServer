var vm = require('vm');

var map = require('./map.js');
var reduce = require('./reduce');

var ERROR = {
  MAP_NOT_A_FUNC: { error: 100, reason: "Your map function does not evaluate to a JS function." }
};

var couch = {
  sendLine: function(data) {
    if(typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    process.stdout.write(data + '\n');
  },
  log: function(line) {
    couch.sendLine([ 'log', line ]);
  }
};

process.on('uncaughtException', function(err) {
  couch.log('Uncaught Exception: %s', err);
});

process.stdin.setEncoding('utf-8');

process.stdin.on('data', function(line) {
  var evaled;

  if(!line || line === '\n') {
    return;
  }

  try {
    line = JSON.parse(line);
  }
  catch(e) {
    couch.log('Invalid JSON sent.');
    couch.sendLine(false);

    return;
  }

  if(!line[0]) {
    couch.log('Expected an array, got something else.');
    couch.sendLine(false);

    return;
  }

  switch(line[0]) {
    case 'reset':
      map.reset();

      break;

    case 'add_fun':
      try {
        map.addFunction(line[1]);
      }
      catch(e) {
        couch.log(e);
        couch.sendLine(ERROR.MAP_NOT_A_FUNC);
        return;
      }

      break;

    case 'map_doc':
      couch.sendLine(map.runDoc(line[1]));
      return;

      break;

    case 'reduce':
      couch.sendLine([ true, reduce.reduce(line[1], line[2]) ]);
      return;

      break;

    default:
      couch.log('Not implemented yet.');
      couch.sendLine(false);
      return;
      
      break;
  }

  couch.sendLine(true);
});

process.stdin.resume();

couch.log('Alive!');

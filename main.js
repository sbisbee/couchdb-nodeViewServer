var vm = require('vm');

var map = require('./map.js');
var reduce = require('./reduce');

var fs = require("fs");

function debug(m) {
  fs.appendFileSync("/tmp/l.log", "\n");
  fs.appendFileSync("/tmp/l.log", JSON.stringify(m));
  fs.appendFileSync("/tmp/l.log", "\n");
}

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
  couch.log('Uncaught Exception:', JSON.stringify(err));
});

process.stdin.setEncoding('utf-8');

var lineInBuf = '';

process.stdin.on('data', function(lineIn) {
  var evaled;

  if(!lineIn || lineIn === '\n') {
    return;
  }

  lineInBuf += lineIn;
  if(!lineInBuf.search("\n")) {
    // not a full line yet, keep reading.
    return;
  }

  // we do have at least one line!
  var lines = lineInBuf.split("\n");
  lineInBuf = '';
  lines.forEach(function(lineRaw) {
    if(lineRaw == "" || !lineRaw.search("\n")) {
      // last line in our lines,
      // not full, back to the buffer
      lineInBuf = lineRaw;
      return;
    }

    try {
      line = JSON.parse(lineRaw);
    }
    catch(e) {
      // couch.log('Invalid JSON sent.');
      debug('Invalid JSON sent.');
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

      case 'rereduce':
        couch.sendLine([ true, reduce.rereduce(line[1], line[2]) ]);
        return;

      default:
        couch.log('Not implemented yet.');
        couch.sendLine(false);
        return;

        break;
    }

    couch.sendLine(true);
  });
});

process.stdin.resume();

couch.log('Alive!');

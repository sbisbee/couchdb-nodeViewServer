var mapFuncs = [];

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

process.stdin.setEncoding('utf-8');

process.stdin.on('data', function(line) {
  if(!line || line === '\n') {
    return;
  }

  couch.log('got: ' + line);

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
      couch.log('Resetting!');
      couch.sendLine(true);
      break;

    default:
      couch.log('Not implemented yet.');
      couch.sendLine(false);
      break;
  }
});

process.stdin.resume();

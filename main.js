var ERROR = {
  MAP_NOT_A_FUNC = { error: 100, reason: "Your map function does not evaluate to a JS function." }
};

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
  var evaled;

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
      //TODO actually implement
      break;

    case 'add_fun':
      evaled = eval('(' + line[1] + ')');

      if(typeof evaled === 'function') {
        couch.log(mapFuncs.push(evaled));
      }
      else {
        couch.log(ERROR.MAP_NOT_A_FUNC);

        return;
      }

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

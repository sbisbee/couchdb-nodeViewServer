var sendLine = function(data) {
  if(typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  process.stdout.write(data + '\n');
};

exports.sendLine = sendLine;

exports.log = function(line) {
  sendLine([ 'log', line ]);
};

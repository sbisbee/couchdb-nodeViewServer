var vm = require('vm');

var context = {
  emit: function(k, v) {
    global.mapResults.push([ k, v ]);
  }
};

var funcs = [];

exports.addFunction = function(func) {
  funcs.push(vm.createScript('(' + func + ')(currDoc)'));
};

exports.runDoc = function(doc) {
  var results = [];
  var docCopy = doc;
  var i;

  for(i in funcs) {
    global.mapResults = [];
    context.currDoc = docCopy;

    funcs[i].runInNewContext(context);

    results.push(global.mapResults);
  }

  global.mapResults = null;
  context.currDoc = null;

  return results;
};

exports.reset = function() {
  funcs = [];
  global.mapResults = null;
};

var vm = require('vm');
var couch = require('./couch.js');

var context = {
  emit: function(k, v) {
    global.mapResults.push([ k, v ]);
  },

  log: couch.log
};

var funcs = [];

exports.addFunction = function(func) {
  return funcs.push(vm.createScript('(' + func + ')(currDoc)'));
};

exports.runDoc = function(doc) {
  var results = [];
  var docCopy = doc;
  var i;

  for(i in funcs) {
    if(funcs.hasOwnProperty(i)) {
      global.mapResults = [];
      context.currDoc = docCopy;

      funcs[i].runInNewContext(context);

      results.push(global.mapResults);
    }
  }

  global.mapResults = null;
  context.currDoc = null;

  return results;
};

exports.reset = function() {
  funcs = [];
  global.mapResults = null;
};

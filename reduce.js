var sum = function(vals) {
  var result = 0;
  var i;

  for(i in vals) {
    result += vals[i];
  }

  return result;
}

var strToFunc = function(s) {
  return eval('(' + s + ')');
};

exports.reduce = function(funcs, data) {
  var results = [];
  var keys = [];
  var values = [];

  var i;

  for(i in data) {
    keys.push(data[i][0][0]);
    values.push(data[i][1]);
  }

  for(i in funcs) {
    results.push(strToFunc(funcs[i])(keys, values, false));
  }

  return results;
};

exports.rereduce = function(func, data) {
  return [ strToFunc(func)(null, data, true) ];
};

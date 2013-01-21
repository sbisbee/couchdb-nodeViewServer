var reduce = require('../src/reduce.js');
var map = require('../src/map.js');

exports.reduce = {
  goodData: function(test) {
    var reduceFunc = [ 'function(keys, vals) { return sum(vals); }' ];
    var data = [
      [ [ 'key1', 'doc1' ], 1 ],
      [ [ 'key2', 'doc1' ], 2 ],
      [ [ 'key1', 'doc2' ], 1 ]
    ];

    var res;

    test.expect(2);

    res = reduce.reduce(reduceFunc, data);

    test.strictEqual(res.length, 1, 'results length');
    test.strictEqual(res[0], 4, 'sum');

    test.done();
  },

  goodDataTwoFuncs: function(test) {
    var reduceFuncs = [
      'function(keys, vals) { return sum(vals); }',
      'function(k, v, r) { return (r) ? sum(v) : v.length; }'
    ];

    var data = [
      [ [ 'key1', 'doc1' ], 1 ],
      [ [ 'key2', 'doc1' ], 2 ],
      [ [ 'key1', 'doc2' ], 1 ]
    ];

    var res;

    test.expect(3);

    res = reduce.reduce(reduceFuncs, data);

    test.strictEqual(res.length, 2, 'results length');
    test.strictEqual(res[0], 4, 'sum');
    test.strictEqual(res[1], 3, 'count');

    test.done();
  }
};

exports.rereduce = {
  goodData: function(test) {
    var reduceFuncs = [
      'function(k, v) { return sum(v); }',
      'function(k, v, r) { return (r) ? sum(v) : v.length; }'
    ];

    var data = [ 10, 20, 30 ];

    var res;

    test.expect(3);

    res = reduce.rereduce(reduceFuncs, data);

    test.strictEqual(res.length, 2, 'results length');
    test.strictEqual(res[0], 60, 'sum');
    test.strictEqual(res[1], 60, 'count');

    test.done();
  }
};

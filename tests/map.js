var map = require('../src/map.js');

var tearDown = function(cb) {
  map.reset();
  cb();
};

exports.addFunction = {
  tearDown: tearDown,

  goodInput: function(test) {
    test.expect(2);

    test.strictEqual(map.addFunction('function(a) { console.log(a); }'), 1);
    test.strictEqual(map.addFunction('function(a) { console.log(a); }'), 2);

    test.done();
  },

  badInput: function(test) {
    test.expect(1);

    test.throws(function() {
      map.addFunction('functoin() { no workie }')
    });

    test.done();
  }
};

exports.reset = {
  tearDown: tearDown,

  goodData: function(test) {
    test.expect(2);

    test.strictEqual(map.addFunction('function() { }'), 1);
    map.reset();
    test.strictEqual(map.addFunction('function() { }'), 1);

    test.done();
  }
};

exports.map = {
  tearDown: tearDown,

  oneDoc: function(test) {
    var res;

    test.expect(2);

    map.addFunction('function(d) { emit(d._id, 1); }');
    res = map.runDoc({ _id: 'a', _rev: 'b', hi: 123 });

    test.strictEqual(res[0][0][0], 'a');
    test.strictEqual(res[0][0][1], 1);

    test.done();
  },

  twoDocs: function(test) {
    var docs = [ { a: 1 }, { a: 2 } ];
    var res;
    var i;

    test.expect(4);

    map.addFunction('function(d) { emit(\'a\', d.a); }');

    for(i = 0; i < docs.length; i++) {
      res = map.runDoc(docs[i]);

      test.strictEqual(res[0][0][0], 'a');
      test.strictEqual(res[0][0][1], docs[i].a);
    }

    test.done();
  },

  twoEmits: function(test) {
    var res;

    test.expect(3);

    map.addFunction('function(d) { emit(d.a, 1); emit(d.b, 1); }');
    res = map.runDoc({ a: 1, b: 2 });

    test.strictEqual(res[0].length, 2);
    test.strictEqual(res[0][0][0], 1);
    test.strictEqual(res[0][1][0], 2);

    test.done();
  },

  twoEmitsTwoDocs: function(test) {
    var docs = [ { a: 1 }, { a: 2 } ];
    var res;
    var i;

    test.expect(6);

    map.addFunction('function(d) { emit(true, true); emit(d.a, 1); }');

    for(i in docs) {
      res = map.runDoc(docs[i]);

      test.strictEqual(res[0].length, 2);
      test.strictEqual(res[0][0][0], true);
      test.strictEqual(res[0][1][0], docs[i].a);
    }

    test.done();
  }
};

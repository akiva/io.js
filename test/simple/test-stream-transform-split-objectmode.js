// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');

var Transform = require('stream').Transform;

var parser = new Transform({ readableObjectMode : true });

assert(parser._readableState.objectMode);
assert(!parser._writableState.objectMode);

parser._transform = function (chunk, enc, callback) {
  callback(null, { val : chunk[0] });
};

var parsed;

parser.on('data', function (obj) {
  parsed = obj;
});

parser.end(new Buffer([42]));

process.on('exit', function () {
  assert(parsed.val === 42);
});


var serializer = new Transform({ writableObjectMode : true });

assert(!serializer._readableState.objectMode);
assert(serializer._writableState.objectMode);

serializer._transform = function (obj, _, callback) {
  callback(null, new Buffer([obj.val]));
}

var serialized;

serializer.on('data', function (chunk) {
  serialized = chunk;
});

serializer.write({ val : 42 });

process.on('exit', function () {
  assert(serialized[0] === 42);
});
/*global should TreeMap*/
// When runing in the browser, then JStreeMap, Mocha and Should are already preloaded.
if (process) {
    // Running inside NodeJS
    let lib;
    if (process.env.DEV_TEST) {
        // Use source code
        lib = require('../../src/public/tree-map');
    }
    else {
        // use web-packed library
        lib = require('../../jstreemap');
    }
    // eslint-disable-next-line no-global-assign
    TreeMap = lib.TreeMap;
    require('should');
}

describe('TreeMap tests', function() {

    it('constructor;', function(done) {
        let m = new TreeMap();
        should.equal(0, m.size);

        done();
    });

    it('constructor; array literal', function(done) {
        let m = new TreeMap([[2, 'B'], [1, 'A'], [3, 'C']]);
        should.equal(3, m.size);

        let actual = [];
        for (let [k, v] of m) {
            actual.push([k, v]);
        }

        let expected = [[1, 'A'], [2, 'B'], [3, 'C']];
        should.deepEqual(expected, actual);

        done();
    });

    it('constructor; ES6 map', function(done) {
        let jsMap = new Map([[2, 'B'], [1, 'A'], [3, 'C']]);
        let m = new TreeMap(jsMap);
        should.equal(3, m.size);

        let actual = [];
        for (let [k, v] of m) {
            actual.push([k, v]);
        }

        let expected = [[1, 'A'], [2, 'B'], [3, 'C']];
        should.deepEqual(expected, actual);

        done();
    });

    it('constructor; generator function', function(done) {
        let gen = function*() {
            for (let i = 1; i < 4; ++i) {
                yield [i, `N${i * 2}`];
            }
        };
        let m = new TreeMap(gen());
        should.equal(3, m.size);

        let actual = [];
        for (let [k, v] of m) {
            actual.push([k, v]);
        }

        let expected = [[1, 'N2'], [2, 'N4'], [3, 'N6']];
        should.deepEqual(expected, actual);

        done();
    });

    it('compareFunc', function(done) {
        /* Test ability to compare alphanumeric structures like ['A',123]
           First string portion is compared. If string portions of two objects are equal then numeric portions are compared */
        class Id {
            constructor(a, n) {
                this.alpha = a;
                this.num = n;
            }
        }

        function compareIds(idLhs, idRhs) {
            if (idLhs.alpha < idRhs.alpha) {
                return -1;
            }
            else if (idLhs.alpha > idRhs.alpha) {
                return 1;
            }
            else {
                if (idLhs.num < idRhs.num) {
                    return -1;
                }
                else if (idLhs.num > idRhs.num) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }

        let m = new TreeMap();
        m.compareFunc = compareIds;
        m.set(new Id('B', 8), 'Book with id B8');
        m.set(new Id('A', 340), 'Book with id A340');
        m.set(new Id('A', 12), 'Book with id A12');
        m.set({alpha: 'AA', num: 147}, 'Book with id AA147'); // create an ad-hoc object

        let actual = [];
        for (let [k, v] of m) {
            actual.push([k.alpha, k.num, v]);
        }
        let expected = [
            ['A', 12, 'Book with id A12'],
            ['A', 340, 'Book with id A340'],
            ['AA', 147, 'Book with id AA147'],
            ['B', 8, 'Book with id B8']
        ];
        should.deepEqual(expected, actual);

        done();
    });

    it('constructor; invalid literal', function(done) {
        try {
            let m = new TreeMap(35);
            should.fail('The error was not detected');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('iterable objects'), msg);
        }
        done();
    });

    it('constructor; null', function(done) {
        let m = new TreeMap(null);
        should.equal(0, m.size);

        done();
    });

    it('constructor; null', function(done) {
        let m = new TreeMap(undefined);
        should.equal(0, m.size);

        done();
    });

    it('toStringTag', function(done) {
        let expected = '[object TreeMap]';
        let actual = Object.prototype.toString.call(new TreeMap());
        should.strictEqual(expected, actual);

        done();
    });

    it('species; on object', function(done) {
        let map = new TreeMap();
        let constrFunc = Object.getPrototypeOf(map).constructor[Symbol.species];
        let map2 = new constrFunc();
        should.ok(map2 instanceof TreeMap);

        done();
    });

    it('species; on class', function(done) {
        let ctr = TreeMap[Symbol.species];
        let actual = new ctr();
        should.ok(actual instanceof TreeMap);

        done();
    });

    it('clear', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        map.clear();
        should.equal(0, map.size);

        done();
    });

    it('delete', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        map.delete(2);
        let expected = '{1:A,3:C}';
        should.equal(expected, map.toString());
        map.delete(4);
        should.equal(expected, map.toString());

        done();
    });

    it('entries', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        for (let [key, value] of map.entries()) {
            actual.push([key, value]);
        }
        let expected = [[1, 'A'], [2, 'B'], [3, 'C']];
        should.deepEqual(expected, actual);

        done();
    });

    it('forEach', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        map.forEach(function(value, key, container) {
            actual.push([key, value]);
        });
        let expected = [[1, 'A'], [2, 'B'], [3, 'C']];
        should.deepEqual(expected, actual);

        done();
    });

    it('get', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        should.equal('A', map.get(1));
        should.equal(undefined, map.get(4));

        done();
    });

    it('has', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        should.equal(true, map.has(1));
        should.equal(false, map.has(4));

        done();
    });

    it('keys', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        for (let key of map.keys()) {
            actual.push(key);
        }
        let expected = [1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('values', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        for (let value of map.values()) {
            actual.push(value);
        }
        let expected = ['A', 'B', 'C'];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        for (let [key, value] of map.backward()) {
            actual.push([key, value]);
        }
        let expected = [[3, 'C'], [2, 'B'], [1, 'A']];
        should.deepEqual(expected, actual);

        done();
    });

    it('begin/end', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        for (let it = map.begin(); !it.equals(map.end()); it.next()) {
            actual.push([it.key, it.value]);
        }
        let expected = [[1, 'A'], [2, 'B'], [3, 'C']];
        should.deepEqual(expected, actual);

        done();
    });

    it('rbegin/rend', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let actual = [];
        for (let it = map.rbegin(); !it.equals(map.rend()); it.next()) {
            actual.push([it.key, it.value]);
        }
        let expected = [[3, 'C'], [2, 'B'], [1, 'A']];
        should.deepEqual(expected, actual);

        done();
    });

    it('find', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let it = map.find(2);
        should.equal(2, it.key);
        should.equal('B', it.value);

        it = map.find(4);
        should.ok(it.equals(map.end()));

        done();
    });

    it('lowerBound / upperBound', function(done) {
        let map = new TreeMap();
        for (let i = 1; i <= 16; ++i) {
            map.set(i * 2, `N${i}`);
        }
        let actual = [];
        let from = map.lowerBound(0);
        let to = map.upperBound(50);
        let it = to;
        while (!it.equals(from)) {
            it.prev();
            actual.push(it.key);
        }
        let expected = [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
        should.deepEqual(expected, actual);

        done();
    });

    it('insertUnique', function(done) {
        let m = new TreeMap();
        for (let i = 1; i < 4; ++i) {
            let res = m.insertUnique(1, `N${i}`);
            if (i === 1) {
                should.ok(res.wasAdded);
                should.ok(!res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
                should.strictEqual('N1', res.iterator.value);
            }
            else {
                should.ok(!res.wasAdded);
                should.ok(!res.wasReplaced);
            }
        }
        should.equal(1, m.size);

        done();
    });

    it('insertOrUpdate', function(done) {
        let m = new TreeMap();
        for (let i = 1; i < 4; ++i) {
            let res = m.insertOrReplace(1, `N${i}`);
            if (i === 1) {
                should.ok(res.wasAdded);
                should.ok(!res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
                should.strictEqual(`N${i}`, res.iterator.value);
            }
            else {
                should.ok(!res.wasAdded);
                should.ok(res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
                should.strictEqual(`N${i}`, res.iterator.value);
            }
        }
        should.equal(1, m.size);

        done();
    });

    it('erase', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        let it = map.find(2);
        it.prev();
        map.erase(it);
        let expected = '{2:B,3:C}';
        should.equal(expected, map.toString());
        map.delete(4);
        should.equal(expected, map.toString());

        done();
    });

    it('first / last', function(done) {
        let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
        should.strictEqual('A', map.first()[1]);
        should.strictEqual('C', map.last()[1]);

        done();
    });

    it('first / last; empty map', function(done) {
        let map = new TreeMap([]);
        should.strictEqual(undefined, map.first());
        should.strictEqual(undefined, map.last());

        done();
    });

});

/*global should TreeMultiSet*/
// When runing in the browser, then JStreeMap, Mocha and Should are already preloaded.
if (process) {
    // Running inside NodeJS
    let lib;
    if (process.env.DEV_TEST) {
        // Use source code
        lib = require('../../src/public/tree-multiset');
    }
    else {
        // use web-packed library
        lib = require('../../jstreemap');
    }
    // eslint-disable-next-line no-global-assign
    TreeMultiSet = lib.TreeMultiSet;
    require('should');
}

describe('TreeMultiSet tests', function() {

    it('constructor;', function(done) {
        let m = new TreeMultiSet();
        should.equal(0, m.size);

        done();
    });

    it('constructor; array literal', function(done) {
        let m = new TreeMultiSet([1, 2, 3, 1]);
        should.equal(4, m.size);

        let actual = [];
        for (let k of m) {
            actual.push(k);
        }

        let expected = [1, 1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('constructor; ES6 set', function(done) {
        let jsSet = new Set([2, 1, 3]);
        let m = new TreeMultiSet(jsSet);
        should.equal(3, m.size);

        let actual = [];
        for (let k of m) {
            actual.push(k);
        }

        let expected = [1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('constructor; generator function', function(done) {
        let gen = function*() {
            for (let i = 1; i < 4; ++i) {
                yield i;
                yield i;
            }
        };
        let m = new TreeMultiSet(gen());
        should.equal(6, m.size);

        let actual = [];
        for (let k of m) {
            actual.push(k);
        }

        let expected = [1, 1, 2, 2, 3, 3];
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

        let m = new TreeMultiSet();
        m.compareFunc = compareIds;
        m.add(new Id('B', 8));
        m.add(new Id('A', 340));
        m.add(new Id('A', 340));
        m.add(new Id('A', 12));
        m.add({alpha: 'AA', num: 147}); // create an ad-hoc object

        let actual = [];
        for (let k of m) {
            actual.push([k.alpha, k.num]);
        }
        let expected = [['A', 12], ['A', 340], ['A', 340], ['AA', 147], ['B', 8]];
        should.deepEqual(expected, actual);

        done();
    });

    it('constructor; invalid literal', function(done) {
        try {
            let m = new TreeMultiSet(35);
            should.fail('The error was not detected');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('iterable objects'), msg);
        }
        done();
    });

    it('constructor; null', function(done) {
        let m = new TreeMultiSet(null);
        should.equal(0, m.size);

        done();
    });

    it('constructor; null', function(done) {
        let m = new TreeMultiSet(undefined);
        should.equal(0, m.size);

        done();
    });

    it('toStringTag', function(done) {
        let expected = '[object TreeMultiSet]';
        let actual = Object.prototype.toString.call(new TreeMultiSet());
        should.strictEqual(expected, actual);

        done();
    });

    it('species; on object', function(done) {
        let set = new TreeMultiSet();
        let constrFunc = Object.getPrototypeOf(set).constructor[Symbol.species];
        let set2 = new constrFunc();
        should.ok(set2 instanceof TreeMultiSet);

        done();
    });

    it('species; on class', function(done) {
        let ctr = TreeMultiSet[Symbol.species];
        let actual = new ctr();
        should.ok(actual instanceof TreeMultiSet);

        done();
    });

    it('clear', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        set.clear();
        should.equal(0, set.size);

        done();
    });

    it('delete', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        set.delete(2);
        let expected = '{1,3}';
        should.equal(expected, set.toString());
        set.delete(4);
        should.equal(expected, set.toString());

        done();
    });

    it('entries', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        for (let key of set.entries()) {
            actual.push(key);
        }
        let expected = [1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('forEach', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        set.forEach(function(value, key, container) {
            actual.push([key, value]);
        });
        let expected = [[1, 1], [2, 2], [3, 3]];
        should.deepEqual(expected, actual);

        done();
    });

    it('has', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        should.equal(true, set.has(1));
        should.equal(false, set.has(4));

        done();
    });

    it('keys', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        for (let key of set.keys()) {
            actual.push(key);
        }
        let expected = [1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('values', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        for (let value of set.values()) {
            actual.push(value);
        }
        let expected = [1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        for (let key of set.backward()) {
            actual.push(key);
        }
        let expected = [3, 2, 1];
        should.deepEqual(expected, actual);

        done();
    });

    it('begin/end', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        for (let it = set.begin(); !it.equals(set.end()); it.next()) {
            actual.push(it.key);
        }
        let expected = [1, 2, 3];
        should.deepEqual(expected, actual);

        done();
    });

    it('rbegin/rend', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let actual = [];
        for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
            actual.push(it.key);
        }
        let expected = [3, 2, 1];
        should.deepEqual(expected, actual);

        done();
    });

    it('find', function(done) {
        let set = new TreeMultiSet([1, 2, 3]);
        let it = set.find(2);
        should.equal(2, it.key);

        it = set.find(4);
        should.ok(it.equals(set.end()));

        done();
    });

    it('lowerBound / upperBound', function(done) {
        let set = new TreeMultiSet();
        for (let i = 1; i <= 16; ++i) {
            set.add(i * 2, `N${i}`);
        }
        let actual = [];
        let from = set.lowerBound(0);
        let to = set.upperBound(50);
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
        let set = new TreeMultiSet();
        for (let i = 1; i < 4; ++i) {
            let res = set.insertUnique(1);
            if (i === 1) {
                should.ok(res.wasAdded);
                should.ok(!res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
            }
            else {
                should.ok(!res.wasAdded);
                should.ok(!res.wasReplaced);
            }
        }
        should.equal(1, set.size);

        done();
    });

    it('insertOrUpdate', function(done) {
        let set = new TreeMultiSet();
        for (let i = 1; i < 4; ++i) {
            let res = set.insertOrReplace(1);
            if (i === 1) {
                should.ok(res.wasAdded);
                should.ok(!res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
            }
            else {
                should.ok(!res.wasAdded);
                should.ok(res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
            }
        }
        should.equal(1, set.size);

        done();
    });

    it('insertMulti', function(done) {
        let set = new TreeMultiSet();
        for (let i = 1; i < 4; ++i) {
            let res = set.insertMulti(1);
            should.ok(res.wasAdded);
            should.ok(!res.wasReplaced);
            should.strictEqual(1, res.iterator.key);
        }
        should.equal(3, set.size);

        done();
    });

    it('erase', function(done) {
        let map = new TreeMultiSet([1, 2, 3]);
        let it = map.find(2);
        it.prev();
        map.erase(it);
        let expected = '{2,3}';
        should.equal(expected, map.toString());
        map.delete(4);
        should.equal(expected, map.toString());

        done();
    });

    it('first / last', function(done) {
        let set = new TreeMultiSet([1, 1, 2, 3, 3]);
        should.strictEqual(1, set.first());
        should.strictEqual(3, set.last());

        done();
    });

    it('first / last; empty set', function(done) {
        let set = new TreeMultiSet([]);
        should.strictEqual(undefined, set.first());
        should.strictEqual(undefined, set.last());

        done();
    });

});

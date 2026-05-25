const { performance } = require('perf_hooks');

const pool = Array.from({ length: 1000 }, (_, i) => ({ id: i, pattern: i % 2 === 0 ? 'Push' : 'Pull' }));
const pullCandidates = pool.filter(ex => ex.pattern === 'Pull');

function benchSpread() {
    return [...pool, ...pullCandidates, ...pullCandidates];
}

function benchConcat() {
    return pool.concat(pullCandidates, pullCandidates);
}

function benchPush() {
    const res = pool.slice();
    for (let i = 0; i < pullCandidates.length; i++) {
        res.push(pullCandidates[i], pullCandidates[i]);
    }
    return res;
}

function run(name, fn) {
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
        fn();
    }
    const end = performance.now();
    console.log(`${name}: ${end - start} ms`);
}

run('Spread', benchSpread);
run('Concat', benchConcat);
run('Push', benchPush);

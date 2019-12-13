const assert = require('assert');
const { puzzleInput, testInputs } = require('./input');

test();
console.log(solve(puzzleInput, 1000));
console.log(solve2(puzzleInput));

function solve(input, steps) {
    const planets = toPlanets(input);
    const pairs = toPairs(planets);

    for (let i = 0; i < steps; i++) {
        pairs.forEach(([p1, p2]) => applyGravities(p1, p2));
        planets.forEach(p => applyVelocities(p));
    }

    const totalEnergy = planets.map(p => getEnergy(p))
        .reduce((res, e) => res + e);

    return totalEnergy;
}

function solve2(input) {
    const planets = toPlanets(input);
    const pairs = toPairs(planets);
    const axisPeriods = [null, null, null];
    let steps = 0;

    while (axisPeriods.some(p => p === null)) {
        steps++;
        pairs.forEach(([p1, p2]) => applyGravities(p1, p2));
        planets.forEach(p => applyVelocities(p));

        for (let i = 0; i < 3; i++) {
            // When we reach zero velocity for the first time, it is half the period of reaching identical state.
            if (axisPeriods[i] === null && planets.every(p => p.velocities[i] === 0))
                axisPeriods[i] = steps * 2;
        }
    }

    return axisPeriodsLcm(...axisPeriods);
}

function getEnergy(planet) {
    const potential = planet.positions.map(p => Math.abs(p))
        .reduce((res, p) => res + p);
    const kinetic = planet.velocities.map(v => Math.abs(v))
        .reduce((res, v) => res + v);

    return potential * kinetic;
}

function applyVelocities(planet) {
    for (let i = 0; i < 3; i++) {
        planet.positions[i] += planet.velocities[i];
    }
}

function applyGravities(p1, p2) {
    for (let i = 0; i < 3; i++) {
        const p2Top1Velocity = Math.sign(p2.positions[i] - p1.positions[i]);
        p1.velocities[i] += p2Top1Velocity;
        p2.velocities[i] -= p2Top1Velocity;
    }
}

function axisPeriodsLcm(a, b, c) {
    return lcm(a, lcm(b, c));
}

function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function toPairs(planets) {
    const pairsMap = planets.reduce((map, planet) => {
        planets.filter(p => p.index !== planet.index).forEach(p => {
            const mapKey = [planet.index, p.index].sort((a, b) => a - b).join(',');
            if (!map.has(mapKey))
                map.set(mapKey, [planet, p]);
        });

        return map;
    }, new Map());

    return Array.from(pairsMap.values());
}

function toPlanets(input) {
    return input.split('\n')
        .map((l, index) => {
            const [posX, posY, posZ] = l.match(/-?\d+/gi).map(p => +p);
            const planet = {
                index,
                positions: [posX, posY, posZ],
                velocities: [0, 0, 0],
                history: []
            };
            return planet;
        });
}

function test() {
    testInputs.forEach(ti => assert(ti.answer === solve(ti.input, ti.steps)));
    testInputs.forEach(ti => assert(ti.answer2 === solve2(ti.input)));
    console.log('All tests passed successfully');
}
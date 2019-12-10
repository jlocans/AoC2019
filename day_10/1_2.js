const assert = require('assert');
const { puzzleInput, testInputs } = require('./input');
const ASTEROID = 'asteroid';
const EMPTY = 'empty';

test();
console.log(solve(puzzleInput));
console.log(solve2(puzzleInput));

function solve(input) {
    const bestAsteroid = getBestAsteroid(input);
    return bestAsteroid.los;
}

function solve2(input) {
    const bestAsteroid = getBestAsteroid(input);
    const targetsGroupedAndSorted = groupAndSortByAngle(bestAsteroid.otherAsteroids)
        .map(group => ({
            angle: group.angle,
            asteroids: sortByDistance(group.asteroids)
        }));
    let asteroidsShot = 0;
    let groupIndex = 0;
    let lastShotAsteroid;

    while (asteroidsShot < 200) {
        const group = targetsGroupedAndSorted[groupIndex];

        if (group) {
            const asteroid = group.asteroids.shift();

            if (asteroid) {
                lastShotAsteroid = asteroid;
                asteroidsShot++;
            }
        }

        groupIndex = groupIndex === targetsGroupedAndSorted.length - 1 ? 0 : groupIndex + 1;
    }

    return lastShotAsteroid.x * 100 + lastShotAsteroid.y;
}

function getBestAsteroid(input) {
    const space = toSpace(input);
    const asteroids = space.filter(space => space.type === ASTEROID);

    return asteroids.reduce((res, asteroid) => {
        const otherAsteroids = asteroids.filter(a => a.x !== asteroid.x || a.y !== asteroid.y)
            .map(a => ({
                x: a.x,
                y: a.y,
                angle: getAngle(asteroid, a),
                distance: getDistance(asteroid, a)
            }));

        // Direct line of sight to other asteroids
        const los = new Set(otherAsteroids.map(a => a.angle)).size;

        if (res.los > los)
            return res;

        return {
            x: asteroid.x,
            y: asteroid.y,
            otherAsteroids,
            los
        }
    }, { los: 0 });
}

function groupAndSortByAngle(asteroids) {
    return asteroids.reduce((res, asteroid) => {
        const group = res.find(g => g.angle === asteroid.angle) || {
            angle: asteroid.angle,
            asteroids: []
        };

        group.asteroids = group.asteroids.concat(asteroid);

        if (!res.some(g => g.angle === asteroid.angle))
            res = res.concat(group);

        return res
    }, [])
        .sort((a, b) => b.angle - a.angle);
}

function sortByDistance(asteroids) {
    return asteroids.sort((a, b) => a.distance - b.distance);
}

function getAngle(a, b) {
    const deltaX = b.x - a.x;
    const deltaY = a.y - b.y;
    // Transform all degrees to positive value (modulus part)
    // Set 90° as starting point (+ 270 part)
    // Return 360° if calculated degree is 0° for sorting purposes (|| 360 part)
    return (Math.atan2(deltaY, deltaX) * 180 / Math.PI + 270) % 360 || 360;
}

function getDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function toSpace(input) {
    return input.split('\n')
        .map((line, y) => line.split('')
            .map((symb, x) => ({
                type: symb === '.' ? EMPTY : ASTEROID,
                x,
                y
            }))
        )
        .reduce((acc, val) => acc.concat(val), [])
}

function test() {
    testInputs.forEach(ti => assert(ti.answer === solve(ti.input)));
    const lastTest = testInputs[testInputs.length - 1];
    assert(802 === solve2(lastTest.input));
    console.log('All tests passed successfully');
}
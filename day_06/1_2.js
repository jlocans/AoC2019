const assert = require('assert');
const puzzleInput = require('./input');
const testInput = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;
const testInput2 = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`;

test();
console.log(solve(puzzleInput));
console.log(solve2(puzzleInput));

function solve(input) {
    const objects = inputToObjects(input);
    const res = objects.map(o => getPathToCom(objects, o).pop().orbits)
        .reduce((res, val) => res + val);

    return res;
}

function solve2(input) {
    const objects = inputToObjects(input);
    const me = objects.find(o => o.childPlanetName === 'YOU');
    const santa = objects.find(o => o.childPlanetName === 'SAN');

    const myPathToCom = getPathToCom(objects, me);
    const santasPathToCom = getPathToCom(objects, santa);

    const firstMeetingPoint = myPathToCom.find(mp => santasPathToCom.some(sp => sp.destination === mp.destination));
    const santasStepsToMeetingPoint = santasPathToCom.find(sp => sp.destination === firstMeetingPoint.destination);

    return firstMeetingPoint.orbits + santasStepsToMeetingPoint.orbits;
}

function getPathToCom(objects, obj) {
    let orbits = 1;
    let parentObj = objects.find(o => o.childPlanetName === obj.planetName);
    const path = [{ orbits, destination: parentObj ? parentObj.planetName : null }];

    while (parentObj) {
        orbits++;
        parentObj = objects.find(o => o.childPlanetName === parentObj.planetName);
        path.push({ orbits, destination: parentObj ? parentObj.planetName : null });
    }

    return path;
}

function inputToObjects(input) {
    return input.split('\n')
        .map(x => {
            const [planetName, childPlanetName] = x.split(')');

            return {
                planetName,
                childPlanetName
            };
        });
}

function test() {
    assert(42 === solve(testInput));
    assert(4 === solve2(testInput2));

    console.log('All tests passed successfully');
}
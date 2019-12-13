exports.puzzleInput = `<x=-7, y=-8, z=9>
<x=-12, y=-3, z=-4>
<x=6, y=-17, z=-9>
<x=4, y=-10, z=-6>`;

exports.testInputs = [
    {
        input: `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`,
        steps: 10,
        answer: 179,
        answer2: 2772
    },
    {
        input: `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`,
        steps: 100,
        answer: 1940,
        answer2: 4686774924
    }
];
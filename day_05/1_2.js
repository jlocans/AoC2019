const puzzleInput = require('./input');
const opCode3Input1 = 1;
const opCode3Input2 = 5;

solve(opCode3Input1);
solve(opCode3Input2);

function solve(opCode3Input) {
    const intCode = toIntCode(puzzleInput);
    let index = 0;

    while (intCode[index] !== 99) {
        index = executeInstruction(intCode, index, opCode3Input);
    }
}

function executeInstruction(intCode, index, opCode3Input) {
    const opCode = getOpCode(intCode[index]);
    const rawInstruction = intCode[index].toString();

    const [param1, param2, targetAddr] = intCode.slice(index + 1, index + 4);
    const param1Mode = +rawInstruction[rawInstruction.length - 3] || 0;
    const param2Mode = +rawInstruction[rawInstruction.length - 4] || 0;
    const param1Val = !param1Mode ? intCode[param1] : param1;
    const param2Val = !param2Mode ? intCode[param2] : param2;

    switch (opCode) {
        case 1:
        case 2:
            intCode[targetAddr] = addOrMultiply(opCode, param1Val, param2Val);
            return index + 4;
        case 3:
            intCode[intCode[index + 1]] = opCode3Input;
            return index + 2;
        case 4:
            console.log(param1Val);
            return index + 2;
        case 5:
            return param1Val !== 0 ? param2Val : (index + 3);
        case 6:
            return param1Val === 0 ? param2Val : (index + 3);
        case 7:
            intCode[targetAddr] = param1Val < param2Val ? 1 : 0;
            return index + 4;
        case 8:
            intCode[targetAddr] = param1Val === param2Val ? 1 : 0;
            return index + 4;
        default:
            throw `Unsupported opCode: ${opCode}`;

    }

}

function addOrMultiply(opCode, param1, param2) {
    return opCode === 1
        ? param1 + param2
        : param1 * param2;
}

function getOpCode(instruction) {
    const instrString = instruction.toString();

    return instrString.length < 3
        ? instruction
        : +instrString[instrString.length - 1];
}

function toIntCode(input) {
    return input.split(',').map(x => +x);
}
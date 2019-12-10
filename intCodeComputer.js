class IntCodeComputer {
    constructor(input) {
        this.relativeBase = 0;
        this.intCode = toIntCode(input);
        this.pointer = 0;

        this.executeInstruction = function (opCode3Input) {
            const opCode = getOpCode(this.intCode[this.pointer]);
            const rawInstruction = this.intCode[this.pointer].toString();
            const [param1, param2, param3] = this.intCode.slice(this.pointer + 1, this.pointer + 4);
            const param1Mode = +rawInstruction[rawInstruction.length - 3] || 0;
            const param2Mode = +rawInstruction[rawInstruction.length - 4] || 0;
            const param3Mode = +rawInstruction[rawInstruction.length - 5] || 0;
            const [param1Val, param2Val, param3Val] = [
                this.getParamValue(param1Mode, param1),
                this.getParamValue(param2Mode, param2),
                this.getParamAddress(param3Mode, param3)
            ];

            switch (opCode) {
                case 1:
                case 2:
                    this.intCode[param3Val] = addOrMultiply(opCode, param1Val, param2Val);
                    this.pointer += 4;
                    return null;
                case 3:
                    const inputTargetAddr = this.getParamAddress(param1Mode, param1);
                    this.intCode[inputTargetAddr] = opCode3Input;
                    this.pointer += 2;
                    return null;
                case 4:
                    this.pointer += 2;
                    return param1Val;
                case 5:
                    this.pointer = param1Val !== 0 ? param2Val : (this.pointer + 3);
                    return null;
                case 6:
                    this.pointer = param1Val === 0 ? param2Val : (this.pointer + 3);
                    return null;
                case 7:
                    this.intCode[param3Val] = param1Val < param2Val ? 1 : 0;
                    this.pointer += 4;
                    return null;
                case 8:
                    this.intCode[param3Val] = param1Val === param2Val ? 1 : 0;
                    this.pointer += 4;
                    return null;
                case 9:
                    this.relativeBase += param1Val;
                    this.pointer += 2;
                    return null;
                default:
                    throw `Unsupported opCode: ${opCode}`;
            }
        };

        this.getParamValue = function (paramMode, param) {
            switch (paramMode) {
                case 0:
                    return this.intCode[param] || 0;
                case 1:
                    return param;
                case 2:
                    return this.intCode[this.relativeBase + param] || 0;
                default:
                    throw ("Unsupported param mode");
            }
        }

        this.getParamAddress = function (paramMode, param) {
            switch (paramMode) {
                case 0:
                    return param;
                case 1:
                    throw ("Unsupported address mode");
                case 2:
                    return this.relativeBase + param;
                default:
                    throw ("Unsupported address mode");
            }
        }
    }

    get mustHalt() {
        return this.intCode[this.pointer] === 99;
    }

    get opCode() {
        return getOpCode(this.intCode[this.pointer]);
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

module.exports = IntCodeComputer;
type IntcodeOperation = (a: number, b: number) => number
type IntcodeOperations = Record<number, IntcodeOperation>

const TERMINATOR = 99

const IntcodeComputer = (operations: IntcodeOperations) => {
    const init = (input: number[], verb: number, noun: number, output: number = 0) => {
        const ipt = [input[0], noun, verb, ...input.slice(3)]

        return execute(ipt)[output]
    }

    const execute = (input: number[], position = 0): number[] => {
        if (input[position] === TERMINATOR) return input

        const [opcode, a, b, o] = [input[position], input[input[position + 1]], input[input[position + 2]], input[position + 3]]

        return execute(input.map((value, i) => i === o ? operations[opcode](a, b) : value), position + 4)
    }

    return {execute: init}
}

const addOperation: IntcodeOperation = (a, b) => a + b
const multipleOperation: IntcodeOperation = (a, b) => a * b

export default IntcodeComputer({
    1: addOperation,
    2: multipleOperation
})

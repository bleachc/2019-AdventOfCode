import IntcodeComputer from "../IntcodeComputer";
import * as fs from 'fs'
import * as path from 'path'

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().split(',').map(x => parseInt(x))

console.log('Part 1: ', IntcodeComputer.execute(input, 12, 2))

const range = (num: number) => new Array(num).fill(0).map((_, i) => i)

for (let verb of range(99)) {
    for (let noun of range(99)) {
        if(IntcodeComputer.execute(input, verb, noun) === 19690720) {
            console.log('Part 2', (100 * noun) + verb)
            process.exit(0)
        }
    }
}

import * as fs from 'fs'
import * as path from 'path'

type Point = [number, number]
type Velocity = { x?: number, y?: number }

const wires = fs.readFileSync(path.join(__dirname, 'input.txt')).toString()
    .split('\n')
    .map(w => w.split(','))

const getInstructions = (directions: string): [string, number] => {
    const matches = directions.match(/(\w)(\d+)/)
    return [matches[1], parseInt(matches[2])]
}

const getNewPosition = (pos: Point, {x, y}: Velocity): [number, number] => x
    ? [pos[0] + x, pos[1]]
    : [pos[0], pos[1] + y]

const generatePoints = (pos: Point, {x, y}: Velocity) => x
    ? range(Math.abs(x)).map(s => `${pos[0] + (s * (x > 0 ? 1 : -1))},${pos[1]}`)
    : range(Math.abs(y)).map(s => `${pos[0]},${pos[1] + (s * (y > 0 ? 1 : -1))}`)

const range = (x) => new Array(x).fill(0).map((_, i) => i + 1)

const getCoordinates = (wire: string[], i: number = 0, pos: [number, number] = [0, 0], aggregate: Set<string> = null): Set<string> => {
    if (!aggregate) aggregate = new Set()
    if (i > wire.length || !wire[i]) return aggregate

    const [direction, steps] = getInstructions(wire[i])

    switch (direction) {
        case 'U':
            for (let point of generatePoints(pos, {x: steps})) aggregate.add(point)
            return getCoordinates(wire, i + 1, getNewPosition(pos, {x: steps}), aggregate)
        case 'D':
            for (let point of generatePoints(pos, {x: -steps})) aggregate.add(point)
            return getCoordinates(wire, i + 1, getNewPosition(pos, {x: -steps}), aggregate)
        case 'R':
            for (let point of generatePoints(pos, {y: steps})) aggregate.add(point)
            return getCoordinates(wire, i + 1, getNewPosition(pos, {y: steps}), aggregate)
        case 'L':
            for (let point of generatePoints(pos, {y: -steps})) aggregate.add(point)
            return getCoordinates(wire, i + 1, getNewPosition(pos, {y: -steps}), aggregate)
    }
}

const calculateManhattanDistance = (point: string) => {
    const [x, y] = point.split(',').map(x => parseInt(x))
    return Math.abs(x) + Math.abs(y)
}

const wiresCoordinates = wires.map(w => getCoordinates(w))
const intersections = new Set(Array.from(wiresCoordinates[0]).filter(x => wiresCoordinates[1].has(x)))
const distances = Array.from(intersections).map(x => calculateManhattanDistance(x))

console.log('Part 1', Math.min(...distances))

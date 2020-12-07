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

const getNewPosition = (pos: Point, {x, y}: Velocity): Point => x
    ? [pos[0] + x, pos[1]]
    : [pos[0], pos[1] + y]

const generatePoints = (pos: Point, {x, y}: Velocity): Point[] => x
    ? range(Math.abs(x)).map(s => [pos[0] + (s * (x > 0 ? 1 : -1)), pos[1]])
    : range(Math.abs(y)).map(s => [pos[0], pos[1] + (s * (y > 0 ? 1 : -1))])

const range = (x) => new Array(x).fill(0).map((_, i) => i + 1)

const getCoordinates = (wire: string[], i: number = 0, pos: [number, number] = [0, 0], aggregate: Point[] = []): Point[] => {
    if (!aggregate) aggregate = [] as Point[]
    if (i > wire.length || !wire[i]) return aggregate

    const [direction, steps] = getInstructions(wire[i])

    switch (direction) {
        case 'U':
            return getCoordinates(wire, i + 1, getNewPosition(pos, {x: steps}), [...aggregate, ...generatePoints(pos, {x: steps})])
        case 'D':
            return getCoordinates(wire, i + 1, getNewPosition(pos, {x: -steps}), [...aggregate, ...generatePoints(pos, {x: -steps})])
        case 'R':
            return getCoordinates(wire, i + 1, getNewPosition(pos, {y: steps}), [...aggregate, ...generatePoints(pos, {y: steps})])
        case 'L':
            return getCoordinates(wire, i + 1, getNewPosition(pos, {y: -steps}), [...aggregate, ...generatePoints(pos, {y: -steps})])
    }
}

const toPoint = (point: string): Point => {
    const [x, y] = point.split(',').map(x => parseInt(x))
    return [x, y]
}

const calculateManhattanDistance = (point: string) => {
    const [x, y] = toPoint(point)
    return Math.abs(x) + Math.abs(y)
}

const wirePaths = wires.map(w => getCoordinates(w))
const visited = wirePaths.map(_ => new Set(_.map(([x, y]) => `${x},${y}`)))
const intersections = new Set(Array.from(visited[0]).filter(x => visited[1].has(x)))
const intersectionDistances = Array.from(intersections).map(x => calculateManhattanDistance(x))

console.log('Part 1', Math.min(...intersectionDistances))

// Solution if recursion depth not exceeded
// const calculateStepDistance = ([x, y]: Point, path: Point[], i = 0): number => x === path[i][0] && y === path[i][1]
//     ? i
//     : calculateStepDistance([x, y], path, i + 1)
// const stepDistances = Array.from(intersections).map(toPoint).map(p => calculateStepDistance(p, wirePaths[0]) + calculateStepDistance(p, wirePaths[1]))

const calculateStepDistance = (target: Point, path: Point[]): number => {
    const [x, y] = target
    for (let i = 0; i < path.length; i++) if (path[i][0] === x && path[i][1] === y) return i + 1
    throw new Error('Target not found')
}

const stepDistances = Array.from(intersections).map((intersect) => {
    const target = toPoint(intersect)
    const distances = wirePaths.map(path => calculateStepDistance(target, path))
    return distances.reduce((acc, val) => acc + val)
})

console.log('Part 2', Math.min(...stepDistances))

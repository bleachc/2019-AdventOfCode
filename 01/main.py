import re
import math


def get_fuel_needed(mass: int):
    return math.floor(mass / 3) - 2


def recursive_get_fuel_needed(mass: int, aggregate: list = None):
    if not aggregate:
        aggregate = [mass]
    req = get_fuel_needed(mass)
    return math.fsum(aggregate) if req < 0 else recursive_get_fuel_needed(req, [*aggregate, req])


if __name__ == '__main__':
    f = open('./input.txt')
    modules = [int(m) for m in re.findall(r'\d+', f.read())]

    module_fuel = [get_fuel_needed(m) for m in modules]
    print('Part 1', math.fsum(module_fuel))

    fuel_fuel = [recursive_get_fuel_needed(m) for m in module_fuel]
    print('Part 2', math.fsum(fuel_fuel))

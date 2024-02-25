export type Pt = [number, number]
export type Grid = number[][]

export const adjSet: Pt[] = [
    [-1, 0],
    [+1, 0],
    [0, -1],
    [0, +1]
];

export const compassSet = {
    "N": [-1, 0],
    "S": [+1, 0],
    "W": [0, -1],
    "E": [0, +1]
};

export const dirSet = {
    "U": [-1, 0],
    "D": [+1, 0],
    "L": [0, -1],
    "R": [0, +1]
};


function clamp(val:number, min:number, max:number): number {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

export function shiftPoint(point: Pt, shift: Pt): Pt {
    return [
        point[0] + shift[0],
        point[1] + shift[1]
    ];
}

export function shiftPointInGrid(grid: Grid, point: Pt, shift: Pt): Pt {
    let maxY = grid.length - 1;
    let maxX = grid[point[0]].length - 1;
    return [
        clamp(point[0] + shift[0], 0, maxY),
        clamp(point[1] + shift[1], 0, maxX)
    ];
}

export function getAdjacent(point: Pt, grid?: Grid): Pt[] {
    if (grid === undefined || !Array.isArray(grid))
        return adjSet.map(s => shiftPoint(point, s));
    else
        return adjSet.map(s => shiftPoint(point, s))
            .filter(p => p[0] >= 0 && p[1] >= 0 && p[0] < grid.length && p[1] < grid[0].length);
};

export function getAdjacentInGrid(grid: Grid, point: Pt): Pt[] {
    return adjSet.map(s => shiftPointInGrid(grid, point, s));
};

const surroundSet: Pt[] = [
    [-1, -1],
    [-1, 0],
    [-1, +1],

    [0, -1],
    // [0, 0],
    [0, +1],

    [+1, -1],
    [+1, 0],
    [+1, +1],
];

export function getSurrounding(point: Pt): Pt[] {
    return surroundSet.map(s => shiftPoint(point, s));
};

export function getSurroundingInGrid(grid: Grid, point: Pt) {
    return surroundSet.map(s => shiftPointInGrid(grid, point, s));
};

export function rotateGrid(grid: Grid, rotation: number) {
    if (rotation > 90) {
        grid = rotateGrid(grid, rotation - 90);
    }
    return grid[0].map((c, cidx) => grid.map((row, ridx) => grid[grid.length - ridx - 1][cidx]));
}

// assumes grid is in z, y, x format
export function printSpace(grid: Grid) {
    console.log(grid.map(r => r.join("")).join("\n  "))
}


/**
 * Flip the 2D frame on the Y dimension, left becomes right, top and bottom are reversed, and right becomes left.
 * 
 * @param {*} frame 
 * @returns 
 */
export function flipFrameY(frame) {
    return {
        tile: frame.tile,
        top: frame.top.split("").reverse().join(""),
        bottom: frame.bottom.split("").reverse().join(""),
        left: frame.right,
        right: frame.left,
        matches: []
    };
}

/**
 * Flip the 2D frame on the X dimension, top becomes bottom, left and right are reversed, and bottom becomes top.
 * 
 * @param {*} frame 
 * @returns 
 */
function flipFrameX(frame) {
    return {
        tile: frame.tile,
        top: frame.bottom,
        bottom: frame.top,
        left: frame.left.split("").reverse().join(""),
        right: frame.right.split("").reverse().join(""),
        mid: frame.mid.map((row, ridx) => frame.mid[frame.mid.length - 1 - ridx]),
        full: frame.full.map((row, ridx) => frame.full[frame.full.length - 1 - ridx]),
        matches: []
    };
}


/**
 * Rotate the 2D frame by degrees, 90, 180, or 270
 * @param {*} frame 
 * @param {*} rotation 
 */
function rotateFrame(frame, rotation) {
    if (rotation > 90) {
        frame = rotateFrame(frame, rotation - 90);
    }
    return {
        tile: frame.tile,
        top: frame.left.split("").reverse().join(""),
        bottom: frame.right.split("").reverse().join(""),
        left: frame.bottom,
        right: frame.top,
        mid: frame.mid.map((row, idx) => row.map((c, cidx) => frame.mid[row.length - cidx - 1][idx])),
        full: frame.full.map((row, idx) => row.map((c, cidx) => frame.full[row.length - cidx - 1][idx])),
        matches: []
    };
}


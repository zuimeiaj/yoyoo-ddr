import Matrix from './Matrix'

export const pointMap = {
    br : 0,
    tr : 3,
    tl : 2,
    bl : 1,
    tm : 2, bm : 0, l : 1, r : 3
}
export const widthMap = {
    l : 1, r : 1
}
export const heightMap = {
    tm : 1, bm : 1
}
export const tr2bl = {
    tr : 1,
    bl : 1,
    r : 1,
    l : 1
}

export function deg2rad(deg){
    return deg * Math.PI / 180
}

export function rad2deg(rad){
    return rad * 180 / Math.PI
}

export function getPoints({x, y, width, height, rotation}){
    let a = rotation * Math.PI / 180
    let wc = width / 2
    let hc = height / 2
    let deg = new Matrix([[Math.cos(a), Math.sin(a)], [-Math.sin(a), Math.cos(a)]])
    let rect = new Matrix([
        [-wc, hc],
        [wc, hc],
        [wc, -hc],
        [-wc, -hc]
    ])
    return deg.dot(rect.T()).T().valueOf().map(item=>{
        return {x : item[0] + wc + x, y : -(item[1] - hc) + y}
    })
}

export function getSize({type, x, y, dis, ratio, pressAngle, startAngle, currentRatio}){
    let w, h
    let currentAngle = rad2deg(Math.atan2(y, x))
    let rad = deg2rad(pressAngle + currentAngle - startAngle)
    if(tr2bl[type]) {
        h = Math.cos(rad) * dis
        w = Math.sin(rad) * dis
    } else {
        h = Math.sin(rad) * dis
        w = Math.cos(rad) * dis
    }
    if(ratio) {
        if(widthMap[type]) {
            h = w / currentRatio
        } else if(heightMap) {
            w = h * currentRatio
        }
    }
    return {w, h}
}

const cursorMap = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const handlerMap = {'tl' : 0, 'tm' : 1, 'tr' : 2, 'r' : 3, 'br' : 4, 'bm' : 5, 'bl' : 6, 'l' : 7}

export function getHandler(type, rotation){
    let originIndex = handlerMap[type]
    let currentIndex = (originIndex + Math.floor(rotation / 45)) % 8
    return cursorMap[currentIndex]
}
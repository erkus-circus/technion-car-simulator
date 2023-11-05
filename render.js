// the canvas a rendering context
var canvas = document.getElementById("canvas")
var c = canvas.getContext("2d")

// TODO: deprecated will be removed
var globalOriginVector = new Vector(0, 0)
var globalOriginCoords = Coord.FromVector(globalOriginVector)

// the viewport coordinates. for following the path of an object
var viewCoords = new Coord(0, 0)
canvas.width = window.innerWidth
canvas.height = window.innerHeight 




// draws a grid so it is easier to see an objects motion
function drawGrid(space=1) {
    c.beginPath()
    
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(viewCoords.x, viewCoords.y)
    c.strokeStyle = "gray"
    c.lineWidth = 1
    for (let Y = 0 - viewCoords.y; Y < canvas.height - viewCoords.y; Y += space) {
        for (let X = 0 - viewCoords.x; X < canvas.width - viewCoords.x; X += space) {
            c.strokeRect(X, Y, space, space)
        }
    }
}

// draws a dot on the screen at a certain point
function drawPoint(x, y, color="black") {
    c.beginPath()
    
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(viewCoords.x, viewCoords.y)
    c.fillStyle = color
    c.fillRect(x, canvas.height - y, 10, 10)
}

// draws a vector with its magnitude in pixels from the origin
function drawVector(vector, color="black", origin=globalOriginVector, width) {
    c.beginPath()
    
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(viewCoords.x, viewCoords.y)
    c.lineWidth = width
    c.strokeStyle = color;
    origin = Coord.FromVector(origin)
    c.moveTo(origin.x, canvas.height - origin.y)
    var x = -vector.getXComponent()
    var y = vector.getYComponent()

    c.lineTo(origin.x - x, canvas.height - y - origin.y)
    c.stroke()
}

// draws the statistics of an object
function drawObjectStats(p, v, a) {
    var {x, y} = Coord.FromVector(p)
    y = canvas.height - y;
    c.beginPath()
    
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(viewCoords.x, viewCoords.y)
    c.font = "bold 30px serif";
    c.fillText("Pos: " + p.readable() + ", V: " + v.readable() + ", a: " + a.readable(), x, y)
}

// draws an object with its mass as the radius
function drawObj(object, fill=true) {
    c.beginPath()
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(viewCoords.x, viewCoords.y)
    c.fillStyle = `rgb(${210 - object.mass * .000000000001},${210 - object.mass * .000000001},${210 - object.mass * .000001})`
    c.lineWidth = 5
    c.strokeStyle = object.color
    var {x, y} = Coord.FromVector(object.pos)
    c.arc(x, canvas.height - y, Math.sqrt(object.mass / Math.PI) * scale, 0, 2 * Math.PI);
    if(fill) {
        c.fill()
    } else {
        c.stroke()
    }
    drawVector(object.v.multiplyByScalar(25), "green", object.pos)
    drawVector(object.a.multiplyByScalar(100), "red", object.pos)
    
    
}

function renderMouse() {
    let obj = new Obj("black", mouseVector, initialVelocity, new Vector(0, 0), size)
    drawObj(obj, false)
}

// draws a vector at location v
function drawVectorStat(v, color) {
    var {x, y} = Coord.FromVector(v)
    y = canvas.height - y;
    c.beginPath()
    
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(viewCoords.x, viewCoords.y)
    c.strokeStyle = color
    c.font = "bold 30px serif";
    c.fillText(v.readable(), x, y)
}
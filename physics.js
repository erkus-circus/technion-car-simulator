

// a coordinate in the XY plane
class Coord {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // converts a Vector into a coordinate
    static FromVector(vector) {
        return new Coord(vector.getXComponent(), vector.getYComponent())
    }

    static DistanceFrom(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }
}

// vectors
class Vector {
    // direction is in radians
    constructor(magnitude, direction) {
        this.magnitude = magnitude;
        this.direction = direction;
    }


    toString() {
        return `<${this.magnitude}, ${this.direction}>`
    }

    // returns a unit vector
    // maintains direction but has a magnitude of 1
    unit() {
        return new Vector(1, this.direction)
    }

    // returns a new vector with its magnitude multiplied by s
    multiplyByScalar(s) {
        return new Vector(this.magnitude * s, this.direction)
    }

    // returns a new vector with its magnitude multiplied by s
    power(p) {
        return new Vector(Math.pow(this.magnitude, p), this.direction)
    }

    // returns the vector but the direction is in degrees instead of radians
    toDegrees() {
        return new Vector(Math.floor(this.magnitude), Math.floor(this.direction * 180 / Math.PI)).toString()
    }

    // returns the vector but the direction is in radians instead of degrees
    toRadians() {
        return new Vector(Math.floor(this.magnitude), Math.floor(this.direction / 180 * Math.PI)).toString()
    }

    // returns the X component of the vector
    getXComponent() {
        return this.magnitude * Math.cos(this.direction)
    }

    // returns the Y component of the vector
    getYComponent() {
        return this.magnitude * Math.sin(this.direction)
    }


    // is the magnitude 0 or Nan?
    isNull() {
        return this.magnitude == 0
    }

    isNaN() {
        return Number.isNaN(this.magnitude)

    }

    // returns a new vector but pointing in the other direction
    negative() {
        return new Vector(this.magnitude, this.direction + Math.PI)
    }

    // adds two vectors, with the magnitude of b being multiplied by scale
    static Add(a, b, scale = 1) {
        if (a.isNull() || a.isNaN()) {
            return b;
        } else if (b.isNull() || b.isNaN()) {
            return a;
        }

        var xComponent = a.getXComponent() + b.getXComponent() * scale
        var yComponent = a.getYComponent() + b.getYComponent() * scale
        var combined = Math.sqrt(Math.pow(xComponent, 2) + Math.pow(yComponent, 2))
        var dir = Math.atan2(yComponent, xComponent);

        return new Vector(combined, dir);
    }

    // subtracts two vectors, with the magnitude of b being multiplied by scale
    static Subtract(a, b, scale = 1) {
        return Vector.Add(a, b.negative(), scale)
    }

    static DotProduct(a, b) {
        let theta = Vector.Subtract(a, b).direction
        return a.magnitude * b.magnitude * Math.cos(theta)
    }

    // converts a Coord into a vector, relative to relativeTo
    static FromCoord(coord, relativeTo = new Coord(0, 0)) {
        var dir = Math.atan2((coord.y - relativeTo.y), (coord.x - relativeTo.x)) || 0
        var mag = Math.sqrt(Math.pow(coord.y - relativeTo.y, 2) + Math.pow(coord.x - relativeTo.x, 2))

        return new Vector(mag, dir)
    }
}

class Force extends Vector {
    constructor(acceleration, dir, mass) {
        // F = ma
        super(acceleration * mass, dir)
        this.mass = mass;
        this.a = acceleration
    }

    // for summing up the external forces on an object
    static Sum (forces) {
        let res = new Vector(0, 0)
        forces.forEach((f) => {
            res = Vector.Add(res, f)
        })
        console.log(res);
    }
}

// an object in the world
// contains every attribute an object could have, then children of this class can have their own properties.
class Obj {
    constructor(color, initialPosVector, inititalVelocity, initialAcceleration, mass = 1, forces=[], jerk = new Vector(0, 0)) {
        // the color of the object
        this.color = color
        // the mass of the object
        this.mass = mass
        // the change in acceleration of the object {Vector}
        this.jerk = jerk
        // the initial position (for calculating displacement)
        this.posInitial = initialPosVector
        // the position of the object {Vector}
        this.pos = initialPosVector
        // the velocity of the object {Vector}
        this.v = inititalVelocity
        // the acceleration of the object {Vector}
        this.a = initialAcceleration
        // the forces acting on the object
        this.forces = forces
    }

    // sets the displacement to zero.
    resetDisplacement() {
        this.posInitial = this.pos;
    }

    // gets its displacement
    displacement() {
        return Vector.Subtract(this.pos, this.posInitial)
    }

    // returns the kinetic energy of the object
    kineticEnergy() {
        return .5 * this.mass * Math.pow(this.v.magnitude, 2)
    }

    // updates the acceleration, velocity, & position of the object with respect to delta time
    // calculates the acceleration on the object from all of the forces
    update(dt) {
        this.a = Vector.Add(this.a, this.jerk, dt)
        this.v = Vector.Add(this.v, this.a, dt)
        this.pos = Vector.Add(this.pos, this.v, dt);
    }

    // draws the object and other information on the screen
    render(dt) {
        var { x, y } = Coord.FromVector(this.pos)
        drawObj(this)
    }
}

// all of the objects in the universe
var objects = []

// world settings:

// framerate
const fps = 1000 / 60;
// deltatime
let dt = 0;
// for calculating dt
let lastTime = performance.now();
// speed of the world
var speed = 1
// the position of the mouse
let mouseVector;
// the scale of the canvas
let scale = 1

window.addEventListener("load", () => mouseVector = globalOriginVector)
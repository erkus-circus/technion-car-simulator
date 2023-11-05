

// the size of each new ball to be spawned
let size = 1000
// the initial velocity settings for a new ball
let initialVelocity = new Vector(0, 0)

// the gravitational constant should be 10x10^-11, but that is not strong enough here
// larger values mean more gravity in the universe
var G = 6.6743 * Math.pow(10, -3)


// the speed at which the user is able to scroll using the arrow keys
let scrollSpeed = 20



window.onload = () => {
    // the game loop
    setInterval(() => {

        // reset the transformation
        c.setTransform(1, 0, 0, 1, 0, 0);
        // clear the screen every frame
        c.clearRect(0, 0, canvas.width, canvas.height)
        // draw the grid
        drawGrid(50)

        // calculate delta time
        time = performance.now()
        dt = (time - lastTime) / fps * speed
        if (speed != 0) {


            // update and render the objects
            objects.forEach((obj, i) => {
                if (obj.mass <= 0) {
                    objects.splice(i, 1)
                }
                obj.update(dt)
            })

            // calculate the gravity of all objects
            // the old way:
            for (let i = 0; i < objects.length; i++) {
                var totalAcceleration = new Vector(0, 0)

                for (let j = 0; j < objects.length; j++) {
                    // an object compared with itself has infinite gravity
                    if (i == j) {
                        continue
                    }



                    // calculate the gravity of each object towards each other one
                    var gravityVector = Vector.Subtract(objects[j].pos, objects[i].pos)
                    gravityVector.magnitude = G * ((objects[i].mass * objects[j].mass) / Vector.Subtract(objects[i].pos, objects[j].pos).power(2).magnitude)
                    drawVector(Vector.FromCoord(gravityVector), "pink", objects[i].pos, gravityVector.magnitude)
                    // drawVector(gravityVector.multiplyByScalar(500), "red", objects[i].pos)
                    // detect collision:
                    // first get positions of both objects in the coordinate plane
                    let obj1Pos = Coord.FromVector(objects[i].pos)
                    let obj2Pos = Coord.FromVector(objects[j].pos)
                    // second, get the distance between both of the points
                    let d = Coord.DistanceFrom(obj1Pos, obj2Pos)
                    // the maximum distance is both of the objects radiuses
                    let maxD = Math.sqrt(objects[i].mass / Math.PI) + Math.sqrt(objects[j].mass / Math.PI)

                    // Collision Logic: TODO: Help!
                    if (d <= maxD && objects[i].mass <= objects[j].mass) {
                        // switch direction
                        // TODO: is this correct? should the direction be accounted for in here?
                        if (objects[i].v.magnitude > 40 || objects[j].v.magnitude > 40 || d + .1 * Math.sqrt(objects[j].mass / Math.PI) <= maxD) {
                            objects[j].mass += objects[i].mass
                            objects[j].v.magnitude = 0
                            objects[i].mass = 0
                            continue
                        }
                        continue
                    } else {
                        totalAcceleration = Vector.Add(totalAcceleration, gravityVector.negative())
                    }

                }

                // set the final gravity
                objects[i].a = totalAcceleration.multiplyByScalar(1 / objects[i].mass).negative()
                // drawVector(totalAcceleration.negative(), "red", objects[i].pos, totalAcceleration.magnitude * .5) 
            }
        }

        /**
         * Controls:
         * Arrows: Look Around
         * M: Increase size of object
         * N: Decrease size of object
         * +: Increase initital velocity of object
         * -: Decrease initital velocity of object
         * Z: Rotate initial velocty counter-clockwise
         * X: Rotate initial velocty clockwise
         * Space: Pause
         * L: Increase gravity (by magnitudes of 2)
         * L: Decrease gravity (by magnitudes of 2)
         * D: Scale screen up
         * S: Scale screen down
         * G: Increase scroll speed
         * F: Decrease scroll speed
         * H: Reset View
         */
        // keypresses:
        if (keysPressed.indexOf("ArrowUp") >= 0) {
            viewCoords.y += scrollSpeed
        }
        if (keysPressed.indexOf("ArrowDown") >= 0) {
            viewCoords.y -= scrollSpeed
        }
        if (keysPressed.indexOf("ArrowLeft") >= 0) {
            viewCoords.x += scrollSpeed
        }
        if (keysPressed.indexOf("ArrowRight") >= 0) {
            viewCoords.x -= scrollSpeed
        }
        if (keysPressed.indexOf("KeyM") >= 0) {
            size *= 1.06
        }
        if (keysPressed.indexOf("KeyN") >= 0) {
            size /= 1.06
        }
        if (keysPressed.indexOf("Equal") >= 0) {
            if (!initialVelocity.magnitude) {
                initialVelocity.magnitude += 1
            }
            initialVelocity.magnitude *= 1.04
        }
        if (keysPressed.indexOf("Minus") >= 0) {
            initialVelocity.magnitude /= 1.04
        }
        if (keysPressed.indexOf("KeyZ") >= 0) {
            initialVelocity.direction += .05
        }
        if (keysPressed.indexOf("KeyX") >= 0) {
            initialVelocity.direction -= .05
        }
        if (keysPressed.indexOf(" ") >= 0) {
            speed = !speed
            // so it doesnt randomly unpause
            keysPressed.splice(keysPressed.indexOf(" "), 1)
        }
        if (keysPressed.indexOf("KeyL") >= 0) {
            G *= 2
            // so it doesnt randomly unpause
            keysPressed.splice(keysPressed.indexOf("KeyL"), 1)
        }
        if (keysPressed.indexOf("KeyK") >= 0) {
            G /= 2
            // so it doesnt randomly unpause
            keysPressed.splice(keysPressed.indexOf("KeyK"), 1)
        }
        if (keysPressed.indexOf("KeyD") >= 0) {
            scale *= 1.1
        }
        if (keysPressed.indexOf("KeyS") >= 0) {
            scale /= 1.1
        }
        if (keysPressed.indexOf("KeyG") >= 0) {
            scrollSpeed *= 1.04
        }
        if (keysPressed.indexOf("KeyF") >= 0) {
            scrollSpeed /= 1.04
        }
        if (keysPressed.indexOf("KeyH") >= 0) {
            viewCoords.x = 0
            viewCoords.y = 0
        }

        
        

        objects.forEach((obj) => {
            obj.render(dt)
        })

        // render the mouse circle
        renderMouse(mouseVector, initialVelocity)

        // for calculating delta time
        lastTime = time
    }, fps)
}

// to monitor which keys are pressed
var keysPressed = []
window.addEventListener("keydown", (e) => {
    if (keysPressed.indexOf(e.key) == -1) {
        keysPressed.push(e.key)
        keysPressed.push(e.code)
    }
})

window.addEventListener("keyup", (e) => {
    if (keysPressed.indexOf(e.key) >= 0) {
        keysPressed.splice(keysPressed.indexOf(e.key), 1)
    }
    if (keysPressed.indexOf(e.code) >= 0) {
        keysPressed.splice(keysPressed.indexOf(e.code), 1)
    }

    if (e.key == "Space") {
        speed = !speed
    }
})

// when the mouse is moved, update the mouseVector
window.onmousemove = (e) => {
    viewCoords.x *= -1
    mouseVector = Vector.Add(Vector.FromCoord(new Coord(e.clientX, window.innerHeight - e.clientY)), Vector.FromCoord(viewCoords))
    viewCoords.x *= -1
}

window.onclick = (e) => {
    var newObj = new Obj("black", mouseVector, initialVelocity.negative().negative(), new Vector(0, 0), size)
    objects.push(newObj)
}
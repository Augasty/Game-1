
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
const gravity = 1.5

let currentkey
//player sprites
const standright = new Image()
standright.src = './img/spriteStandRight.png'
const standleft = new Image()
standleft.src = './img/spriteStandLeft.png'
const runright = new Image()
runright.src = './img/spriteRunRight.png'
const runleft = new Image()
runleft.src = './img/spriteRunLeft.png'

class Player { //properties of the player
    constructor() {
        this.speed = 10
        this.jump = 25
        this.position = { //position of player
            x: 100,
            y: 100
        }
        this.velocity = { // falling velocity of player
            x: 0,
            y: 0
        }
        this.width = 66 //size of 
        this.height = 150 // player
        this.frames = 0
        this.sprites = {
            stand: {
                right: standright,
                left: standleft,
                cropwidth: 177,
                width: 66
            },
            run: {
                right: runright,
                left: runleft,
                cropwidth: 341,
                width: 127.875
            }
        }
        this.currentsprite = this.sprites.stand.right
        this.currentcropwidth = 177
    }

    draw() { //color and shape of the player
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.currentsprite,
            this.currentcropwidth * this.frames, 0, this.currentcropwidth, 400, // read about the drawimage function and draw function
            this.position.x, this.position.y, this.width, this.height)
    }
    update() {  //changes the falling velocity of the player
        this.frames += 1
        if (this.frames > 59 && (this.currentsprite === this.sprites.stand.right || this.currentsprite === this.sprites.stand.left)) this.frames = 0
        else if (this.frames > 28 && (this.currentsprite === this.sprites.run.right || this.currentsprite === this.sprites.run.left)) this.frames = 0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        }
        // else this.velocity.y = 0;
    }

}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw() {
        // c.fillStyle = "blue"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw() {

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


//to restart after loosing or manual restart



//OBJECTS
let player = new Player(); //player object
let platforms = []; //platforms
let genericobject = []
let hills = []
let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0 //distance covered by player
function init() {
    const platformlength = 578;
    const smallplatformlength = 289;
    player = new Player(); //player object

    //import images
    const bgimage = new Image()
    bgimage.src = './img/background.png'
    const hillimage = new Image()
    hillimage.src = './img/hills.png'
    const platformimage = new Image()
    platformimage.src = './img/platform.png'
    const smallplatformimage = new Image()
    smallplatformimage.src = './img/platformSmallTall.png'

    //objects
    platforms = [new Platform({ x: platformlength * 4 + 300 - smallplatformlength, y: 270, image: smallplatformimage }), new Platform({ x: platformlength * 6 + 300 - smallplatformlength, y: 270, image: smallplatformimage }), new Platform({ x: platformlength * 8 + 750 - smallplatformlength, y: 270, image: smallplatformimage }),

    new Platform({ x: -1, y: 470, image: platformimage }), new Platform({ x: platformlength - 1, y: 470, image: platformimage }), new Platform({ x: platformlength * 2 + 150, y: 470, image: platformimage }), new Platform({ x: platformlength * 3 + 150, y: 470, image: platformimage }), new Platform({ x: platformlength * 4 + 150, y: 470, image: platformimage }), new Platform({ x: platformlength * 5 + 300, y: 470, image: platformimage }), new Platform({ x: platformlength * 6 + 750, y: 470, image: platformimage }), new Platform({ x: platformlength * 7 + 750, y: 470, image: platformimage }), new Platform({ x: platformlength * 8 + 1200, y: 470, image: platformimage })]; //platforms

    genericobject = [new GenericObject({ x: -1, y: -1, image: bgimage })]

    hills = [new GenericObject({ x: 0, y: 10, image: hillimage })]
    scrollOffset = 0
}
function animate() { //this function animates frame by frame
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height) //this line cleans the animations from the previous frame
    genericobject.forEach((genericobject) => { //animates background
        genericobject.draw()
    })
    hills.forEach((hills) => { //animates background
        hills.draw()
    })
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()
    if (keys.right.pressed && player.position.x < 500) {  //player movement
        player.velocity.x = player.speed
    }
    else if (keys.left.pressed && player.position.x > 100 || keys.left.pressed && scrollOffset === 0 & player.position.x > 0) {
        player.velocity.x = -player.speed
    }
    else {
        platforms.forEach((platform) => {
            player.velocity.x = 0
            //platform movement
            if (keys.right.pressed) {
                platform.position.x -= player.speed
                hills.forEach((hills) => {
                    hills.position.x -= player.speed * 0.20
                })
                scrollOffset += player.speed
            }
            else if (keys.left.pressed && scrollOffset > 0) {
                platform.position.x += player.speed
                hills.forEach((hills) => {
                    hills.position.x += player.speed * 0.20
                })
                scrollOffset -= player.speed
            }
        })

        if (scrollOffset > 20000) { //winning criteria
            console.log("You won")
            //init()
        }
        else {
            console.log(scrollOffset)
        }

        //lose condition
        if (player.position.y > canvas.height) {
            console.log("you lose")
            init()
        }
    }



    //platform hitbox
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })


    if (
        keys.right.pressed && currentkey === 'right' && player.currentsprite !== player.sprites.run.right
    ) {
        player.frames = 1
        player.currentsprite = player.sprites.run.right
        player.currentcropwidth = player.sprites.run.cropwidth
        player.width = player.sprites.run.width
    }
    else if (keys.left.pressed && currentkey === 'left' && player.currentsprite !== player.sprites.run.left) {
        player.frame = 1
        player.currentsprite = player.sprites.run.left
        player.currentcropwidth = player.sprites.run.cropwidth
        player.width = player.sprites.run.width
    }
    else if (!keys.left.pressed && currentkey === 'left' && player.currentsprite !== player.sprites.run.left) {
        player.frame = 1
        player.currentsprite = player.sprites.stand.left
        player.currentcropwidth = player.sprites.stand.cropwidth
        player.width = player.sprites.stand.width
    }
    else if (!keys.right.pressed && currentkey === 'right' && player.currentsprite !== player.sprites.run.right) {
        player.frame = 1
        player.currentsprite = player.sprites.stand.right
        player.currentcropwidth = player.sprites.stand.cropwidth
        player.width = player.sprites.stand.width
    }
}

init()
animate()


window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: //when A is pressed
            console.log("left")
            keys.left.pressed = true
            currentkey = 'left'
            break;
        case 83: //when S is pressed
            console.log("down")
            break;
        case 68: //when D is pressed
            console.log("right")
            keys.right.pressed = true;
            currentkey = 'right'
            break;
        case 87: //when W is pressed
            console.log("up")
            if (player.velocity.y == 0) {
                player.velocity.y -= player.jump;
            }
            break;
        case 82:
            console.log("reset")
            init();
            break;
        default:
            console.log(keyCode)
            break;
    }
    console.log(keys.right.pressed)

})
window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: //when A is pressed
            console.log("left")
            keys.left.pressed = false
            player.currentsprite = player.sprites.stand.left
            player.currentcropwidth = player.sprites.stand.cropwidth
            player.width = player.sprites.stand.width
            break;
        case 83: //when S is pressed
            console.log("down")
            break;
        case 68: //when D is pressed
            console.log("right")
            keys.right.pressed = false
            player.currentsprite = player.sprites.stand.right
            player.currentcropwidth = player.sprites.stand.cropwidth
            player.width = player.sprites.stand.width
            break;
        case 87: //when W is pressed
            console.log("up")
            break;
        default:
            console.log(keyCode)
            break;
    }
    console.log(keys.right.pressed)
})
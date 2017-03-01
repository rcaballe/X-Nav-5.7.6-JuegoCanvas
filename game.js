// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;
var stone = {};
var monster = {
	speed: 64 //me falta hacer que el movimiento sea aletorio 
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess, stone and monster somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 128));
	princess.y = 32 + (Math.random() * (canvas.height - 128));
	stone.x = 32 + (Math.random() * (canvas.width - 128));
	stone.y = 32 + (Math.random() * (canvas.height - 128));
	monster.x = 32 + (Math.random() * (canvas.width - 128));
	monster.y = 32 + (Math.random() * (canvas.height - 128));
};

// Update game objects
var update = function (modifier) {

	if(stone.x==hero.x && stone.y==hero.y){ //si aparecen en la misma posicion piedra y heroe-->reset
		reset();
	}
	if(stone.x==princess.x+64 && stone.x==princess.x-64 && stone.y==princess.y+64 && stone.y==princess.y-64){//si la piedra aparece cerca de la princesa-->reseat
		reset();
	}


	if (38 in keysDown) { // Player holding up
		if(hero.y>12){
			hero.y -= hero.speed * modifier;
			if(monster.y>12){
				monster.y -= monster.speed * modifier;
			}
		}
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y<canvas.height-12){
			hero.y += hero.speed * modifier;
			if(monster.y<canvas.height-12){
				monster.y += monster.speed * modifier;
			}
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x>12){
			hero.x -= hero.speed * modifier;
			if(monster.x>12){
				monster.x -= monster.speed * modifier;
			}
		}
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x<canvas.width-12){
			hero.x += hero.speed * modifier;
			if(monster.x<canvas.width-12){
				monster.x += monster.speed * modifier;
			}
		}
	}

	
	//se tocan la piedra y el heroe
	if (
		hero.x <= (stone.x + 16)
		&& stone.x <= (hero.x + 16)
		&& hero.y <= (stone.y + 16)
		&& stone.y <= (hero.y + 16)
	) {
		reset();//empieza de nuevo, lo que hace que la tenga que esquivar
	}

	//se tocan el heroe y el monstruo
	if (
		hero.x <= (monster.x + 16)
		&& monster.x <= (hero.x + 16)
		&& hero.y <= (monster.y + 16)
		&& monster.y <= (hero.y + 16)
	) {
		princessesCaught = 0; //muere y se pone el contador a cero
		reset();
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}

	//modificar la velocidad del monstruo cada 10 veces que captures a la princesa
	/*if(princessesCaught%=10){
		monster.speed=64*2;
	}*/

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		ctx.drawImage(stoneImage, stone.x, stone.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}


	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible

/**
 * Created by joelsaxton on 11/8/14.
 */
StarPatrol.Game = function(){

    // Scaled physics and values based on this.GAME_SCALE
    this.GAME_SCALE = 0.2;
    this.GAMESIZE = this.GAME_SCALE * 750000;
    this.MAXVELOCITY = this.GAME_SCALE * 2400;
    this.WARPVELOCITY = this.MAXVELOCITY * 6;
    this.MAXTHRUST = this.GAME_SCALE * 30;
    this.ALIENSPEED = this.GAME_SCALE * 1400;
    this.TRAINSPEED = this.ALIENSPEED * 0.8;
    this.GRAVITY = this.GAME_SCALE * 400;
    this.GRAVITYRANGE = this.GAME_SCALE * 4000;
    this.MISSILESPEED = this.GAME_SCALE * 2000;
    this.MISSILESCALE = this.GAME_SCALE * 0.3;
    this.BULLETSCALE = this.GAME_SCALE * 0.2;
    this.ASTEROIDSCALE = this.GAME_SCALE * 2;
    this.EXPLOSIONSCALE = this.GAME_SCALE * 6;
    this.ASTEROIDSPEED = this.GAME_SCALE * 2;
    this.playerScale = this.GAME_SCALE;
    this.alienScale = this.GAME_SCALE;
    this.planetScale = this.GAME_SCALE * 12;
    this.earthRadius = this.planetScale * 125 * 0.5;
    this.mapPlanetScale = this.GAME_SCALE * 70;
    this.BULLETLOCKDISTANCE = this.GAME_SCALE * 1200;
    this.BULLETACCELERATION = this.GAME_SCALE * 1200;
    this.MAXBULLETSPEED = this.GAME_SCALE * 4000;
    this.MAXBULLETDISTANCE = this.GAME_SCALE * 1600;
    this.MAXTRACTORBEAMDISTANCE = this.GAME_SCALE * 3200;
    this.TRACTORBEAMFORCE = this.GAME_SCALE * 2400;
    this.MINSAFEWARPDISTANCE = this.GAME_SCALE * 3200;

    // Timers
    this.reloadInterval = 2000;
    this.rechargeInterval = 50;
    this.warpInterval = 2500;
    this.rechargeTimer = 0;
    this.reloadTimer = 0;
    this.warpTimer = 0;
    this.alienInterval = 24000;
    this.alienTimer = 0;

    // Scalars
    this.MAXHEALTH = 100;
    this.MAXCHARGE = 100;
    this.warpDrive = this.MAXCHARGE;
    this.warpModifier = 5;
    this.MISSILE_DAMAGE = 34;
    this.BULLET_DAMAGE = 10;
    this.ASTEROID_DAMAGE = 5;
    this.MISSILE_DISCHARGE = 50;
    this.SHIELD_DISCHARGE = 4;
    this.BULLET_DISCHARGE = 100;
    this.WARP_DISCHARGE = 0.2;
    this.KILL_ALIEN_SCORE = 500;
    this.DESTROY_ASTEROID_SCORE = 50;
    this.DISTRESS_HEALTH = 20;
    this.MAXTURNINCREMENT = 0.1;
    this.MAXTURNRATE = 4;
    this.MINTURNRATE = 0.2;
    this.score = 0;
    this.mapSize = 200;
    this.mapOffset = 4;
    this.mapGameRatio = this.mapSize / this.GAMESIZE;
    this.asteroidDensity = 2;
    this.TOTALASTEROIDS = parseInt(this.GAMESIZE/2000) * this.asteroidDensity;
    this.TOTALALIENS = 1; // How many appear at any one time
    this.aliensKilled = 0;
    this.orbitSpeedModifier = 2;
};

StarPatrol.Game.prototype = {
    create: function() {
        // Enable physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add debug plugin
        //this.game.add.plugin(Phaser.Plugin.Debug);

        // Set world size
        this.game.world.setBounds(0, 0, this.GAMESIZE, this.GAMESIZE);

        //  Our tiled scrolling background
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.background.fixedToCamera = true;

        // Add map sprite
        this.map = this.add.sprite(this.game.width - (this.mapSize) - this.mapOffset, this.mapOffset, 'map');
        this.map.scale.setTo(1); // To match this.mapSize ratio (200px = scale of 1)


        // Build solar system with planet and Planet map sprites
        this.sun = this.add.sprite(this.world.centerX, this.world.centerY, 'sun');
        this.sun.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset * 2 + parseInt(this.sun.x * this.mapGameRatio), parseInt(this.sun.y * this.mapGameRatio) + this.mapOffset, 'sun');
        this.mercury = this.add.sprite(this.world.centerX, this.world.centerY, 'mercury');
        this.mercury.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.mercury.x * this.mapGameRatio), parseInt(this.mercury.y * this.mapGameRatio) + this.mapOffset, 'mercury');
        this.venus = this.add.sprite(this.world.centerX, this.world.centerY, 'venus');
        this.venus.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.venus.x * this.mapGameRatio), parseInt(this.venus.y * this.mapGameRatio) + this.mapOffset, 'venus');
        this.earth = this.add.sprite(this.world.centerX, this.world.centerY, 'earth');
        this.earth.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.earth.x * this.mapGameRatio), parseInt(this.earth.y * this.mapGameRatio) + this.mapOffset, 'earth');
        this.mars = this.add.sprite(this.world.centerX, this.world.centerY, 'mars');
        this.mars.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.mars.x * this.mapGameRatio), parseInt(this.mars.y * this.mapGameRatio) + this.mapOffset, 'mars');
        this.jupiter = this.add.sprite(this.world.centerX, this.world.centerY, 'jupiter');
        this.jupiter.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.jupiter.x * this.mapGameRatio), parseInt(this.jupiter.y * this.mapGameRatio) + this.mapOffset, 'jupiter');
        this.saturn = this.add.sprite(this.world.centerX, this.world.centerY, 'saturn');
        this.saturn.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.saturn.x * this.mapGameRatio), parseInt(this.saturn.y * this.mapGameRatio) + this.mapOffset, 'saturn');
        this.uranus = this.add.sprite(this.world.centerX, this.world.centerY, 'uranus');
        this.uranus.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.uranus.x * this.mapGameRatio), parseInt(this.uranus.y * this.mapGameRatio) + this.mapOffset, 'uranus');
        this.neptune = this.add.sprite(this.world.centerX, this.world.centerY, 'neptune');
        this.neptune.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.neptune.x * this.mapGameRatio), parseInt(this.neptune.y * this.mapGameRatio) + this.mapOffset, 'neptune');
        this.pluto = this.add.sprite(this.world.centerX, this.world.centerY, 'pluto');
        this.pluto.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.pluto.x * this.mapGameRatio), parseInt(this.pluto.y * this.mapGameRatio) + this.mapOffset, 'pluto');

        // Set up orbits
        this.au = this.world.width / 80;
        this.mercury.orbit = this.au * 3.2;
        this.venus.orbit = this.au * 5.7;
        this.earth.orbit = this.au * 8.5;
        this.mars.orbit = this.au * 11.8;
        this.jupiter.orbit = this.au * 15.4;
        this.saturn.orbit = this.au * 20;
        this.uranus.orbit = this.au * 25.8;
        this.neptune.orbit = this.au * 32.8;
        this.pluto.orbit = this.au * 38.5;

        // Fix map to camera
        this.map.fixedToCamera = true;

        // Planets
        this.planets = this.game.add.group();

        // Add planets to group
        this.planets.add(this.earth);
        this.planets.add(this.pluto);
        this.planets.add(this.neptune);
        this.planets.add(this.uranus);
        this.planets.add(this.saturn);
        this.planets.add(this.jupiter);
        this.planets.add(this.mars);
        this.planets.add(this.venus);
        this.planets.add(this.mercury);
        this.saturn.angle = 45;
        this.saturn.map.angle = 45;

        // Set properties
        this.planets.forEach(function (planet) {
            planet.period = 0;
            planet.periodOffset = this.game.rnd.realInRange(-10,10);
            planet.anchor.setTo(0.5, 0.5);
            planet.scale.setTo(this.planetScale);
            this.game.physics.arcade.enableBody(planet);
            planet.body.immovable = true;
            planet.map.fixedToCamera = true;
            planet.map.anchor.setTo(0.5, 0.5);
            planet.map.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        }, this);

        // Sun
        this.sun.anchor.setTo(0.5);
        this.sun.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.sun);
        this.sun.body.immovable = true;
        this.sun.map.anchor.setTo(0.5);
        this.sun.map.scale.setTo(this.mapGameRatio*this.mapPlanetScale * 0.5); // Make sun slightly smaller on map
        this.sun.map.x += this.sun.map.width * 0.5;
        this.sun.map.fixedToCamera = true;

        // Player parameters
        this.player = this.add.sprite(1000, this.world.centerY, 'player');
        this.player.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.player.x * this.mapGameRatio), parseInt(this.player.y * this.mapGameRatio) + this.mapOffset, 'playermap');
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(this.playerScale);
        this.player.health = this.MAXHEALTH;
        this.player.charge = this.MAXCHARGE;
        this.player.thrust = this.MAXTHRUST;
        this.player.turnRate = 0;
        this.player.maxTurnRate = this.MAXTURNRATE;
        this.player.turnIncrement = this.MAXTURNINCREMENT;
        this.player.maxVelocity = this.MAXVELOCITY;
        this.player.shieldStrength = this.MAXCHARGE;
        this.player.isAlive = true;
        this.player.isReloaded = true;
        this.player.isBurning = false;
        this.player.isWarping = false;
        this.player.isShielded = false;
        this.player.map.fixedToCamera = true;
        this.player.map.anchor.setTo(0.5);
        this.player.map.scale.setTo(2);
        this.game.physics.arcade.enableBody(this.player);
        this.player.body.bounce.set(0.8);
        this.player.checkWorldBounds = true;
        this.player.body.collideWorldBounds = true;
        this.player.hasNotThrustYet = true;

        // Train parameters
        this.train = this.add.sprite(0, this.world.centerY, 'train');
        this.train.anchor.setTo(0, 0.5);
        this.train.scale.setTo(this.playerScale * 5);
        this.game.physics.arcade.enableBody(this.train);
        this.train.health = this.MAXHEALTH;
        this.train.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.train.x * this.mapGameRatio), parseInt(this.train.y * this.mapGameRatio) + this.mapOffset, 'trainmap');
        this.train.map.fixedToCamera = true;
        this.train.map.anchor.setTo(0);
        this.train.map.scale.setTo(1);
        this.train.map.animations.add('tracking', [0,1]);
        this.train.map.animations.play('tracking', 10, true);
        this.train.body.bounce.set(0.4);

        // Set player animations
        this.player.animations.add('drift', [0,0,0,0,0,0,0,4,5,6,7]);
        this.player.animations.add('thrust', [1,2,3,2]);
        this.player.animations.add('burning', [8]);
        this.player.animations.add('shield', [9, 10]);
        this.player.animations.play('drift', 20, true);
        this.player.map.animations.add('tracking', [0,1]);
        this.player.map.animations.play('tracking', 10, true);

        // Set Camera
        this.game.camera.follow(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(this.game.width/2, this.game.height/2, this.game.width/8, this.game.height/8);
        this.game.camera.focusOnXY(0, 0);

        // Set alien
        this.aliens = this.game.add.group();
        this.alien = this.createAlien(); // Create alien and add to group
        this.aliens.add(this.alien);
        this.alien.map = this.add.sprite(this.game.width - this.mapSize - this.mapOffset + parseInt(this.alien.x * this.mapGameRatio), parseInt(this.alien.y * this.mapGameRatio) + this.mapOffset, 'alienmap');
        this.alien.map.fixedToCamera = true;
        this.alien.map.anchor.setTo(0.5);
        this.alien.map.scale.setTo(2);
        this.alien.map.animations.add('tracking', [0,1]);
        this.alien.map.animations.play('tracking', 10, true);

        // Set alien animations
        this.alien.animations.add('cruise', [0]);
        this.alien.animations.add('attract', [1,2,3,2,3,2]);

        this.missiles = this.game.add.group();
        this.missiles.setAll('anchor.x', 0.5);
        this.missiles.setAll('anchor.y', 0.5);

        this.bullets = this.game.add.group();

        this.asteroids = this.game.add.group();
        this.asteroids.setAll('anchor.x', 0.5);
        this.asteroids.setAll('anchor.y', 0.5);
        this.asteroids.setAll('checkWorldBounds', true);

        // Create asteroid pool
        while (this.asteroids.countLiving() < this.TOTALASTEROIDS) {
            this.createAsteroid();
        }

        //  Create small explosion pool
        this.explosions = game.add.group();
        for (var i = 0; i < 30; i++)
        {
            var explosionAnimation = this.explosions.create(0, 0, 'explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.scale.setTo(this.EXPLOSIONSCALE);
            explosionAnimation.animations.add('explosion');
        }

        //  Create big Explosion pool
        this.bigExplosions = game.add.group();
        for (var i = 0; i < 10; i++)
        {
            var explosionAnimation = this.bigExplosions.create(0, 0, 'big-explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.scale.setTo(this.EXPLOSIONSCALE);
            explosionAnimation.animations.add('big-explosion');
        }

        // Set text bitmaps
        this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: ' + this.score, 14);
        this.healthText = this.game.add.bitmapText(10,40, 'minecraftia', 'Hull: ' + this.player.health, 10);
        this.trainHealthText = this.game.add.bitmapText(10,55, 'minecraftia', 'Space Train: ' + this.train.health, 10);
        this.batteryText = this.game.add.bitmapText(10,70, 'minecraftia', 'Charge: ' + this.player.charge, 10);
        this.warpText = this.game.add.bitmapText(10,85, 'minecraftia', 'Warp Drive: ' + this.warpDrive, 10);
        this.shieldText = this.game.add.bitmapText(10,100, 'minecraftia', 'Shields: ' + this.player.shieldStrength, 10);
        this.aliensKilledText = this.game.add.bitmapText(10,115, 'minecraftia', 'Aliens Killed: ' + this.aliensKilled, 10);
        this.shieldText.tint = 0x66CD00; // '#66CD00'
        this.batteryText.tint = 0xFF0000; // '#FF0000'
        this.scoreText.fixedToCamera = true;
        this.batteryText.fixedToCamera = true;
        this.shieldText.fixedToCamera = true;
        this.healthText.fixedToCamera = true;
        this.trainHealthText.fixedToCamera = true;
        this.warpText.fixedToCamera = true;
        this.aliensKilledText.fixedToCamera = true;

        // Set sounds
        this.jetSound = this.game.add.audio('rocket');
        this.missileSound = this.game.add.audio('missile');
        this.bulletSound = this.game.add.audio('bullet');
        this.explosionSound = this.game.add.audio('explosion');
        this.gameMusic = this.game.add.audio('gameMusic');
        this.youBlewIt = this.game.add.audio('youblewit');
        this.warpStartSound = this.game.add.audio('warp-start');
        this.warpSound = this.game.add.audio('warp');
        this.warpLoopSound = this.game.add.audio('warp-on');
        this.warpDownSound = this.game.add.audio('warp-down');
        this.shieldSound = this.game.add.audio('shield-up');
        this.boingSound = this.game.add.audio('boing');
        this.tractorBeamSound = this.game.add.audio('tractor-beam');
        this.applauseSound = this.game.add.audio('applause');
        this.gameMusic.play('', 0, 0.1, true, true);

        // Set inputs
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.shiftkey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.spacebar.onDown.add(this.fireMissile,this);
    },

    update: function() {
        if (this.player.isAlive){
            this.updateCamera();
            this.checkPlayerInputs();

            // Constrain velocity
            if (this.player.isWarping){
                this.constrainVelocity(this.player, this.WARPVELOCITY);
            } else {
                this.constrainVelocity(this.player, this.player.maxVelocity);
            }

            this.applyGravity();
            this.updateTimers();
            this.checkCollisions();
            this.updateAsteroids();
            this.updateHealth();
            this.updatePlanetPositions();
            this.updateTrainPosition();
            this.updateMapPositions();
            this.alien.bringToTop();
            this.player.bringToTop();
            this.checkWin();
        }

        if (this.alien.alive){
            this.updateAlien();
        }

        this.updateProjectiles();
        this.updateAllText();
        this.updateEpisode();
    },

    updatePlanetPositions: function() {
        // Update Planets and their orbits
        this.map.bringToTop();
        this.sun.map.bringToTop();

        this.planets.forEach(function (planet) {
            planet.period += this.orbitSpeedModifier / planet.orbit;
            planet.x = this.world.centerX + planet.width * 0.5 + Math.cos(planet.period + planet.periodOffset) * planet.orbit;
            planet.y = this.world.centerY + planet.height * 0.5 + Math.sin(planet.period + planet.periodOffset) * planet.orbit;
            planet.map.fixedToCamera = false;
            planet.map.x = this.game.width - this.mapSize + parseInt(planet.x * this.mapGameRatio) - this.mapOffset;
            planet.map.y = parseInt(planet.y * this.mapGameRatio) + this.mapOffset;
            planet.map.fixedToCamera = true;
            planet.map.bringToTop();
        }, this);
    },

    updateTrainPosition: function() {
        this.train.rotation = game.physics.arcade.angleBetween(this.train, this.earth);
        this.game.physics.arcade.moveToObject(this.train, this.earth, this.TRAINSPEED);
        this.train.map.fixedToCamera = false;
        this.train.map.x = this.game.width - this.mapSize + parseInt(this.train.x * this.mapGameRatio) - this.mapOffset;
        this.train.map.y = parseInt(this.train.y * this.mapGameRatio) + this.mapOffset;
        this.train.map.angle = this.train.angle;
        this.train.map.fixedToCamera = true;
        this.train.map.bringToTop();
    },

    checkWin: function() {
        // Win if train gets close enough to Earth
        var earth_x = this.earth.x + this.earthRadius;
        var earth_y = this.earth.y + this.earthRadius;
        this.distanceFromEarth = Math.sqrt(Math.pow(earth_x - this.train.x, 2) + Math.pow(earth_y - this.train.y, 2));

        if (this.distanceFromEarth < this.GRAVITYRANGE * 4) {
            this.gameMusic.stop();
            this.warpLoopSound.stop();
            this.player.isAlive = false;
            this.player.kill();
            this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
            this.game.camera.setBoundsToWorld();
            var scoreboard = new Scoreboard(this.game);
            scoreboard.show(this.score, this.applauseSound, this.explosionSound, true);
        }
    },

    updateAllText: function() {
        this.healthText.text = 'Hull: ' + this.player.health;
        this.trainHealthText.text = 'Space Train: ' + this.train.health;
        this.shieldText.text = 'Shields: ' + this.player.shieldStrength;
        this.batteryText.text = 'Charge: ' + this.player.charge;
        this.scoreText.text = 'Score: ' + this.score;
        this.warpText.text = 'Warp Drive: ' + parseInt(this.warpDrive);
        this.aliensKilledText.text = 'Aliens Killed: ' + this.aliensKilled;
    },

    updatePosition: function(sprite) {
        // Check if sprite crossed world bounds and update position if true
        if (sprite.x > this.world.width){
            sprite.x = 0;
        }
        if (sprite.x < 0){
            sprite.x = this.world.width;
        }
        if (sprite.y > this.world.height){
            sprite.y = 0;
        }
        if (sprite.y < 0){
            sprite.y = this.world.height;
        }
    },

    updateHealth: function() {
        // Update player health
        if (this.player.health <= this.DISTRESS_HEALTH){
            this.player.isBurning = true;
            this.player.shieldStrength = 0;
            this.player.animations.play('burning', 20, true);
            this.player.thrust = this.MAXTHRUST * 0.5;
            this.player.maxVelocity = this.MAXVELOCITY * 0.5;
            this.player.turnIncrement = this.MAXTURNINCREMENT * 0.5;
            this.player.maxTurnRate = this.MAXTURNRATE * 0.5;
        }
        if (this.player.health <= 0 || this.train.health <= 0) {
            this.detonate(this.train);
            this.killPlayer();
        }

        // Subtract health if shield was brought below zero
        if (this.player.shieldStrength < 0){
            this.player.health += this.player.shieldStrength;
            this.player.shieldStrength = 0;
        }

        // Update alien health
        if (this.alien.health <= 0 && this.alien.alive){
            this.killAlien();
        }
    },

    updateCamera: function() {
        this.background.tilePosition.x = -game.camera.x;
        this.background.tilePosition.y = -game.camera.y;
    },

    updateMapPositions: function(){
        this.player.map.fixedToCamera = false;
        this.player.map.x = this.game.width - this.mapSize + parseInt(this.player.x * this.mapGameRatio) - this.mapOffset;
        this.player.map.y = parseInt(this.player.y * this.mapGameRatio) + this.mapOffset;
        this.player.map.fixedToCamera = true;
        this.player.map.bringToTop();

        this.alien.map.fixedToCamera = false;
        this.alien.map.x = this.game.width - this.mapSize + parseInt(this.alien.x * this.mapGameRatio) - this.mapOffset;
        this.alien.map.y = parseInt(this.alien.y * this.mapGameRatio) + this.mapOffset;
        this.alien.map.fixedToCamera = true;
        this.alien.map.bringToTop();
    },

    fireMissile: function () {
        if (this.player.isReloaded && this.player.charge >= this.MISSILE_DISCHARGE) {
            this.missileSound.play('', 0, 0.1, false, true);
            this.createMissile(this.player.x, this.player.y, this.player.angle);
            this.player.isReloaded = false;
            this.player.charge -= this.MISSILE_DISCHARGE;
        }

        // if player fires missile while warping, kill him
        if (this.player.isWarping) {
            this.killPlayer();
        }
    },

    checkPlayerInputs: function() {
        // Set initial velocity
        if (this.player.hasNotThrustYet){
            this.player.rotation = game.physics.arcade.angleBetween(this.player, this.earth) + 90;
            this.game.physics.arcade.moveToObject(this.player, this.earth, this.TRAINSPEED, 360 * 1000);
        }
        // Decide animation
        if (!this.cursors.up.isDown){
            if (!this.player.isBurning && !this.player.isShielded) {
                this.player.animations.play('drift', 20, true);
            }
        }
        // Check if player overused warp drive and kill him
        if (this.player.isWarping && this.warpDrive < 0){
            this.killPlayer();
        }
        // Check if player is warping too close to tractor beam being used on him
        if (this.player.isWarping && this.alien.isTractorBeamOn && this.alien.target == this.player && this.game.physics.arcade.distanceBetween(this.alien, this.player) < this.MINSAFEWARPDISTANCE){
            this.killPlayer();
        }
        // use shields
        if (this.shiftkey.isDown && !this.player.isWarping && this.player.charge > 0 && this.player.shieldStrength > 0){
            this.player.charge -= this.SHIELD_DISCHARGE;
            this.player.animations.play('shield', 50, true);
            // play shield-on sound
            if (!this.player.isShielded) {
                this.shieldSound.play('', 0, 0.05, false);
            }
            this.player.isShielded = true;

        } else if (this.player.isShielded){
            this.player.isShielded = false;
        }
        // Use warp drive
        if (this.cursors.down.isDown && this.warpDrive > 0) {
            // play warp-on sound
            if (!this.player.isWarping) {
                this.warpSound.play('', 0, 0.5, false);
                this.warpStartSound.play('', 0, 0.8, false);
            }
            // play warp loop sound
            if (!this.warpLoopSound.isPlaying) {
                this.warpLoopSound.play('', 0, 0.05, true);
            }
            this.player.hasNotThrustYet = false;
            this.player.turnRate = 0;
            this.player.isWarping = true;
            this.warpDrive -= this.WARP_DISCHARGE;
            var x_component = Math.cos((this.player.angle + 270) * Math.PI / 180);
            var y_component = Math.sin((this.player.angle + 270) * Math.PI / 180);
            this.player.body.velocity.x += this.player.thrust * this.warpModifier * x_component;
            this.player.body.velocity.y += this.player.thrust * this.warpModifier * y_component;
        } else if (this.player.isWarping) {
            this.player.isWarping = false;
            this.warpDownSound.play('', 0, 0.8, false);
            this.warpLoopSound.stop();
        }
        // Change direction and thrust only if not warping
        if (!this.player.isWarping) {
            // Thrust
            if (this.cursors.up.isDown) {
                if (!this.player.isBurning && !this.player.isShielded) {
                    this.player.animations.play('thrust');
                }
                this.player.hasNotThrustYet = false;
                var x_component = Math.cos((this.player.angle + 270) * Math.PI / 180);
                var y_component = Math.sin((this.player.angle + 270) * Math.PI / 180);
                this.player.body.velocity.x += this.player.thrust * x_component;
                this.player.body.velocity.y += this.player.thrust * y_component;
                // Adjust turn rate if thrusting
                if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
                    if (Math.abs(this.player.turnRate) <= this.MINTURNRATE) {
                        this.player.turnRate = 0;
                    } else if (this.player.turnRate > 0) {
                        this.player.turnRate -= this.player.turnIncrement;
                    } else {
                        this.player.turnRate += this.player.turnIncrement;
                    }
                }

                if (!this.jetSound.isPlaying) {
                    this.jetSound.play('', 0, 0.1, false, true);
                } else {
                    this.jetSound.stop();
                }
            }
            // turn RIGHT
            if (this.cursors.right.isDown) {   //  Move to the right
                this.player.hasNotThrustYet = false;
                if (this.player.turnRate <= this.player.maxTurnRate) {
                    this.player.turnRate += this.player.turnIncrement;
                }
                this.player.angle += this.player.turnRate;
                this.isTurning = true;

            } // turn LEFT
            else if (this.cursors.left.isDown) {   //  Move to the left
                this.player.hasNotThrustYet = false;
                if (-this.player.turnRate <= this.player.maxTurnRate) {
                    this.player.turnRate -= this.player.turnIncrement;
                }
                this.player.angle += this.player.turnRate;
                this.isTurning = true;
            } // continue rotation
            else if (this.isTurning) {
                this.player.angle += this.player.turnRate;
            }
        }
    },

    // Ship max velocity
    constrainVelocity: function (sprite, maxVelocity) {
        if (!sprite || !sprite.body) {
            return;
        }
        var body = sprite.body;
        var angle, currVelocitySqr, vx, vy;
        vx = body.velocity.x;
        vy = body.velocity.y;
        currVelocitySqr = vx * vx + vy * vy;
        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            body.velocity.x = vx;
            body.velocity.y = vy;
        }
    },

    updateProjectiles: function() {
        // Player missile
        this.missiles.forEach(function (missile) {
            if (missile) {
                this.updatePosition(missile);
                if (missile.lifespan < this.game.time.now) {
                    this.detonate(missile, true, 100);
                }
            }
        }, this);

        // Alien heat seeking bullet
        this.bullets.forEach(function (bullet) {
            if (bullet) {
                this.updatePosition(bullet);
                if (this.game.physics.arcade.distanceBetween(bullet, this.alien.target) > this.BULLETLOCKDISTANCE) {
                    this.game.physics.arcade.accelerateToObject(bullet, this.alien.target, this.BULLETACCELERATION, this.MAXBULLETSPEED, this.MAXBULLETSPEED);
                } else {
                    this.game.physics.arcade.moveToObject(bullet, this.alien.target, parseInt(this.alien.target.body.speed) * 10);
                }
                if (bullet.lifespan < this.game.time.now) {
                    this.detonate(bullet, true, 100);
                }
            }
        }, this);
    },

    updateAlien: function () {
        // ATTACK MODE
        if (this.alien.isAttacking) {
            // Alien chases ship
            this.alien.rotation = game.physics.arcade.angleBetween(this.alien, this.alien.target);
            this.game.physics.arcade.moveToObject(this.alien, this.alien.target, this.ALIENSPEED, 1200);

            // Use tractor beam
            if (!this.alien.isTractorBeamOn && this.alien.tractorBeam >= 90 && this.game.physics.arcade.distanceBetween(this.alien, this.alien.target) < this.MAXTRACTORBEAMDISTANCE) {
                this.alien.isTractorBeamOn = true;
                this.alien.animations.play('attract', 20, true);
                this.tractorBeamSound.play('', 0, 0.1, true, true);
            }
            if (this.alien.isTractorBeamOn){
                this.alien.tractorBeam -= 0.6;
                this.alien.target.body.allowGravity = true;
                this.alien.target.body.gravity = new Phaser.Point(this.alien.x - this.alien.target.x, this.alien.y - this.alien.target.y);
                this.alien.target.body.gravity = this.player.body.gravity.normalize().multiply(this.TRACTORBEAMFORCE, this.TRACTORBEAMFORCE);
            }
            if (this.alien.tractorBeam < 10 || this.game.physics.arcade.distanceBetween(this.alien, this.alien.target) > this.MAXTRACTORBEAMDISTANCE) {
                this.alien.isTractorBeamOn = false;
                this.alien.animations.play('cruise', 20);
                this.alien.target.body.allowGravity = false;
                this.tractorBeamSound.stop();
            }

            // Fire heat seeking bullet
            if (this.alien.charge >= this.BULLET_DISCHARGE) {
                if (this.bullets.countLiving() < 2 && this.game.physics.arcade.distanceBetween(this.alien, this.alien.target) < this.MAXBULLETDISTANCE) {
                    this.bulletSound.play('', 0, 1, false, true);
                    this.createBullet(this.alien.x, this.alien.y);
                    this.alien.charge -= this.BULLET_DISCHARGE;
                }
            }
        } else if (this.alien.beganRetreat && !this.alien.retreatedOnceAlready){
            this.alien.isTractorBeamOn = false;
            this.tractorBeamSound.stop();
            this.alien.beganRetreat = false;
            this.alien.retreatedOnceAlready = true;
            this.alien.body.allowGravity = false;
            // LAME LAME PHASER @todo actually get chaining to work
            this.add.tween(this.alien).to({angle: this.alien.angle + 180}, 250, Phaser.Easing.Linear.None)
                .start()
                .onComplete.add(function(){
                    this.add.tween(this.alien).to({angle: this.alien.angle}, 3000, Phaser.Easing.Linear.None)
                        .start()
                        .onComplete.add(function(){
                            this.add.tween(this.alien).to({angle: game.physics.arcade.angleBetween(this.alien, this.alien.target)}, 250, Phaser.Easing.Linear.None)
                                .start()
                                .onComplete.add(function(){
                                    this.alien.body.allowGravity = true;
                                    this.alien.isAttacking = true;
                                }, this);
                        }, this);
                }, this);
        }

    },

    updateAsteroids: function() {
        if (this.asteroids.countLiving() < this.TOTALASTEROIDS) {
            this.createAsteroid();
        }

        this.asteroids.forEach(function (asteroid) {
           if (asteroid){
               this.updatePosition(asteroid);
           }
        }, this);
    },

    applyGravity: function() {
        var earth_x = this.earth.x + this.earthRadius;
        var earth_y = this.earth.y + this.earthRadius;
        this.distanceFromEarth = Math.sqrt(Math.pow(earth_x - this.player.body.x, 2) + Math.pow(earth_y - this.player.body.y, 2));

        // Gravity
        if (this.distanceFromEarth < this.GRAVITYRANGE) {
            this.player.body.allowGravity = true;
            this.player.body.gravity = new Phaser.Point(earth_x - this.player.body.x, earth_y - this.player.body.y);
            this.player.body.gravity = this.player.body.gravity.normalize().multiply(this.GRAVITY, this.GRAVITY);
        } else {
            this.player.body.allowGravity = false;
        }
    },

    updateEpisode: function() {
        // Alien appearance timer
        if (this.alienTimer < this.game.time.now) {
            this.alienTimer = this.game.time.now + this.alienInterval;
            if (this.aliens.countLiving() < this.TOTALALIENS) {
                this.alien = this.createAlien();
                this.aliens.add(this.alien);
                this.alien.map.revive();
            }
        }
    },

    updateTimers: function () {
        // Reload timer
        if (this.reloadTimer < this.game.time.now) {
            this.reloadTimer = this.game.time.now + this.reloadInterval;
            this.player.isReloaded = true;
        }
        // Recharge battery timer
        if (this.rechargeTimer < this.game.time.now) {
            this.rechargeTimer = this.game.time.now + this.rechargeInterval;
            if (this.player.charge < this.MAXCHARGE) {
                this.player.charge++;
            }
            if (this.alien.charge < this.MAXCHARGE){
                this.alien.charge++;
            }
            if (this.alien.tractorBeam < this.MAXCHARGE){
                this.alien.tractorBeam++;
            }
        }
        // Recharge warp drive
        if (this.warpTimer < this.game.time.now) {
            this.warpTimer = this.game.time.now + this.warpInterval;
            if (this.warpDrive < this.MAXCHARGE) {
                this.warpDrive++;
            }
        }
    },

    checkCollisions: function() {
        this.game.physics.arcade.collide(this.missiles, this.asteroids, this.missileAsteroidHit, null, this);
        this.game.physics.arcade.collide(this.player, this.asteroids, this.playerAsteroidHit, null, this);
        this.game.physics.arcade.collide(this.player, this.alien, this.playerAlienHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.alien, this.missileAlienHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.planets, this.missilePlanetHit, null, this);
        this.game.physics.arcade.collide(this.asteroids, this.planets, this.asteroidPlanetHit, null, this);
        this.game.physics.arcade.collide(this.player, this.bullets, this.playerBulletHit, null, this);
        this.game.physics.arcade.collide(this.planets, this.bullets, this.planetBulletHit, null, this);
        this.game.physics.arcade.collide(this.asteroids, this.bullets, this.asteroidBulletHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.bullets, this.missileBulletHit, null, this);
        this.game.physics.arcade.collide(this.alien, this.asteroids, this.alienAsteroidHit, null, this);
        this.game.physics.arcade.collide(this.train, this.bullets, this.bulletTrainHit, null, this);
    },

    createMissile: function(x, y, angle) {
        var missile = new Missile(this.game, this.MISSILESCALE, this.MISSILESPEED, x, y, angle);
        this.missiles.add(missile);
        missile.checkWorldBounds = true;
        missile.reset(this.player.x, this.player.y);
        missile.revive();
    },

    createBullet: function(x, y) {
        var bullet = this.bullets.getFirstDead();
        if (!bullet) {
            bullet = new Bullet(this.game, this.BULLETSCALE, x, y);
            this.bullets.add(bullet);
        }
        bullet.reset(this.alien.x, this.alien.y);
        bullet.revive();
    },

    createAlien: function() {
        var alien = this.aliens.getFirstDead();
        var start = this.game.rnd.integerInRange(1, 4);
        switch (start) {
            case 1:
                var x = this.game.world.bounds.width;
                var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                break;
            case 2:
                var x = 0;
                var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                break;
            case 3:
                var x = this.game.rnd.integerInRange(0, this.game.world.bounds.width);
                var y = this.game.world.bounds.height;
                break;
            case 4:
                var x = this.game.rnd.integerInRange(0, this.game.world.bounds.width);
                var y = 0;
                break;
        }

        if (alien) {
            alien.reset(x, y);
            alien.revive();
            alien.target = this.train;
        } else {
            alien = new Alien(this.game, x, y, this.MAXCHARGE, this.MAXHEALTH, this.alienScale);
            alien.target = this.train;
        }
        return alien;
    },

    createAsteroid: function () {
        var asteroid = this.asteroids.getFirstDead();
        if (!asteroid) {
            var start = this.game.rnd.integerInRange(1, 4);

            switch (start){
                case 1:
                    var x = this.game.world.bounds.width;
                    var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                    var direction = 1;
                    break;
                case 2:
                    var x = 0;
                    var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                    var direction = 2;
                    break;
                case 3:
                    var x = this.game.rnd.integerInRange(0, this.game.world.bounds.width);
                    var y = this.game.world.bounds.height;
                    var direction = 3;
                    break;
                case 4:
                    var x = this.game.rnd.integerInRange(0, this.game.world.bounds.width);
                    var y = 0;
                    var direction = 4;
                    break;
            }

            asteroid = new Asteroid(this.game, this.ASTEROIDSCALE, this.ASTEROIDSPEED, x, y, direction);
            this.asteroids.add(asteroid);
        }

        asteroid.reset(asteroid.startX, asteroid.startY);
        asteroid.revive();
    },

    detonate: function (object, destroy, framerate) {
        this.explosionSound.play('', 0, 0.5, false, true);
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(object.x, object.y);
        explosionAnimation.play('explosion', framerate, false, true);
        if (destroy) {
            object.destroy();
        } else {
            object.kill();
        }
    },

    bulletTrainHit: function(train, bullet) {
        this.detonate(bullet, true, 100);
        this.train.health -= this.BULLET_DAMAGE;
    },

    missilePlanetHit: function (missile, planet) {
        this.detonate(missile, true, 100);
    },

    asteroidPlanetHit: function (asteroid, planet) {
        this.detonate(asteroid, false, 100);
    },

    missileAsteroidHit: function(missile, asteroid) {
        this.detonate(missile, true, 100);
        this.detonate(asteroid, false, 100);
        this.score += this.DESTROY_ASTEROID_SCORE;
    },

    missileAlienHit: function(alien, missile) {
        this.detonate(missile, true, 50);
        this.alien.health -= this.MISSILE_DAMAGE;
        this.alien.target = this.player;
        if (!this.alien.retreatedOnceAlready){
            this.alien.isAttacking = false;
            this.alien.beganRetreat = true;
        }
    },

    alienAsteroidHit: function(alien, asteroid) {
        this.detonate(asteroid, false, 100);
        this.alien.health -= this.ASTEROID_DAMAGE;
    },

    planetBulletHit: function(planet, bullet) {
        this.detonate(bullet, true, 100);
    },

    asteroidBulletHit: function (asteroid, bullet){
        this.detonate(asteroid, false, 100);
        this.detonate(bullet, true, 100);
    },

    missileBulletHit: function (missile, bullet) {
        this.detonate(missile, true, 100);
        this.detonate(bullet, true, 100);
    },

    playerBulletHit: function (player, bullet) {

        if (this.player.isShielded){
            this.boingSound.play('', 0, 0.1, false);
            this.player.shieldStrength -= this.BULLET_DAMAGE;
            bullet.destroy();
            return;
        }
        this.detonate(bullet, true, 50);
        this.player.health -= this.BULLET_DAMAGE;

        // if player collides with anything while warping, kill him
        if (this.player.isWarping){
            this.killPlayer();
        }
    },

    playerAsteroidHit: function (player, asteroid) {

        if (this.player.isShielded){
            this.boingSound.play('', 0, 0.1, false);
            this.player.shieldStrength -= this.ASTEROID_DAMAGE;
            return;
        }

        this.detonate(asteroid, false, 100);
        this.player.health -= this.ASTEROID_DAMAGE;

        // if player collides with anything while warping, kill him
        if (this.player.isWarping){
            this.killPlayer();
        }
    },

    playerAlienHit: function () {
        this.explosionSound.play('', 0, 0.1, false, true);

        // if player collides with anything while warping, kill him
        if (this.player.isWarping){
            this.killPlayer();
        }
    },

    killPlayer: function(){
        this.player.isAlive = false;
        this.gameMusic.stop();
        this.tractorBeamSound.stop();
        this.explosionSound.play('', 0, 1, false, true);
        var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
        bigExplosionAnimation.reset(this.player.x, this.player.y);
        this.player.kill();
        bigExplosionAnimation.play('big-explosion', 20, false, true).onComplete.add(function () {
            this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
            this.game.camera.setBoundsToWorld();
            var scoreboard = new Scoreboard(this.game);
            scoreboard.show(this.score, this.youBlewIt, this.explosionSound, false);
            if (this.warpLoopSound.isPlaying) {
                this.warpLoopSound.stop();
            }
            this.healthText.text = '';
            this.trainHealthText.text = '';
            this.batteryText.text = '';
            this.shieldText.text = '';
            this.warpText.text = '';
        }, this);
    },

    killAlien: function() {
        this.alien.isTractorBeamOn = false;
        this.alien.alive = false;
        this.tractorBeamSound.stop();
        this.score += this.KILL_ALIEN_SCORE;
        this.explosionSound.play('', 0, 1, false, true);
        var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
        bigExplosionAnimation.reset(this.alien.x, this.alien.y);
        bigExplosionAnimation.play('big-explosion', 500, false, true);
        this.alien.kill();
        this.alien.map.kill();
        this.aliensKilled++;
    },

    shutdown: function () {
        this.missiles.destroy();
        this.asteroids.destroy();
        this.explosions.destroy();
        this.bigExplosions.destroy();
        this.score = 0;
        this.aliensKilled = 0;
        this.player.health = this.MAXHEALTH;
        this.train.health = this.MAXHEALTH;
        this.player.turnIncrement = this.MAXTURNINCREMENT;
        this.player.maxVelocity = this.MAXVELOCITY;
        this.player.maxTurnRate = this.MAXTURNRATE;
        this.player.thrust = this.MAXTHRUST;
        this.player.isBurning = false;
        this.warpDrive = this.MAXCHARGE;
        this.map.revive();
    }
}
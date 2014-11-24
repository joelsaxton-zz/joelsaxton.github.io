/**
 * Created by joelsaxton on 11/8/14.
 */
StarPatrol.Game = function(){

    // Scaled physics and values based on this.GAME_SCALE
    this.GAME_SCALE = 0.2;
    this.GAMESIZE_Y = this.GAME_SCALE * 120000;
    this.GAMESIZE_X = this.GAMESIZE_Y * 8;
    this.MAXVELOCITY = this.GAME_SCALE * 800;
    this.WARPVELOCITY = this.MAXVELOCITY * 16;
    this.maxVelocity = this.MAXVELOCITY;
    this.MAXTHRUST = this.GAME_SCALE * 8;
    this.thrust = this.MAXTHRUST;
    this.ALIENSPEED = this.GAME_SCALE * 3200;
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
    this.planetScale = this.GAME_SCALE * 5;
    this.earthRadius = this.planetScale * 125 * 0.5;
    this.mapPlanetScale = this.GAME_SCALE * 60;
    this.BULLETLOCKDISTANCE = this.GAME_SCALE * 1200;
    this.BULLETACCELERATION = this.GAME_SCALE * 1200;
    this.MAXBULLETSPEED = this.GAME_SCALE * 4000;
    this.MAXBULLETDISTANCE = this.GAME_SCALE * 2400;

    // Timers
    this.reloadInterval = 2000;
    this.rechargeInterval = 50;
    this.warpInterval = 3000;
    this.rechargeTimer = 0;
    this.reloadTimer = 0;
    this.warpTimer = 0;
    this.alienInterval = 10000;
    this.alienTimer = 0;

    // Booleans
    this.isReloaded = true;
    this.isBurning = false;
    this.isWarping = false;

    // Scalars
    this.MAXHEALTH = 100;
    this.MAXCHARGE = 100;
    this.warpDrive = this.MAXCHARGE;
    this.warpModifier = 8;
    this.MISSILE_DAMAGE = 25;
    this.BULLET_DAMAGE = 20;
    this.ASTEROID_DAMAGE = 5;
    this.MISSILE_DISCHARGE = 50;
    this.BULLET_DISCHARGE = 100;
    this.KILL_ALIEN_SCORE = 500;
    this.DESTROY_ASTEROID_SCORE = 50;
    this.DISTRESS_HEALTH = 20;
    this.MAXTURNINCREMENT = 0.1;
    this.MAXTURNRATE = 4;
    this.MINTURNRATE = 0.2;
    this.maxTurnRate = this.MAXTURNRATE;
    this.turnincrement = this.MAXTURNINCREMENT;
    this.score = 0;
    this.turnRate = 0;
    this.mapSize_y = 50;
    this.mapSize_x = this.mapSize_y * 8;
    this.mapOffset = 4;
    this.mapGameRatio = this.mapSize_y / this.GAMESIZE_Y;
    this.asteroidDensity = 5; // Should be between 1 and 5 for playability
    this.TOTALASTEROIDS = parseInt(this.GAMESIZE_Y/250) * this.asteroidDensity;
    this.TOTALALIENS = 1; // How many appear at any one time
    this.aliensKilled = 0;
};

StarPatrol.Game.prototype = {
    create: function() {

        // Enable physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add debug plugin
        //this.game.add.plugin(Phaser.Plugin.Debug);

        // Set world size
        this.game.world.setBounds(0, 0, this.GAMESIZE_X, this.GAMESIZE_Y);

        //  Our tiled scrolling background
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.background.fixedToCamera = true;

        // Add sprites
        this.player = this.add.sprite(200, this.world.centerY, 'player');
        this.map = this.add.sprite(this.game.width - (this.mapSize_x) - this.mapOffset, this.mapOffset, 'map');
        this.map.scale.setTo(0.5); // To match this.mapSize_y ratio
        this.playerMap = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.player.x * this.mapGameRatio), parseInt(this.player.y * this.mapGameRatio) + this.mapOffset, 'playermap');

        // Build solar system with planet and Planet map sprites
        this.earth = this.add.sprite(this.GAMESIZE_Y * 7.8 - this.earthRadius, this.world.centerY - this.earthRadius, 'earth');
        this.mapEarth = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.earth.x * this.mapGameRatio), parseInt(this.earth.y * this.mapGameRatio) + this.mapOffset, 'earth');
        this.pluto = this.add.sprite(this.GAMESIZE_Y * 0.2 - this.earthRadius, this.world.centerY - this.earthRadius, 'pluto');
        this.mapPluto = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.pluto.x * this.mapGameRatio), parseInt(this.pluto.y * this.mapGameRatio) + this.mapOffset, 'pluto');
        this.neptune = this.add.sprite(this.GAMESIZE_Y * 0.8 - this.earthRadius, this.world.centerY - this.earthRadius, 'neptune');
        this.mapNeptune = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.neptune.x * this.mapGameRatio), parseInt(this.neptune.y * this.mapGameRatio) + this.mapOffset, 'neptune');
        this.uranus = this.add.sprite(this.GAMESIZE_Y * 2.5 - this.earthRadius, this.world.centerY - this.earthRadius, 'uranus');
        this.mapUranus = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.uranus.x * this.mapGameRatio), parseInt(this.uranus.y * this.mapGameRatio) + this.mapOffset, 'uranus');
        this.saturn = this.add.sprite(this.GAMESIZE_Y * 4.0 - this.earthRadius, this.world.centerY - this.earthRadius, 'saturn');
        this.mapSaturn = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.saturn.x * this.mapGameRatio), parseInt(this.saturn.y * this.mapGameRatio) + this.mapOffset, 'saturn');
        this.jupiter = this.add.sprite(this.GAMESIZE_Y * 5.2 - this.earthRadius, this.world.centerY - this.earthRadius, 'jupiter');
        this.mapJupiter = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.jupiter.x * this.mapGameRatio), parseInt(this.jupiter.y * this.mapGameRatio) + this.mapOffset, 'jupiter');
        this.mars = this.add.sprite(this.GAMESIZE_Y * 7 - this.earthRadius, this.world.centerY - this.earthRadius, 'mars');
        this.mapMars = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.mars.x * this.mapGameRatio), parseInt(this.mars.y * this.mapGameRatio) + this.mapOffset, 'mars');

        // Fix map to camera
        this.map.fixedToCamera = true;

        // Planets
        this.planets = this.game.add.group();

        // Earth
        this.earth.anchor.setTo(0.5);
        this.earth.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.earth);
        this.earth.body.immovable = true;
        this.mapEarth.fixedToCamera = true;
        this.mapEarth.anchor.setTo(0.5);
        this.mapEarth.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.planets.add(this.earth);
        // Pluto
        this.pluto.anchor.setTo(0.5);
        this.pluto.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.pluto);
        this.pluto.body.immovable = true;
        this.mapPluto.fixedToCamera = true;
        this.mapPluto.anchor.setTo(0.5);
        this.mapPluto.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.planets.add(this.pluto);
        // Neptune
        this.neptune.anchor.setTo(0.5);
        this.neptune.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.neptune);
        this.neptune.body.immovable = true;
        this.mapNeptune.fixedToCamera = true;
        this.mapNeptune.anchor.setTo(0.5);
        this.mapNeptune.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.planets.add(this.neptune);
        // Uranus
        this.uranus.anchor.setTo(0.5);
        this.uranus.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.uranus);
        this.uranus.body.immovable = true;
        this.mapUranus.fixedToCamera = true;
        this.mapUranus.anchor.setTo(0.5);
        this.mapUranus.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.planets.add(this.uranus);
        // Saturn
        this.saturn.anchor.setTo(0.5);
        this.saturn.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.saturn);
        this.saturn.body.immovable = true;
        this.mapSaturn.fixedToCamera = true;
        this.mapSaturn.anchor.setTo(0.5);
        this.mapSaturn.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.saturn.angle = 45;
        this.mapSaturn.angle = 45;
        this.planets.add(this.saturn);
        // Jupiter
        this.jupiter.anchor.setTo(0.5);
        this.jupiter.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.jupiter);
        this.jupiter.body.immovable = true;
        this.mapJupiter.fixedToCamera = true;
        this.mapJupiter.anchor.setTo(0.5);
        this.mapJupiter.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.planets.add(this.jupiter);
        // Mars
        this.mars.anchor.setTo(0.5);
        this.mars.scale.setTo(this.planetScale);
        this.game.physics.arcade.enableBody(this.mars);
        this.mars.body.immovable = true;
        this.mapMars.fixedToCamera = true;
        this.mapMars.anchor.setTo(0.5);
        this.mapMars.scale.setTo(this.mapGameRatio*this.mapPlanetScale);
        this.planets.add(this.mars);

        // Player parameters
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(this.playerScale);
        this.player.health = this.MAXHEALTH;
        this.player.charge = this.MAXCHARGE;
        this.player.isAlive = true;
        this.playerMap.fixedToCamera = true;
        this.playerMap.anchor.setTo(0.5);
        this.playerMap.scale.setTo(2);
        this.game.physics.arcade.enableBody(this.player);
        this.player.body.bounce.set(0.4);
        this.player.body.maxVelocity.setTo(this.maxVelocity, this.maxVelocity);
        this.player.checkWorldBounds = true;
        this.player.body.collideWorldBounds = true;

        // Set animations
        this.player.animations.add('drift', [0,0,0,0,0,0,0,4,5,6,7]);
        this.player.animations.add('thrust', [1,2,3,2]);
        this.player.animations.add('burning', [8]);
        this.player.animations.play('drift', 20, true);
        this.playerMap.animations.add('tracking', [0,1]);
        this.playerMap.animations.play('tracking', 10, true);

        // Set Camera
        this.game.camera.follow(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(this.game.width/2, this.game.height/2, this.game.width/8, this.game.height/8);
        this.game.camera.focusOnXY(0, 0);

        // Set sprite groups
        this.aliens = this.game.add.group();
        this.alien = this.createAlien(); // Create alien and add to group
        this.aliens.add(this.alien);
        this.alienMap = this.add.sprite(this.game.width - this.mapSize_x - this.mapOffset + parseInt(this.alien.x * this.mapGameRatio), parseInt(this.alien.y * this.mapGameRatio) + this.mapOffset, 'alienmap');
        this.alienMap.fixedToCamera = true;
        this.alienMap.anchor.setTo(0.5);
        this.alienMap.scale.setTo(2);
        this.alienMap.animations.add('tracking', [0,1]);
        this.alienMap.animations.play('tracking', 10, true);

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
        this.batteryText = this.game.add.bitmapText(10,55, 'minecraftia', 'Charge: ' + this.player.charge, 10);
        this.warpText = this.game.add.bitmapText(10,70, 'minecraftia', 'Warp Drive: ' + this.warpDrive, 10);
        this.reloadedText = this.game.add.bitmapText(10,85, 'minecraftia', 'Reloaded: ' + this.isReloaded, 10);
        this.reloadedText.tint = 0x66CD00; // '#66CD00'
        this.batteryText.tint = 0xFF0000; // '#FF0000'
        this.scoreText.fixedToCamera = true;
        this.batteryText.fixedToCamera = true;
        this.reloadedText.fixedToCamera = true;
        this.healthText.fixedToCamera = true;
        this.warpText.fixedToCamera = true;

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
        this.gameMusic.play('', 0, 0.1, true, true);

        // Set inputs
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spacebar.onDown.add(this.fireMissile,this);
    },

    update: function() {
        if (this.player.isAlive){
            this.updateCamera();
            this.updateMapPositions();
            this.checkPlayerMotionInputs();
            this.applyGravity();
            this.updateTimers();
            this.checkCollisions();
            this.updateAsteroids();
            this.updateHealth();
        }

        if (this.alien.alive){
            this.updateAlien();
        }

        this.updateProjectiles();
        this.updateAllText();
    },

    updateAllText: function() {
        this.healthText.text = 'Hull: ' + this.player.health;
        this.reloadedText.text = 'Reloaded: ' + this.isReloaded;
        this.batteryText.text = 'Charge: ' + this.player.charge;
        this.scoreText.text = 'Score: ' + this.score;
        this.warpText.text = 'Warp Drive: ' + parseInt(this.warpDrive);
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
            this.isBurning = true;
            this.player.animations.play('burning', 20, true);
            this.thrust = this.MAXTHRUST * 0.5;
            this.maxVelocity = this.MAXVELOCITY * 0.5;
            this.turnincrement = this.MAXTURNINCREMENT * 0.5;
            this.maxTurnRate = this.MAXTURNRATE * 0.5;
        }
        if (this.player.health <= 0) {
            this.killPlayer();
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
        // Update positions/layering on Star Map
        this.map.bringToTop();
        this.mapEarth.bringToTop();
        this.mapPluto.bringToTop();
        this.mapNeptune.bringToTop();
        this.mapUranus.bringToTop();
        this.mapSaturn.bringToTop();
        this.mapJupiter.bringToTop();
        this.mapMars.bringToTop();
        this.playerMap.fixedToCamera = false;
        this.playerMap.x = this.game.width - this.mapSize_x + parseInt(this.player.x * this.mapGameRatio) - this.mapOffset;
        this.playerMap.y = parseInt(this.player.y * this.mapGameRatio) + this.mapOffset;
        this.playerMap.fixedToCamera = true;
        this.playerMap.bringToTop();

        this.alienMap.fixedToCamera = false;
        this.alienMap.x = this.game.width - this.mapSize_x + parseInt(this.alien.x * this.mapGameRatio) - this.mapOffset;
        this.alienMap.y = parseInt(this.alien.y * this.mapGameRatio) + this.mapOffset;
        this.alienMap.fixedToCamera = true;
        this.alienMap.bringToTop();
    },

    fireMissile: function () {
        if (this.isReloaded && this.player.charge >= this.MISSILE_DISCHARGE) {
            this.missileSound.play('', 0, 0.1, false, true);
            this.createMissile(this.player.x, this.player.y, this.player.angle);
            this.isReloaded = false;
            this.player.charge -= this.MISSILE_DISCHARGE;
        }

        // if player fires missile while warping, kill him
        if (this.isWarping) {
            this.killPlayer();
        }
    },

    checkPlayerMotionInputs: function() {
        // Decide animation
        if (!this.cursors.up.isDown){
            if (!this.isBurning) {
                this.player.animations.play('drift', 20, true);
            }
        }

        // Check if player overused warp drive and kill him
        if (this.isWarping && this.warpDrive < 0){
            this.killPlayer();
        }

        // Use warp drive
        if (this.cursors.down.isDown && this.warpDrive > 0) {

            // play warp-on sound
            if (!this.isWarping) {
                this.warpSound.play('', 0, 0.5, false);
                this.warpStartSound.play('', 0, 0.8, false);
            }

            // play warp loop sound
            if (!this.warpLoopSound.isPlaying) {
                this.warpLoopSound.play('', 0, 0.05, true);
            }

            this.player.body.maxVelocity.setTo(this.WARPVELOCITY, this.WARPVELOCITY);
            this.isWarping = true;
            this.warpDrive -= 0.2;
            var x_component = Math.cos((this.player.angle + 270) * Math.PI / 180);
            var y_component = Math.sin((this.player.angle + 270) * Math.PI / 180);
            this.player.body.velocity.x += this.thrust * this.warpModifier * x_component;
            this.player.body.velocity.y += this.thrust * this.warpModifier * y_component;
        } else if (this.isWarping) {
            this.isWarping = false;
            this.player.body.maxVelocity.setTo(this.maxVelocity, this.maxVelocity);
            this.warpDownSound.play('', 0, 0.8, false);
            this.warpLoopSound.stop();
        }


        // Change direction and thrust only if not warping
        if (!this.isWarping) {
            // Thrust
            if (this.cursors.up.isDown) {
                if (!this.isBurning) {
                    this.player.animations.play('thrust');
                }
                var x_component = Math.cos((this.player.angle + 270) * Math.PI / 180);
                var y_component = Math.sin((this.player.angle + 270) * Math.PI / 180);
                this.player.body.velocity.x += this.thrust * x_component;
                this.player.body.velocity.y += this.thrust * y_component;

                // Adjust turn rate if thrusting
                if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
                    if (Math.abs(this.turnRate) <= this.MINTURNRATE) {
                        this.turnRate = 0;
                    } else if (this.turnRate > 0) {
                        this.turnRate -= this.turnincrement;
                    } else {
                        this.turnRate += this.turnincrement;
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
                if (this.turnRate <= this.maxTurnRate) {
                    this.turnRate += this.turnincrement;
                }
                this.player.angle += this.turnRate;
                this.isTurning = true;

            } // turn LEFT
            else if (this.cursors.left.isDown) {   //  Move to the left
                if (-this.turnRate <= this.maxTurnRate) {
                    this.turnRate -= this.turnincrement;
                }
                this.player.angle += this.turnRate;
                this.isTurning = true;
            } // continue rotation
            else if (this.isTurning) {
                this.player.angle += this.turnRate;
            }
        }
    },

    // Ship max velocity constraint - @todo - apply function to ships
    constrainVelocity: function (sprite, maxVelocity) {
        if (!sprite || !sprite.body) {
            return;
        }
        var body = sprite.body;
        var angle, currVelocitySqr, vx, vy;
        vx = body.data.velocity[0];
        vy = body.data.velocity[1];
        currVelocitySqr = vx * vx + vy * vy;
        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            body.data.velocity[0] = vx;
            body.data.velocity[1] = vy;
            console.log('limited speed to: ' + maxVelocity);
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
                if (this.game.physics.arcade.distanceBetween(bullet, this.player) > this.BULLETLOCKDISTANCE) {
                    this.game.physics.arcade.accelerateToObject(bullet, this.player, this.BULLETACCELERATION, this.MAXBULLETSPEED, this.MAXBULLETSPEED);
                } else {
                    this.game.physics.arcade.moveToObject(bullet, this.player, parseInt(this.player.body.speed) * 10);
                }
                if (bullet.lifespan < this.game.time.now) {
                    this.detonate(bullet, true, 100);
                }
            }
        }, this);
    },

    updateAlien: function() { // @todo - make alien smarter
            // Alien chases ship
            this.alien.rotation = game.physics.arcade.angleBetween(this.alien, this.player);
            this.game.physics.arcade.moveToObject(this.alien, this.player, this.ALIENSPEED, 2000);

            if (this.alien.charge >= this.BULLET_DISCHARGE){
                if (this.bullets.countLiving() < 2 && this.game.physics.arcade.distanceBetween(this.alien, this.player) < this.MAXBULLETDISTANCE){
                    this.bulletSound.play('', 0, 1, false, true);
                    this.createBullet(this.alien.x , this.alien.y);
                    this.alien.charge -= this.BULLET_DISCHARGE;
                }
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

    updateTimers: function () {
        // Alien appearance timer
        if (this.alienTimer < this.game.time.now) {
            this.alienTimer = this.game.time.now + this.alienInterval;
            if (this.aliens.countLiving() < this.TOTALALIENS) {
                this.alien = this.createAlien();
                this.aliens.add(this.alien);
                this.alienMap.revive();
            }
        }
        // Reload timer
        if (this.reloadTimer < this.game.time.now) {
            this.reloadTimer = this.game.time.now + this.reloadInterval;
            this.isReloaded = true;
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
        this.game.physics.arcade.collide(this.player, this.planets, this.playerPlanetHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.planets, this.missilePlanetHit, null, this);
        this.game.physics.arcade.collide(this.asteroids, this.planets, this.asteroidPlanetHit, null, this);
        this.game.physics.arcade.collide(this.player, this.bullets, this.playerBulletHit, null, this);
        this.game.physics.arcade.collide(this.planets, this.bullets, this.planetBulletHit, null, this);
        this.game.physics.arcade.collide(this.asteroids, this.bullets, this.asteroidBulletHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.bullets, this.missileBulletHit, null, this);
        this.game.physics.arcade.collide(this.alien, this.asteroids, this.alienAsteroidHit, null, this);
        this.game.physics.arcade.collide(this.alien, this.planets, this.alienPlanetHit, null, this);
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
        } else {
            alien = new Alien(this.game, x, y, this.MAXCHARGE, this.MAXHEALTH, this.alienScale);
        }
        return alien;
    },

    createAsteroid: function () {
        var asteroid = this.asteroids.getFirstDead();
        if (!asteroid) {
            var start = this.game.rnd.integerInRange(1, 18);
            if (start == 1){
                var x = this.game.world.bounds.width;
                var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                var direction = 1;
            }
            if (start == 2){
                var x = 0;
                var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                var direction = 2;
            }
            if (start >= 3 && start <= 10){
                var x = this.game.rnd.integerInRange(0, this.game.world.bounds.width);
                var y = this.game.world.bounds.height;
                var direction = 3;
            }
            if (start >= 11 && start <= 18){
                var x = this.game.rnd.integerInRange(0, this.game.world.bounds.width);
                var y = 0;
                var direction = 4;
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

    playerPlanetHit: function () {
        this.explosionSound.play('', 0, 0.2, false, true);
        this.player.health--;

        // if player collides with anything while warping, kill him
        if (this.isWarping){
            this.killPlayer();
        }
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
    },

    alienAsteroidHit: function(alien, asteroid) {
        this.detonate(asteroid, false, 100);
        this.alien.health -= this.ASTEROID_DAMAGE;
    },

    alienPlanetHit: function(alien, planet) {
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
        this.detonate(bullet, true, 50);
        this.player.health -= this.BULLET_DAMAGE;

        // if player collides with anything while warping, kill him
        if (this.isWarping){
            this.killPlayer();
        }
    },

    playerAsteroidHit: function (player, asteroid) {
        this.detonate(asteroid, false, 100);
        this.player.health -= this.ASTEROID_DAMAGE;

        // if player collides with anything while warping, kill him
        if (this.isWarping){
            this.killPlayer();
        }
    },

    playerAlienHit: function () {
        this.explosionSound.play('', 0, 0.1, false, true);

        // if player collides with anything while warping, kill him
        if (this.isWarping){
            this.killPlayer();
        }
    },

    killPlayer: function(){

        // Kill warp drive if on
        if (this.warpLoopSound.isPlaying) {
            this.warpLoopSound.stop();
        }
        this.player.isAlive = false;
        this.gameMusic.stop();
        this.explosionSound.play('', 0, 1, false, true);
        var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
        bigExplosionAnimation.reset(this.player.x, this.player.y);
        this.player.kill();
        this.healthText.text = 'Hull: DESTROYED';
        this.batteryText.text = '';
        this.reloadedText.text = '';
        this.warpText.text = '';
        bigExplosionAnimation.play('big-explosion', 20, false, true).onComplete.add(function () {
            this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
            this.game.camera.setBoundsToWorld();
            var scoreboard = new Scoreboard(this.game);
            scoreboard.show(this.score, this.youBlewIt, this.explosionSound);
        }, this);
    },

    killAlien: function() {
        this.alien.alive = false;
        this.score += this.KILL_ALIEN_SCORE;
        this.explosionSound.play('', 0, 1, false, true);
        var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
        bigExplosionAnimation.reset(this.alien.x, this.alien.y);
        bigExplosionAnimation.play('big-explosion', 500, false, true);
        this.alien.kill();
        this.alienMap.kill();
        this.aliensKilled++;
    },

    shutdown: function () {
        this.missiles.destroy();
        this.asteroids.destroy();
        this.explosions.destroy();
        this.bigExplosions.destroy();
        this.score = 0;
        this.player.health = this.MAXHEALTH;
        this.turnincrement = this.MAXTURNINCREMENT;
        this.maxVelocity = this.MAXVELOCITY;
        this.maxTurnRate = this.MAXTURNRATE;
        this.thrust = this.MAXTHRUST;
        this.isBurning = false;
        this.warpDrive = this.MAXCHARGE;
        this.map.revive();
    }
}
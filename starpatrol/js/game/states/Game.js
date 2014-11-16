/**
 * Created by joelsaxton on 11/8/14.
 */
StarPatrol.Game = function(){
    this.score = 0;
    this.isReloaded = true;
    this.reloadInterval = 1000;
    this.rechargeInterval = 50;
    this.asteroidInterval = 1000;
    this.rechargeTimer = 0;
    this.reloadTimer = 0;
    this.asteroidTimer = 0;
    this.spawnX = null;
    this.health = 100;
    this.turnincrement = 0.1;
    this.turnRate = 0;
    this.MAXCHARGE = 100;
    this.charge = this.MAXCHARGE;
    this.maxvelocity = 400;
    this.maxturn = 4;
    this.thrust = 6;
    this.MISSILE_DAMAGE = 30;
    this.MISSILE_DISCHARGE = 50;
    this.health = 100;
    this.isBurning = false;
    this.ALIENTURNRATE = 0.1;
    this.ALIENSPEED = 600;
    this.TOTALASTEROIDS = 50; // Can't figure out how to use this properly
    this.asteroidCount = 0;
    this.GRAVITY = 400;
    this.GRAVITYRANGE = 4000;
    this.GAMESIZE = 16000;
    this.mapSize = 100;
    this.mapGameRatio = this.mapSize / this.GAMESIZE;
    this.mapEarthScale = 8;
};

StarPatrol.Game.prototype = {
    create: function() {
        //  Resize our game world to this.GAMESIZE in x and y dimensions
        this.game.world.setBounds(0, 0, this.GAMESIZE, this.GAMESIZE);
        //this.game.onShutDownCallback(this.shutdown);

        //  Our tiled scrolling background
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.background.fixedToCamera = true;
        this.earth = this.add.sprite(this.world.centerX, this.world.centerY, 'earth');
        this.player = this.add.sprite(this.world.centerX/2, this.world.centerY/2, 'player');
        this.alien1 = this.add.sprite(this.world.centerX/2, this.world.centerY, 'alien1');
        this.map = this.add.sprite(this.game.width - this.mapSize, 0, 'map');
        this.mapEarth = this.add.sprite(this.game.width - this.mapSize + parseInt(this.earth.x * this.mapGameRatio), parseInt(this.earth.y * this.mapGameRatio), 'earth');
        this.playerMap = this.add.sprite(this.game.width - this.mapSize + parseInt(this.player.x * this.mapGameRatio), parseInt(this.player.y * this.mapGameRatio), 'playermap');
        this.alienMap = this.add.sprite(this.game.width - this.mapSize + parseInt(this.alien1.x * this.mapGameRatio), parseInt(this.alien1.y * this.mapGameRatio), 'alienmap');

        this.map.fixedToCamera = true;
        this.mapEarth.fixedToCamera = true;
        this.playerMap.fixedToCamera = true;
        this.alienMap.fixedToCamera = true;
        this.alienMap.anchor.setTo(0.5);
        this.alienMap.scale.setTo(4);
        this.playerMap.anchor.setTo(0.5);
        this.playerMap.scale.setTo(4);
        this.earth.anchor.setTo(0.5);
        this.earth.scale.setTo(1);
        this.mapEarth.anchor.setTo(0.5);
        this.mapEarth.scale.setTo(this.mapGameRatio*this.mapEarthScale);
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(0.5);
        this.alien1.anchor.setTo(0.5);
        this.alien1.scale.setTo(0.5);

        this.game.physics.arcade.enableBody(this.earth);
        this.earth.body.immovable = true;

        this.player.animations.add('drift', [0,0,0,0,0,0,0,4,5,6,7]);
        this.player.animations.add('thrust', [1,2,3,2]);
        this.player.animations.add('burning', [8]);
        this.player.animations.play('drift', 20, true);
        this.player.isAlive = true;

        this.playerMap.animations.add('tracking', [0,1]);
        this.playerMap.animations.play('tracking', 10, true);
        this.alienMap.animations.play('tracking', 10, true);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = false;
        this.player.body.bounce.set(0.5);
        this.player.body.maxVelocity.setTo(this.maxvelocity, this.maxvelocity);

        this.game.physics.arcade.enableBody(this.alien1);
        this.alien1.body.collideWorldBounds = false;
        this.alien1.body.bounce.set(0.25);
        this.alien1.health = 100;

        // Camera for player
        this.game.camera.follow(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(this.game.width/2, this.game.height/2, this.game.width/8, this.game.height/8);
        this.game.camera.focusOnXY(0, 0);

        this.missiles = this.game.add.group();
        this.missiles.setAll('anchor.x', 0.5);
        this.missiles.setAll('anchor.y', 0.5);
        this.missiles.setAll('checkWorldBounds', true);

        this.asteroids = this.game.add.group();
        this.asteroids.setAll('anchor.x', 0.5);
        this.asteroids.setAll('anchor.y', 0.5);
        this.asteroids.setAll('checkWorldBounds', true);

        //  Explosion pool
        this.explosions = game.add.group();
        for (var i = 0; i < 10; i++)
        {
            var explosionAnimation = this.explosions.create(0, 0, 'explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('explosion');
        }

        //  Big Explosion pool
        this.bigExplosions = game.add.group();
        for (var i = 0; i < 5; i++)
        {
            var explosionAnimation = this.bigExplosions.create(0, 0, 'big-explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('big-explosion');
        }

        this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: ' + this.score, 20);
        this.healthText = this.game.add.bitmapText(10,50, 'minecraftia', 'Hull: ' + this.health, 16);
        this.batteryText = this.game.add.bitmapText(10,70, 'minecraftia', 'Reloaded: ' + this.charge, 16);
        this.reloadedText = this.game.add.bitmapText(10,90, 'minecraftia', 'Reloaded: ' + this.isReloaded, 16);
        this.reloadedText.tint = 0x66CD00; // '#66CD00'
        this.batteryText.tint = 0xFF0000; // '#FF0000'
        this.scoreText.fixedToCamera = true;
        this.batteryText.fixedToCamera = true;
        this.reloadedText.fixedToCamera = true;
        this.healthText.fixedToCamera = true;

        this.jetSound = this.game.add.audio('rocket');
        this.missileSound = this.game.add.audio('missile');
        this.explosionSound = this.game.add.audio('explosion');
        this.gameMusic = this.game.add.audio('gameMusic');
        this.youBlewIt = this.game.add.audio('youblewit');
        this.gameMusic.play('', 0, 0.1, true, true);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },


    // Asteroid out of bounds
    killAsteroid: function(asteroid) {
        asteroid.kill();
        console.log("asteroid destroyed");
        this.asteroidCount--;
    },

    update: function() {

        // Check if sprites crossed world bounds
        if (this.player.x > this.world.width){
            this.player.x = 0;
        }
        if (this.player.x < 0){
            this.player.x = this.world.width;
        }
        if (this.player.y > this.world.height){
            this.player.y = 0;
        }
        if (this.player.y < 0){
            this.player.y = this.world.height;
        }

        // Update positions on Star Map
        this.playerMap.fixedToCamera = false;
        this.playerMap.x = this.game.width - this.mapSize + parseInt(this.player.x * this.mapGameRatio);
        this.playerMap.y = parseInt(this.player.y * this.mapGameRatio);
        this.playerMap.fixedToCamera = true;

        this.alienMap.fixedToCamera = false;
        this.alienMap.x = this.game.width - this.mapSize + parseInt(this.alien1.x * this.mapGameRatio);
        this.alienMap.y = parseInt(this.alien1.y * this.mapGameRatio);
        this.alienMap.fixedToCamera = true;


        // Alien chases ship
        this.alien1.rotation = game.physics.arcade.angleBetween(this.alien1, this.player);
        this.game.physics.arcade.moveToObject(this.alien1, this.player, this.ALIENSPEED, 2000);


        this.distanceFromEarth = Math.pow(this.earth.body.x/10 - this.player.body.x/10, 2) + Math.pow(this.earth.body.y/10 - this.player.body.y/10, 2)
        // Gravity
        if (this.distanceFromEarth < this.GRAVITYRANGE) {
            this.player.body.allowGravity = true;
            this.player.body.gravity = new Phaser.Point(this.earth.body.x - this.player.body.x, this.earth.body.y - this.player.body.y);
            this.player.body.gravity = this.player.body.gravity.normalize().multiply(this.GRAVITY, this.GRAVITY);
        } else {
            this.player.body.allowGravity = false;
        }

        // Camera
        this.background.tilePosition.x = -game.camera.x;
        this.background.tilePosition.y = -game.camera.y;

        if(this.reloadTimer < this.game.time.now) {
            this.reloadTimer = this.game.time.now + this.reloadInterval;
            this.isReloaded = true;
            this.reloadedText.text = 'Reloaded: ' + this.isReloaded;
        }

        if(this.rechargeTimer < this.game.time.now) {
            this.rechargeTimer = this.game.time.now + this.rechargeInterval;
            if (this.charge < this.MAXCHARGE) {
                this.charge++;
            }
            this.batteryText.text = 'Charge: ' + this.charge;
        }

        // Create asteroid
        if(this.asteroidTimer < this.game.time.now) {
            this.asteroidTimer = this.game.time.now + this.asteroidInterval;
            this.createAsteroid();
        }

        // Fire missile
        if(this.spacebar.isDown) {
            if (this.isReloaded && this.charge >= this.MISSILE_DISCHARGE){
                this.missileSound.play('', 0, 0.1, false, true);
                this.createMissile(this.player.x , this.player.y, this.player.angle);
                this.isReloaded = false;
                this.reloadedText.text = 'Reloaded: ' + this.isReloaded;
                this.charge -= this.MISSILE_DISCHARGE;
            }
        }

        // Ship max velocity constraint - @todo - apply function to player
        function constrainVelocity(sprite, maxVelocity) {    if (!sprite || !sprite.body) {return;}
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
                console.log('limited speed to: '+maxVelocity);
            }
        };

        // Ship control functions
        if (!this.cursors.up.isDown){
            if (!this.isBurning) {
                this.player.animations.play('drift', 20, true);
            }
        }

        if(this.cursors.up.isDown) {
            if (!this.isBurning) {
                this.player.animations.play('thrust');
            }
            var x_component = Math.cos((this.player.angle + 270) * Math.PI / 180);
            var y_component = Math.sin((this.player.angle + 270) * Math.PI / 180);
            this.player.body.velocity.x += this.thrust * x_component;
            this.player.body.velocity.y += this.thrust * y_component;

            // Turn/thrust logic
            if(!this.cursors.right.isDown && !this.cursors.left.isDown){
                if (Math.abs(this.turnRate) <= 0.2){
                    this.turnRate = 0;
                } else if (this.turnRate > 0){
                    this.turnRate -= this.turnincrement;
                } else {
                    this.turnRate += this.turnincrement;
                }
            }

            if(!this.jetSound.isPlaying) {
                this.jetSound.play('', 0, 0.1, false, true);
            } else {
                this.jetSound.stop();
            }
        }

        // turn RIGHT
        if (this.cursors.right.isDown)
        {   //  Move to the right
            if (this.turnRate <= this.maxturn){
                this.turnRate += this.turnincrement;
            }
            this.player.angle += this.turnRate;
            this.isTurning = true;

        } // turn LEFT
        else if (this.cursors.left.isDown)
        {   //  Move to the left
            if (-this.turnRate <= this.maxturn){
                this.turnRate -= this.turnincrement;
            }
            this.player.angle += this.turnRate;
            this.isTurning = true;
        }
        else if (this.isTurning) {
            this.player.angle += this.turnRate;
        }

        // Collisions
        this.game.physics.arcade.collide(this.missiles, this.asteroids, this.missileAsteroidHit, null, this);
        this.game.physics.arcade.collide(this.player, this.asteroids, this.playerAsteroidHit, null, this);
        this.game.physics.arcade.collide(this.player, this.alien1, this.playerAlienHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.alien1, this.missileAlienHit, null, this);
        this.game.physics.arcade.collide(this.player, this.earth, this.playerEarthHit, null, this);
        this.game.physics.arcade.collide(this.missiles, this.earth, this.missileEarthHit, null, this);
        this.game.physics.arcade.collide(this.asteroids, this.earth, this.asteroidEarthHit, null, this);

    },

    createMissile: function(x, y, angle) {
        var missile = new Missile(this.game, x, y, angle);
        this.missiles.add(missile);
        missile.reset(this.player.x, this.player.y);
        missile.revive();
    },

    createAsteroid: function () {

        if (this.asteroidCount < this.TOTALASTEROIDS) {
            var start = this.game.rnd.integerInRange(1, 4);
            switch (start) {
                case 1:
                    var x = this.game.world.bounds.width;
                    var y = this.game.rnd.integerInRange(0, this.game.world.bounds.height);
                    var direction = 1;
                    break;
                case 2:
                    var x = this.game.world.bounds.x;
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
                    var y = this.game.world.bounds.y;
                    var direction = 4;
                    break;
            }

            var asteroid = this.asteroids.getFirstDead();
            if (!asteroid) {
                asteroid = new Asteroid(this.game, x, y, direction);
                asteroid.events.onOutOfBounds.add(this.killAsteroid, asteroid);
                this.asteroids.add(asteroid);
            }

            asteroid.reset(x, y);
            asteroid.revive();
            this.asteroidCount++;
        }
    },

    playerEarthHit: function () {
        this.explosionSound.play('', 0, 0.2, false, true);
        this.killPlayer();
    },

    missileEarthHit: function (earth, missile) {
        this.explosionSound.play('', 0, 0.2, false, true);
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(missile.x, missile.y);
        explosionAnimation.play('explosion', 100, false, true);
        missile.destroy();
    },

    asteroidEarthHit: function (earth, asteroid) {
        this.explosionSound.play('', 0, 0.2, false, true);
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(asteroid.x, asteroid.y);
        explosionAnimation.play('explosion', 100, false, true);
        asteroid.kill();
    },

    missileAsteroidHit: function(asteroid, missile) {
        setTimeout(function(){
            missile.destroy();
            asteroid.kill();
        }, 100);
        this.explosionSound.play('', 0, 0.8, false, true);
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(asteroid.x, asteroid.y);
        explosionAnimation.play('explosion', 100, false, true);
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    missileAlienHit: function(alien, missile) {
        this.explosionSound.play('', 0, 0.8, false, true);
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(missile.x, missile.y);
        missile.destroy();
        explosionAnimation.play('explosion', 100, false, true);
        this.alien1.health -=20;

        if (this.alien1.health <= 0){
            this.score += 200;
            this.scoreText.text = 'Score: ' + this.score;
            this.alien1.body.angularVelocity = 50;
            this.explosionSound.play('', 0, 1, false, true);
            var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
            bigExplosionAnimation.reset(this.alien1.x, this.alien1.y);
            bigExplosionAnimation.play('big-explosion', 500, false, true);
            var deathTween = this.game.add.tween(this.alien1.scale).to({
                x: 1.1,
                y: 1.1
            }, 50, Phaser.Easing.Linear.NONE, true, 0, 1, true);
            deathTween.onComplete.add(function () {
                this.explosionSound.play('', 0, 1, false, true);
                var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
                bigExplosionAnimation.reset(this.alien1.x, this.alien1.y);
                bigExplosionAnimation.play('big-explosion', 500, false, true);
                this.alien1.kill();
                this.alienMap.kill();
            }, this);
        }
    },

    playerAsteroidHit: function(player, asteroid) {
        if (this.player.isAlive) {
            asteroid.kill();
            this.explosionSound.play('', 0, 0.8, false, true);
            var explosionAnimation = this.explosions.getFirstExists(false);
            explosionAnimation.reset(asteroid.x, asteroid.y);
            explosionAnimation.play('explosion', 100, false, true);

            this.health -= 30;
            this.healthText.text = 'Hull: ' + this.health;

            if (this.health <= 50) {
                this.isBurning = true;
                this.player.animations.play('burning', 20, true);
                this.thrust = 0.5;
                this.maxvelocity = 100;
                this.turnincrement = 0.02;
                this.maxturn = 1;
            }

            if (this.health <= 0) {
                this.player.isAlive = false;
                this.healthText.text = 'Hull: DESTROYED';
                this.explosionSound.play('', 0, 1, false, true);
                var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
                bigExplosionAnimation.reset(this.player.x, this.player.y);
                bigExplosionAnimation.play('big-explosion', 100, false, true);
                this.missiles.setAll('body.velocity.x', 0);
                this.missiles.setAll('body.velocity.y', 0);
                this.asteroids.setAll('body.velocity.x', 0);
                this.asteroids.setAll('body.velocity.y', 0);
                this.asteroidTimer = Number.MAX_VALUE;
                this.killPlayer();
            }
        }
    },

    playerAlienHit: function() {
        if (this.player.isAlive) {
            this.explosionSound.play('', 0, 0.8, false, true);
            var explosionAnimation = this.explosions.getFirstExists(false);
            explosionAnimation.reset(this.player.x, this.player.y);
            explosionAnimation.play('explosion', 100, false, true);

            this.player.isAlive = false;
            this.healthText.text = 'Hull: DESTROYED';
            this.explosionSound.play('', 0, 1, false, true);
            var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
            bigExplosionAnimation.reset(this.player.x, this.player.y);
            bigExplosionAnimation.play('big-explosion', 40, false, true);
            this.missiles.setAll('body.velocity.x', 0);
            this.missiles.setAll('body.velocity.y', 0);
            this.asteroids.setAll('body.velocity.x', 0);
            this.asteroids.setAll('body.velocity.y', 0);
            this.asteroidTimer = Number.MAX_VALUE;
            this.killPlayer();
        }

    },

    killPlayer: function(){
        this.gameMusic.stop();
        var deathTween = this.game.add.tween(this.player.scale).to({
            x: 0.55,
            y: 0.55
        }, 50, Phaser.Easing.Linear.None, true, 0, 6, true);
        deathTween.onComplete.add(function () {
            this.explosionSound.play('', 0, 1, false, true);
            var bigExplosionAnimation = this.bigExplosions.getFirstExists(false);
            bigExplosionAnimation.reset(this.player.x, this.player.y);
            this.player.kill();
            this.youBlewIt.play('', 0, 0.8, false, true);
            bigExplosionAnimation.play('big-explosion', 20, false, true).onComplete.add(function(){
                this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
                this.game.camera.setBoundsToWorld();
                var scoreboard = new Scoreboard(this.game);
                scoreboard.show(this.score);
            }, this);

        }, this);
    },

    shutdown: function() {
            this.missiles.destroy();
            this.asteroids.destroy();
            this.explosions.destroy();
            this.bigExplosions.destroy();
            this.score = 0;
            this.health = 100;
            this.turnincrement = 0.1;
            this.maxvelocity = 400;
            this.maxturn = 4;
            this.thrust = 6;
            this.isBurning = false;
            this.asteroidTimer = 0;
    }
}
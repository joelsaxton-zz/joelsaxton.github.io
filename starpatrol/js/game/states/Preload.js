/**
 * Created by joelsaxton on 11/8/14.
 */
StarPatrol.Preload = function(){
    this.ready = false;
};

StarPatrol.Preload.prototype = {
    preload: function() {

        this.game.stage.backgroundColor = '#000000';
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('background', 'assets/images/tiles/star-background.png');
        this.load.spritesheet('missile', 'assets/images/missile-spritesheet.png', 100, 400, 4);
        this.load.spritesheet('player', 'assets/images/ship-spritesheet.png', 100, 300, 16);
        this.load.spritesheet('asteroid', 'assets/images/asteroid-spritesheet.png', 140, 140, 1);
        this.load.spritesheet('explosion', 'assets/images/explosion-spritesheet.png', 64, 64, 23);
        this.load.spritesheet('big-explosion', 'assets/images/big-explosion-spritesheet.png', 128, 128, 23);
        this.load.spritesheet('alien', 'assets/images/alien1-spritesheet.png', 277, 160, 1);
        this.load.spritesheet('earth', 'assets/images/earth.png', 250, 250, 1);
        this.load.spritesheet('map', 'assets/images/starmap.png', 100, 100, 1);
        this.load.spritesheet('playermap', 'assets/images/playermap-spritesheet.png', 1, 1, 2);
        this.load.spritesheet('alienmap', 'assets/images/alienmap-spritesheet.png', 1, 1, 2);
        this.load.spritesheet('bullet', 'assets/images/bullet-spritesheet.png', 100, 100, 4);


        this.load.audio('gameMusic', ['assets/audio/Pamgaea.mp3', 'assets/audio/Pamgaea.ogg']);
        this.load.audio('missile', 'assets/audio/missile.wav');
        this.load.audio('bullet', 'assets/audio/blip.wav');
        this.load.audio('rocket', 'assets/audio/rocket.wav');
        this.load.audio('explosion', 'assets/audio/explosion.wav');
        this.load.audio('youblewit', 'assets/audio/youblewit.wav');

        this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

        this.load.onLoadComplete.add(this.onLoadComplete, this);
    },
    create: function() {
        this.preloadBar.cropEnabled = false;
    },
    update: function() {
        if(this.cache.isSoundDecoded('gameMusic') && this.ready === true){
            this.state.start('MainMenu');
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }
};

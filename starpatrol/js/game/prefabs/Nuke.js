/**
 * Created by joelsaxton on 12/6/14.
 */

var Nuke = function(game, nukeScale, player_xvel, player_yvel, x, y, angle, key, frame){
    key = 'nuke';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.scale.setTo(nukeScale);
    this.anchor.setTo(0.5);
    this.animations.add('nuke');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.angle = angle + 270; // Nuke orientation is 90 degrees off from ship
    this.checkWorldBounds = false;
    this.outOfBoundsKill = false;
    this.nukeLifeSpan = 50000;
    this.events.onRevived.add(this.onRevived, this);
    this.xvel = player_xvel;
    this.yvel = player_yvel;
    this.lockedOn = false;
};

Nuke.prototype = Object.create(Phaser.Sprite.prototype);
Nuke.prototype.constructor = Nuke;

Nuke.prototype.onRevived = function() {
    this.lifespan = this.game.time.now + this.nukeLifeSpan;
    this.body.velocity.x = (100 + Math.abs(this.xvel)) * Math.cos((this.angle) * Math.PI / 360);
    this.body.velocity.y = (100 + Math.abs(this.yvel)) * Math.sin((this.angle) * Math.PI / 360);
    this.animations.play('nuke', 20, true);
};


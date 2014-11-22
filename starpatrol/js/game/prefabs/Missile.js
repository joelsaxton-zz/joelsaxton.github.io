/**
 * Created by joelsaxton on 11/9/14.
 */

var Missile = function(game, missileScale, missileSpeed, x, y, angle, key, frame){
    key = 'missile';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.scale.setTo(missileScale);
    this.missileSpeed = missileSpeed;
    this.anchor.setTo(0.5);
    this.animations.add('missile');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.angle = angle;
    this.checkWorldBounds = false;
    this.outOfBoundsKill = false;
    this.missileLifeSpan = 6000;
    this.events.onRevived.add(this.onRevived, this);
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.onRevived = function() {
    this.lifespan = this.game.time.now + this.missileLifeSpan;
    this.body.velocity.x = this.missileSpeed * Math.cos((this.angle + 270) * Math.PI / 180);
    this.body.velocity.y = this.missileSpeed * Math.sin((this.angle + 270) * Math.PI / 180);
    this.animations.play('missile', 5, true);
};

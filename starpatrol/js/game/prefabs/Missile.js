/**
 * Created by joelsaxton on 11/9/14.
 */

var Missile = function(game, x, y, angle, key, frame){
    key = 'missile';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.scale.setTo(0.1);
    this.anchor.setTo(0.5);
    this.animations.add('missile');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.angle = angle;

    this.events.onRevived.add(this.onRevived, this);
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.onRevived = function() {
    this.body.velocity.x = 300 * Math.cos((this.angle + 270) * Math.PI / 180);
    this.body.velocity.y = 300 * Math.sin((this.angle + 270) * Math.PI / 180);
    this.animations.play('missile', 5, true);
};

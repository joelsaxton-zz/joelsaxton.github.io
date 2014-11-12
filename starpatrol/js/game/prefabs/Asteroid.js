/**
 * Created by joelsaxton on 11/10/14.
 */

var Asteroid = function(game, x, y, key, frame){
    key = 'asteroid';
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enableBody(this);
    this.events.onRevived.add(this.onRevived, this);
};

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.onRevived = function() {
    this.body.velocity.x = -300;
    this.body.velocity.y = this.game.rnd.integerInRange(-30, 30);
};
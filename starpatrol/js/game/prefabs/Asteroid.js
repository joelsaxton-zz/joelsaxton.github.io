/**
 * Created by joelsaxton on 11/10/14.
 */

var Asteroid = function(game, x, y, direction, key, frame){
    key = 'asteroid';
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.scale.setTo(this.game.rnd.realInRange(0.1,0.5));
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enableBody(this);
    this.direction = direction;
    this.events.onRevived.add(this.onRevived, this);
    this.maxUpperVel = 600;
    this.maxLowerVel = 200;
    this.maxAngularVel = 400;
};

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.onRevived = function() {
    switch (this.direction) {
        case 1:
            this.body.velocity.x = this.game.rnd.integerInRange(-this.maxUpperVel,-this.maxLowerVel);
            this.body.velocity.y = this.game.rnd.integerInRange(-this.maxLowerVel,this.maxLowerVel);
            break;
        case 2:
            this.body.velocity.x = this.game.rnd.integerInRange(this.maxLowerVel, this.maxUpperVel);
            this.body.velocity.y = this.game.rnd.integerInRange(-this.maxLowerVel,this.maxLowerVel);
            break;
        case 3:
            this.body.velocity.y = this.game.rnd.integerInRange(-this.maxUpperVel,-this.maxLowerVel);
            this.body.velocity.x = this.game.rnd.integerInRange(-this.maxLowerVel,this.maxLowerVel);
            break;
        case 4:
            this.body.velocity.y = this.game.rnd.integerInRange(this.maxLowerVel, this.maxUpperVel);
            this.body.velocity.x = this.game.rnd.integerInRange(-this.maxLowerVel, this.maxLowerVel);
            break;
    }

    this.body.angularVelocity = this.game.rnd.integerInRange(0, this.maxAngularVel);
};
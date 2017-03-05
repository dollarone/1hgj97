var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.game.load.spritesheet('logo-tiles', 'assets/gfx/logo-tiles.png', 17, 16);
    this.game.load.spritesheet('player', 'assets/gfx/char.png', 16, 16);
    this.game.load.image('train_blue', 'assets/gfx/train_blue.png');
    this.game.load.image('train_red', 'assets/gfx/train_red.png');
    this.game.load.image('train_yellow', 'assets/gfx/train_yellow.png');
    this.game.load.image('train_green', 'assets/gfx/train_green.png');

    this.game.load.audio('explosion', 'assets/sfx/explosion.ogg');
    this.game.load.audio('music', 'assets/sfx/ld35.ogg');


    this.game.load.spritesheet('smoke', 'assets/gfx/smoke.png', 16, 16);
    
    this.game.load.spritesheet('tiles', 'assets/gfx/tiles.png', 32, 32);

    this.game.load.text('level1', 'assets/levels/level1');


  },
  create: function() {
    this.state.start('Logo');
  }
};

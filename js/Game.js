var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    this.game.stage.backgroundColor = "#000";
    this.so = true;
    this.score = 0;
    this.scoreText;
    this.gamewon = false;

    this.timerTimeout = 100;
    // The player and its settings
    this.playerGroup = this.game.add.group();

    this.tiles = new Array(10);
    this.tilesGroup = this.game.add.group();
    this.trainGroup = this.game.add.group();
    this.smokeGroup = this.game.add.group();


    this.startGridX = 90;
    this.startGridY = 90;

    this.trainColours = ["none", "red", "blue", "yellow", "green"];
    this.scale = 1;
    this.timer = 0;

    this.titleText = this.game.add.text(250, 0, 'Train Jumper', { font: '22px Arial', fill: '#e22' });
    this.timeText = this.game.add.text(250, 25, '', { font: '22px Arial', fill: '#e22' });
    this.errorText = this.game.add.text(250, 210, '', { font: '32px Arial', fill: '#e22' });

    this.levels = ["none", "level1"];
    this.level = 1;

    this.firstTime = true;

    this.music = this.game.add.audio('music');
    this.music.volume = 0.7;
    this.sfx_explosion = this.game.add.audio('explosion');
    this.sfx_explosion.volume = 0.5;
    this.win = false;
    this.startTime = this.game.time.now;

    this.graphics = this.game.add.graphics(0,0);
    this.loadMap(this.levels[this.level]);


    this.noone = {};
    this.selected = this.noone;

    this.game.input.enabled = true;

    this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.key1.onDown.add(this.jump, this);
    this.music.play();   
  },

  jump: function() {
    if (this.player.dead) {
        return;
    }
    this.player.change = 1;
//    console.log(this.getTileAtPos(this.player.x, this.player.y));
    if (this.getTileAtPos(this.player.x, this.player.y).gridType === "track_station_red_facing_east") {
        this.player.targetY = this.player.y + 20;
        this.player.jumpingCountdown = 20;
        this.player.train = this.player;
        
    }
    else if (this.getTileAtPos(this.player.x, this.player.y).gridType === "track_station_blue_facing_east") {
        this.player.targetY = this.player.y - 20;
        this.player.jumpingCountdown = 20;
        this.player.train = this.player;
        this.player.change = -1;
    }
    else {
        this.player.targetY = this.player.y + 64;
        this.player.jumpingCountdown = 64;

    }
    this.player.animations.play("jump");
    this.player.notstarted = false;
    this.player.isJumping = true;


  },
  generateSmoke: function (train) {
 //   var smoke = this.smokeGroup.create(train.x, train.y, 'smoke');
    var smoke = this.game.add.sprite(train.x, train.y, 'smoke');
    smoke.anchor.setTo(0.5);
    smoke.scale.setTo(this.scale);
    smoke.animations.add('smoke', [0,1,2,3], 5, false);
    smoke.animations.play('smoke');
    
    this.game.add.tween(smoke).to( { alpha: 0 }, 1500, Phaser.Easing.Elastic.None, true);
    
    if (train.direction == 0) {
//        this.game.add.tween(smoke).to( { y: train.y}, 5000, 'Linear', true, 0);
      smoke.y += 3*this.scale;
    }
    else if (train.direction == 2) {
      smoke.y -= 3*this.scale;
    }   
    else if (train.direction == 1) {
      smoke.x -= 3*this.scale;
    }
    else if (train.direction == 3) {
      smoke.x += 3*this.scale;
    }
  
  },


  getNewDirection: function(tile, train) {
    if (train.direction == 0) {
        if (tile.gridType == "track_cross" || tile.gridType == "track_vertical") {
            
            return 0;
        }
        else if(tile.gridType == "track_north_west") {
            
            return 1;
        }
        else if(tile.gridType == "track_north_east") {
            return 3;
        }
        else if(tile.gridType == "track_station_red_facing_north" || tile.gridType == "track_station_blue_facing_north" ||
             tile.gridType == "track_station_yellow_facing_north" || tile.gridType == "track_station_green_facing_north") {
            return 0;
        }
    }
    else if (train.direction == 1) {
        if (tile.gridType == "track_cross" || tile.gridType == "track_horizontal") {
            
            return 1;
        }
        else if(tile.gridType == "track_south_east") {
            
            return 0;
        }
        else if(tile.gridType == "track_north_east") {
            return 2;
        }
        else if(tile.gridType == "track_station_red_facing_east" || tile.gridType == "track_station_blue_facing_east" ||
            tile.gridType == "track_station_yellow_facing_east" || tile.gridType == "track_station_green_facing_east") {
            return 1;
        }
    }
    else if (train.direction == 2) {
        if (tile.gridType == "track_cross" || tile.gridType == "track_vertical") {
            
            return 2;
        }
        else if(tile.gridType == "track_south_west") {
            
            return 1;
        }
        else if(tile.gridType == "track_south_east") {
            return 3;
        }
        else if(tile.gridType == "track_station_red_facing_south" || tile.gridType == "track_station_blue_facing_south" ||
            tile.gridType == "track_station_yellow_facing_south" || tile.gridType == "track_station_green_facing_south") {
            return 2;
        }
    }
    else if (train.direction == 3) {
        if (tile.gridType == "track_cross" || tile.gridType == "track_horizontal") {
            
            return 3;
        }
        else if(tile.gridType == "track_south_west") {
            
            return 0;
        }
        else if(tile.gridType == "track_north_west") {
            return 2;
        }
        else if(tile.gridType == "track_station_red_facing_west" || tile.gridType == "track_station_blue_facing_west" || 
            tile.gridType == "track_station_yellow_facing_west" || tile.gridType == "track_station_green_facing_west") {
            return 3;
        }
    }

    return -1;

  },

  getTileName: function(tile) {
    switch (parseInt(tile)) {
      case 0: return 'empty';
      case 1: return 'grass';
      case 12: return 'track_cross';
      case 13: return 'track_horizontal';
      case 14: return 'track_vertical';
      case 15: return 'track_south_west';
      case 16: return 'track_north_west';
      case 17: return 'track_north_east';
      case 18: return 'track_south_east';
      
       //  0 is down, 1 is left, 2 is up, 3 is right
      case 20: return 'track_station_red_facing_south';
      case 21: return 'track_station_red_facing_west';
      case 22: return 'track_station_red_facing_north';
      case 23: return 'track_station_red_facing_east';
      case 30: return 'track_station_blue_facing_south';
      case 31: return 'track_station_blue_facing_west';
      case 32: return 'track_station_blue_facing_north';
      case 33: return 'track_station_blue_facing_east';
      case 40: return 'track_station_yellow_facing_south';
      case 41: return 'track_station_yellow_facing_west';
      case 42: return 'track_station_yellow_facing_north';
      case 43: return 'track_station_yellow_facing_east';
      case 50: return 'track_station_green_facing_south';
      case 51: return 'track_station_green_facing_west';
      case 52: return 'track_station_green_facing_north';
      case 53: return 'track_station_green_facing_east';

      case 102: return 'mountain';

      default: return null;
    }

  },



  loadMap: function(level) {

    var level = this.game.cache.getText(level);

    var text = level.split('\n');
    
    //this.levelText.text = "Level " + this.level + ": " + text[0];

    var size = text[1].split(',');
    this.gridSizeX = size[0];
    this.gridSizeY = size[1];

    if (this.gridSizeY < 6 && this.gridSizeX < 5) {
        this.scale = 3;
        this.startGridX = 260;
    }
    else if (this.gridSizeY < 6 && this.gridSizeX < 7) {
        this.scale = 3;
        this.startGridX = 90;
    }
    else if (this.gridSizeY < 8 && this.gridSizeX < 10) {
        this.scale = 2;
        this.startGridX = 90;
    }
    else {
        this.scale = 1;
        this.startGridX = 90;
    }

    var totalTrains = size[2];
    
    this.tiles = new Array(this.gridSizeY);
    //console.log( "Size: " + this.gridSizeX + "x," + this.gridSizeY);

    for (var y = 0; y < this.gridSizeY; y++) {
      this.tiles[y] = new Array(this.gridSizeX);

      var tileRow = text[y+2+parseInt(totalTrains)].split(',');

      for (var x = 0; x < this.gridSizeX; x++) {
        var tmp = this.getTileName(tileRow[x]);
    
        this.tiles[y][x] = this.tilesGroup.create(this.startGridX + this.scale*32*x + x, this.startGridY + this.scale*32*y + y, 'tiles');
        this.tiles[y][x].anchor.setTo(0.5);
        this.tiles[y][x].scale.setTo(this.scale);
        this.tiles[y][x].gridX = x;
        this.tiles[y][x].gridY = y;

        if (tmp == 'empty') {
          this.tiles[y][x].gridEmpty = true;
        }
        else {
          this.tiles[y][x].gridEmpty = false;
        }

        if (parseInt(tileRow[x]) >= 20) {
          this.tiles[y][x].moveable = false;
        }
        else {
          this.tiles[y][x].moveable = true;

        }

        this.tiles[y][x].gridType = tmp;

        if (tmp == "track_station_red_facing_south") {
            this.tiles[y][x].stationName = "Snoqualmie";
            this.tiles[y][x].frame = 26;

        }
        else if (tmp == "track_station_red_facing_north") {
            this.tiles[y][x].stationName = "Roslyn";
            this.tiles[y][x].frame = 25;
        }
        else if (tmp == "track_station_red_facing_east") {
            this.tiles[y][x].stationName = "Bridgend";
            this.tiles[y][x].frame = 3;
        }
        else if (tmp == "track_station_red_facing_west") {
            this.tiles[y][x].stationName = "Ammanford";
            this.tiles[y][x].frame = 4;
        }
        else if (tmp == "track_station_blue_facing_south") {
            this.tiles[y][x].stationName = "Monkwearmouth";
            this.tiles[y][x].frame = 26;
        }
        else if (tmp == "track_station_blue_facing_north") {
            this.tiles[y][x].stationName = "Stafford";
            this.tiles[y][x].frame = 25;
        }
        else if (tmp == "track_station_blue_facing_east") {
            this.tiles[y][x].stationName = "Rhymney";
            this.tiles[y][x].frame = 3;
        }
        else if (tmp == "track_station_blue_facing_west") {
            this.tiles[y][x].stationName = "Whitland";
            this.tiles[y][x].frame = 4;
        }
        else if (tmp == "track_station_yellow_facing_south") {
            this.tiles[y][x].stationName = "Haverford";
            this.tiles[y][x].frame = 26;
        }
        else if (tmp == "track_station_yellow_facing_north") {
            this.tiles[y][x].stationName = "Wolferton";
            this.tiles[y][x].frame = 25;
        }
        else if (tmp == "track_station_yellow_facing_east") {
            this.tiles[y][x].stationName = "Saundersfoot";
            this.tiles[y][x].frame = 3;
        }
        else if (tmp == "track_station_yellow_facing_west") {
            this.tiles[y][x].stationName = "Hindolvestone";
            this.tiles[y][x].frame = 4;
        }
        else if (tmp == "track_station_green_facing_south") {
            this.tiles[y][x].stationName = "Common Lane";
            this.tiles[y][x].frame = 26;
        }
        else if (tmp == "track_station_green_facing_north") {
            this.tiles[y][x].stationName = "Tower View";
            this.tiles[y][x].frame = 25;
        }
        else if (tmp == "track_station_green_facing_east") {
            this.tiles[y][x].stationName = "Pinesway Junction";
            this.tiles[y][x].frame = 3;
        }
        else if (tmp == "track_station_green_facing_west") {
            this.tiles[y][x].stationName = "Park Lane";
            this.tiles[y][x].frame = 4;
        }
        else if (tmp == "grass") {            
            this.tiles[y][x].frame = 0;
        }
        else if (tmp == "track_cross") {
            this.tiles[y][x].frame = 1;
        }
        else if (tmp == "track_horizontal") {            
            this.tiles[y][x].frame = 2;
        }
        else if (tmp == "track_vertical") {            
            this.tiles[y][x].frame = 8;
        }
        else if (tmp == "mountain") {            
            this.tiles[y][x].frame = 12;
        }
        else if (tmp == "track_south_east") {            
            this.tiles[y][x].frame = 17;
        }
        else if (tmp == "track_south_west") {            
            this.tiles[y][x].frame = 10;
        }
        else if (tmp == "track_north_east") {            
            this.tiles[y][x].frame = 9;
        }
        else if (tmp == "track_north_west") {            
            this.tiles[y][x].frame = 18;
        }
        else if (tmp == "empty") {
            this.tiles[y][x].frame = 7;
        }



      }
    }

    trains = {};

    
    this.graphics.clear();
    this.graphics = this.add.graphics(0,0); 

    for (var i = 1; i <= totalTrains; i++) {
        //this.train = this.trainGroup.create(this.startGridX + 32*2 + 1*2 + 16, this.startGridY + 16, 'train_red');
        var trainData = text[i+1].split(',');
        
        var train = this.trainGroup.create(this.startGridX + (this.scale*32*parseInt(trainData[0]) + parseInt(trainData[0])),
            (this.startGridY + (this.scale*32*parseInt(trainData[1])) + parseInt(trainData[1])), 
            "train_" + this.trainColours[i]);
        train.gridX = trainData[0];
        train.gridY = trainData[1];
        train.goalX = trainData[2];
        train.goalY = trainData[3];
        train.startTime = trainData[4];
        train.isdead = false;
        train.colour =  this.trainColours[i];
        if (this.firstTime) {
//            train.startTime = parseInt(trainData[4]) + 30;
            this.firstTime = false;
        }
        train.speed = trainData[5];
        train.anchor.setTo(0.5);
        train.scale.setTo(this.scale, -this.scale);
        train.direction = trainData[6];
        if (train.direction == 0) {
            train.angle = 0;
        }
        else if (train.direction == 1) {
            train.angle = 90;

        }
        else if (train.direction == 2) {
            train.angle = 180;
            //train.scale.setTo(this.scale, this.scale);
        }
        else if (train.direction == 3) {
            train.angle = -90;
        }

        

        train.turnTimeout = 50;
        train.stoppped = false;
        train.success = false;
        train["from"] = this.tiles[train.gridY][train.gridX].stationName;
        train["to"] = this.tiles[train.goalY][train.goalX].stationName;
        train["startTime"] = train.startTime;

        //this.graphics = this.add.graphics(0,0); 
//        this.graphics = this.graphics.clear();
        //this.graphics = this.add.graphics(0,0); 

        if (this.tiles[train.goalY][train.goalX].gridType == "track_station_red_facing_west") {
            this.graphics.lineStyle(1, 0x771818, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x-(12*this.scale-2), this.tiles[train.goalY][train.goalX].y-(12*this.scale+1), this.scale*4 + 4, this.scale*2+1);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_red_facing_north") {
            this.graphics.lineStyle(1, 0x771818, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-(9*this.scale)-1, this.scale*2+1, this.scale*5);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_red_facing_east") {
            this.graphics.lineStyle(1, 0x771818, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+7*this.scale-1, this.tiles[train.goalY][train.goalX].y-15*this.scale-1, this.scale*4+3, this.scale*2);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_red_facing_south") {
            this.graphics.lineStyle(1, 0x771818, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-11*this.scale, this.scale*2+1, this.scale*5);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_blue_facing_west") {
            this.graphics.lineStyle(1, 0x092d5e, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x-(12*this.scale-2), this.tiles[train.goalY][train.goalX].y-(12*this.scale+1), this.scale*4 + 4, this.scale*2+1);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_blue_facing_north") {
            this.graphics.lineStyle(1, 0x092d5e, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-(9*this.scale)-1, this.scale*2+1, this.scale*5);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_blue_facing_east") {
            this.graphics.lineStyle(1, 0x092d5e, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+7*this.scale-1, this.tiles[train.goalY][train.goalX].y-15*this.scale-1, this.scale*4+3, this.scale*2);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_blue_facing_south") {
            this.graphics.lineStyle(1, 0x092d5e, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-11*this.scale, this.scale*2+1, this.scale*5);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_yellow_facing_west") {
            this.graphics.lineStyle(1, 0xa6b006, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x-(12*this.scale-2), this.tiles[train.goalY][train.goalX].y-(12*this.scale+1), this.scale*4 + 4, this.scale*2+1);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_yellow_facing_north") {
            this.graphics.lineStyle(1, 0xa6b006, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-(9*this.scale)-1, this.scale*2+1, this.scale*5);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_yellow_facing_east") {
            this.graphics.lineStyle(1, 0xa6b006, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+7*this.scale-1, this.tiles[train.goalY][train.goalX].y-15*this.scale-1, this.scale*4+3, this.scale*2);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_yellow_facing_south") {
            this.graphics.lineStyle(1, 0xa6b006, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-11*this.scale, this.scale*2+1, this.scale*5);
        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_green_facing_west") {
            this.graphics.lineStyle(1, 0x026835, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x-(12*this.scale-2), this.tiles[train.goalY][train.goalX].y-(12*this.scale+1), this.scale*4 + 4, this.scale*2+1);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_green_facing_north") {
            this.graphics.lineStyle(1, 0x026835, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-(9*this.scale)-1, this.scale*2+1, this.scale*5);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_green_facing_east") {
            this.graphics.lineStyle(1, 0x026835, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+7*this.scale-1, this.tiles[train.goalY][train.goalX].y-15*this.scale-1, this.scale*4+3, this.scale*2);

        }
        else if (this.tiles[train.goalY][train.goalX].gridType == "track_station_green_facing_south") {
            this.graphics.lineStyle(1, 0x026835, 1);
            this.graphics.drawRect(this.tiles[train.goalY][train.goalX].x+12*this.scale-1, this.tiles[train.goalY][train.goalX].y-11*this.scale, this.scale*2+1, this.scale*5);
        }


    }

    
    this.winSpeedBoost = 1;
    this.startLevel();
  },


  gameover: function() {
    this.gamewon = true;
    this.errorText.text = "That's it. You've cleared all the levels!\n             Well done!";
    
  },


  restartLevel: function (sprite, pointer) {
    this.tilesGroup.forEach(function(tile) {
        tile.kill();
    }, this);

    this.trainGroup.forEach(function(tile) {
        tile.kill();
    }, this);

    this.tilesGroup = null;
    this.trainGroup = null;
    this.tilesGroup = this.game.add.group();    
    this.trainGroup = this.game.add.group();

    this.loadMap(this.levels[this.level]);
  },

  startLevel: function() {
    this.startTime = this.game.time.now;
    this.score = 0;
    this.timer = 0;
    this.win = false;
    this.errorText.text = "";

    this.player = this.game.add.sprite(150, 70, 'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add("jump", [1,2,2,1,0], 14, false);
    
    this.player.notstarted = true;
  },

  update: function() {
    if (this.player.dead) {
        this.player.frame = 3;
    }
    this.timer++;

    if (this.player.isJumping) {
        if (this.player.jumpingCountdown === 0) {
            this.player.isJumping = false;
        }
        else {
            this.player.jumpingCountdown--;
            this.player.y+= this.player.change;
            this.player.x = this.player.train.x;
        }
    }

    if (!this.win) {
        this.timeSpent = this.game.time.now - this.startTime;
    }
    this.timeText.text = "Time: " + parseFloat(this.timeSpent / 1000).toFixed(1) + "s";
    //this.scoreText.text = "Number of moves: " + this.score;

    var tmpText = "";
    var success = true;
    var skipPlayerCheck = false;
    if (this.player.dead || this.player.notstarted || this.player.isJumping) {
        skipPlayerCheck = true;
    }
    var dead = true;

    this.trainGroup.forEach(function(train1) {
      this.trainGroup.forEach(function(train2) {
        if (this.distanceBetweenTwoPoints(train1, train2) < (15*this.scale) && train1 != train2 && !train1.isdead && !train2.isdead) {
            var explosion = this.game.add.sprite(train1.x, train1.y, 'tiles');
            explosion.anchor.setTo(0.5);
            explosion.scale.setTo(this.scale);
            explosion.frame = 5;
            this.game.add.tween(explosion).to( { alpha: 0 }, 300, Phaser.Easing.Elastic.None, true);
            var explosion = this.game.add.sprite(train2.x, train2.y, 'tiles');
            explosion.anchor.setTo(0.5);
            explosion.scale.setTo(this.scale);
            explosion.frame = 5;
            this.game.add.tween(explosion).to( { alpha: 0 }, 300, Phaser.Easing.Elastic.None, true);
            train1.isdead = true;
            train2.isdead = true;
            train1.kill();
            train2.kill();
            this.sfx_explosion.play();

        }
    }, this);

      for (var i = 0, len = this.trainGroup.children.length; i < len; i++) {  

        if (!skipPlayerCheck) {
         //   console.log("chek" + train1.colour + " (" + parseInt(this.player.x) + "," + parseInt(this.player.y) + ") vs (" + parseInt(train1.x) + "," + parseInt(train1.y) + ")");
            var train = this.trainGroup.children[i];
            if (this.player.x > (train.x-13) && this.player.x < (train.x+13) &&
                this.player.y > (train.y-10) && this.player.y < (train.y+10)) {
                
                dead = false;
                this.player.x = train.x;
                this.player.y = train.y;
                this.player.train = train;
            }

      }
  }

    if (!skipPlayerCheck && dead) {
        this.player.dead = true;
        this.player.frame = 3;
        this.game.world.bringToTop(this.trainGroup);
    }

      if (!train1.success) {
        success = false;
      }

        if (!train1.stopped && !train1.isdead && (parseFloat(train1.startTime) + this.timer) % parseInt(100/train1.speed) == 0) {

        this.generateSmoke(train1);


      }
      if (parseFloat(train1.startTime - (this.timeSpent/1000)) < 0 && !train1.stoppped) {

        var fail = 1;
//        console.log("checking at :" + train1.x + "," + train1.y);
        var tileAt = this.getTileAtPos(Math.round(train1.x), Math.round(train1.y));
  //      console.log(tileAt.gridX + "," + tileAt.gridY);

        if (tileAt == null) {
            //tileAt = train1;
            fail = -1;
        }

        if (-1 != fail && (tileAt.gridX != train1.gridX || tileAt.gridY != train1.gridY)) {
            fail = parseInt( this.getNewDirection(this.tiles[parseInt(tileAt.gridY)][parseInt(tileAt.gridX)], train1) );
            if (-1 != fail) {
                this.tiles[tileAt.gridY][tileAt.gridX].moveable = false;

                var sprite = this.tiles[train1.gridY][train1.gridX];
                if (sprite.gridType == "track_station_red_facing_south" ||
                sprite.gridType == "track_station_red_facing_west" ||
                sprite.gridType == "track_station_red_facing_north" ||
                sprite.gridType == "track_station_red_facing_east" || 
                sprite.gridType == "track_station_blue_facing_south" ||
                sprite.gridType == "track_station_blue_facing_west" ||
                sprite.gridType == "track_station_blue_facing_north" ||
                sprite.gridType == "track_station_blue_facing_east" ||                 
                sprite.gridType == "track_station_yellow_facing_south" ||
                sprite.gridType == "track_station_yellow_facing_west" ||
                sprite.gridType == "track_station_yellow_facing_north" ||
                sprite.gridType == "track_station_yellow_facing_east" || 
                sprite.gridType == "track_station_green_facing_south" ||
                sprite.gridType == "track_station_green_facing_west" ||
                sprite.gridType == "track_station_green_facing_north" ||
                sprite.gridType == "track_station_green_facing_east") {
                    // cant move it; do nothing
                }
                else {
                    var canMove = true;
                    this.trainGroup.forEach(function(train2) {
                        if(train1 != train2 && this.tiles[train1.gridY][train1.gridX] == this.tiles[train2.gridY][train2.gridX]) {
                            canMove = false;
                        }

                    }, this);
                    this.tiles[train1.gridY][train1.gridX].moveable = canMove;
                }
        
                train1.gridX = parseInt(tileAt.gridX);
                train1.gridY = parseInt(tileAt.gridY);
                
                
            }
        }
        if (-1 == fail)  {}
            else {
        if (train1.direction == 0) {
          train1.y += 0.1 * train1.speed * this.scale * this.winSpeedBoost;
        }
        else if (train1.direction == 1) {
          train1.x -= 0.1 * train1.speed * this.scale * this.winSpeedBoost;
        }
        else if (train1.direction == 2) {
          train1.y -= 0.1 * train1.speed * this.scale * this.winSpeedBoost;
        }
        else if (train1.direction == 3) {
          train1.x += 0.1 * train1.speed * this.scale * this.winSpeedBoost;
        }
}


        if (train1.turnTimeout > 1) {
            train1.turnTimeout --;
        }
        else {
      //console.log("ye");
          if(((train1.x - this.startGridX) % (32*parseInt(this.scale)) < (this.scale*0.5) && (train1.direction == 1 || train1.direction == 3)) 
            || ((train1.y - this.startGridY) % (32*parseInt(this.scale)) < (this.scale*0.5) && (train1.direction == 0 || train1.direction == 2))) {
      
            

            train1.x = Math.round(train1.x);
            train1.y = Math.round(train1.y);
            train1.direction = parseInt( this.getNewDirection(this.tiles[parseInt(train1.gridY)][parseInt(train1.gridX)], train1) );
            if (train1.direction == 0) {
                train1.angle = 0;
            }
            else if (train1.direction == 1) {
                train1.angle = 90;
            }
            else if (train1.direction == 2) {
                train1.angle = 180;
            }
            else if (train1.direction == 3) {
                train1.angle = -90;
            }
            else if (train1.direction > 3) {
                train1.stopped = true;
                if (train1.goalX == train1.gridX && train1.goalY == train1.gridY) {
                    train1.success = true;
                }
            }
//            console.log("new dir: " + train1.direction);
            train1.turnTimeout = parseInt(50);
          }

        }
      }
    }, this);

    if (this.gamewon) { 
        this.errorText.text = "That's it. You've cleared all the levels!\n                    Well done!";
    
    }

  },

  getTileAtPos: function(x, y) {
    var mytile = null
    this.tilesGroup.forEach(function(tile) {  
      if (tile.x >= (x-(32*this.scale/2)) && tile.x <= (x+(32*this.scale/2)) && tile.y >= (y-(32*this.scale/2)) && tile.y <= (y+(32*this.scale/2))) {
     //   console.log( "tile at " + tile.x + "," + tile.y + ": " + tile.gridType);
        mytile = tile;
        //this.selected.tint = Math.random() * 0xffffff;
        
      }

    }, this);
    
    return mytile;
  },

  distanceBetweenTwoPoints: function(a, b) {
    var xs = b.x - a.x;
    xs = xs * xs;

    var ys = b.y - a.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
  },

};

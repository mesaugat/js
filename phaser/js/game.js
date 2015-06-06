var game = new Phaser.Game(350, 512);

var playState = {
    preload: function () {
        game.load.image('bird', 'img/bird.png');
        game.load.image('bg', 'img/gamebg.jpg');
        game.load.spritesheet('pipes', 'img/pipes.png', 54, 320);
    },

    create: function () {
        this.bg = game.add.tileSprite(0, 0, 350, 512, 'bg');
        this.bird = game.add.sprite(game.world.centerX, game.world.centerY, 'bird');
        this.bird.scale.setTo(0.6, 0.6);
        this.bg.autoScroll(-150, 0);
        this.bird.anchor.setTo(0.5, 0.5);
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this.bird);
        
        this.bird.body.gravity.y = 1000;
        
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.jump, this);

        this.makePipes();
    },

    update: function () {
        this.bird.angle += 2.5;

        if (!this.bird.inWorld) {
            game.state.start('homeState');
        }
        game.physics.arcade.collide(this.bird, this.pipes, this.deathHandler, null, this);
    },

    jump: function () {
        this.bird.body.velocity.y = -400;

        game.add.tween(this.bird).to({angle: -40}, 100).start();
    },

    deathHandler: function () {
        game.state.start('homeState');
    },

    makePipes: function () {
        this.pipesGenerator = game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.makePipe, this);
        this.pipesGenerator.timer.start();

        this.pipes = game.add.group();
    },

    makePipe: function () {
        var pipeX = game.width,
            pipeOne = game.add.sprite(pipeX, game.rnd.integerInRange(-200, 0), "pipes", 0),
            pipeTwo = game.add.sprite(pipeX, game.rnd.integerInRange(370, 450), "pipes", 1);

        game.physics.arcade.enable(pipeOne);
        game.physics.arcade.enable(pipeTwo);

        this.pipes.add(pipeOne);
        this.pipes.add(pipeTwo);
        this.pipes.setAll('body.velocity.x', -200);
    }
};

var homeState = {
    create: function () {
        var playButton = game.add.text(game.world.centerX, game.world.centerY, 'play', { fill: '#FFF' });
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(function () {
            game.state.start('playState');
        }, this);
    }
};

game.state.add("homeState", homeState);
game.state.add("playState", playState);
game.state.start("homeState");

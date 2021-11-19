{
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

        let game = new Phaser.Game(config);
        let platforms;
        let player;
        let playerTwo;

        let arrows;

        let cursors;
        let leftDown= false;        
        let rightDown= false;
        let gameOver= false;
        let socket = io();

        let timedEvent;

        function preload() {

            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('arrow', 'assets/arrow.png');

            this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, framHeight:48})
        }

        function create() {
            this.add.image(400, 300, 'sky');

            platforms = this.physics.add.staticGroup()
            platforms.create(400, 568, 'ground').setScale(2).refreshBody()
            platforms.create(50, 250, 'ground')
            platforms.create(750, 220, 'ground')
            platforms.create(600, 400, 'ground')

            arrows= this.physics.add.group();

            player = this.physics.add.sprite(100, 450, 'dude');
            playerTwo = this.physics.add.sprite(100, 450, 'dude');


            //var particles = this.add.particles('dude');

            /*var emitter = particles.createEmitter({
                speed: 50,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD'
            });*/


            player.setBounce(.2);
            player.setCollideWorldBounds(true);
            playerTwo.setBounce(.2);
            playerTwo.setCollideWorldBounds(true);

            //emitter.startFollow(player);

            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'turn',
                frames: [ { key: 'dude', frame: 4 } ],
                frameRate: 20
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            cursors = this.input.keyboard.createCursorKeys();
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(playerTwo, platforms);

            timedEvent = this.time.addEvent({ delay: 500, callback: secondPast, callbackScope: this, loop: true });
        }


        let secondPastBool= false;

        function secondPast() {
            secondPastBool= true;
        }


        function update(time, delta) {

        
        if (gameOver) {
            return;
        }

        // ----------------------------------------- Arrow controller ------------------------------
        if(secondPastBool) {
            if(cursors.left.isDown){
                var arrow = arrows.create(100, 16, 'arrow');
                arrow.setBounce(1);
                arrow.rotation = 3.15;
                arrow.setCollideWorldBounds(true);
                arrow.setVelocity(Phaser.Math.Between(-200, 200), 20);
                arrow.allowGravity = false;
                secondPastBool=false;
            }
        }
     
        if(secondPastBool) {
            if(cursors.right.isDown){
                var arrow = arrows.create(100, 16, 'arrow');
                arrow.setBounce(1);
                arrow.setCollideWorldBounds(true);
                arrow.setVelocity(Phaser.Math.Between(-200, 200), 20);
                arrow.allowGravity = false;
                secondPastBool=false;
            }
        }
        // ----------------------------------------- Arrow controller ------------------------------
             

        //----------------------------------------- character controller ------------------------------
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
            socket.emit('left', true);
            leftDown = true;
            rightDown= false;
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
            socket.emit('right', true);
            rightDown = true;
            leftDown= false;
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if(rightDown) {
            if (cursors.right.isUp) {
                console.log(`cursor is right`);
                socket.emit('right', false);
                rightDown= false;
            }
        }

        if(leftDown) {
            if (cursors.left.isUp) {
                console.log(`cursor is left`);
                socket.emit('left', false);
                leftDown=false;
            }
        }

        socket.on('left', function (bool) {
            if (bool) {
                playerTwo.setVelocityX(-160);
                playerTwo.anims.play('left', true);
            }
            else
            {
                playerTwo.setVelocityX(0);

                playerTwo.anims.play('turn');
            }
        });

        socket.on('right', function (bool) {
            if (bool) {
                playerTwo.setVelocityX(160);
                playerTwo.anims.play('right', true);
            }
            else
            {
                playerTwo.setVelocityX(0);

                playerTwo.anims.play('turn');
            }
        });

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);

        }
        //----------------------------------------- character controller ------------------------------
        }

        function makeArrow () {
            let arrowSecond;
            arrowSecond= this.physics.add.sprite(100, 64, 'arrow');
        }
}
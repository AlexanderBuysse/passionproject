{
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 400 }
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

        var spacebar;
        var ship;
        var bullets;
        let arrowsClass;

        let cursors;
        let leftDown= false;        
        let rightDown= false;
        let gameOver= false;
        let socket = io();

        let timedEvent;

        let scoreText;

        let score = 0;

        let zone;

        function preload() {

            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('arrow', 'assets/arrow.png');

            this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, framHeight:48})
        }

        function create() {
            var Arrow = new Phaser.Class({

                Extends: Phaser.GameObjects.Image,

                initialize:

                function Arrow (scene)
                {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'arrow');

                    this.speed = Phaser.Math.GetSpeed(600, 1);
                    //this.speed = .5;
                    
                },

                fire: function (x, y, direction)
                {
                    this.setPosition(x, y);
                    this.setActive(true);
                    this.setVisible(true);
                    if(direction === `right`) {
                        return this.rotation = 0;
                    } else if(direction === `left`) {
                        return this.rotation = 3.15;
                    }
                },

                update: function (time, delta)
                {
                    this.y += this.speed * delta *.5;

                    if (this.y > 600)
                    {
                        this.setActive(false);
                        this.setVisible(false);
                    }
                }

            });

            arrowsClass = this.physics.add.group({
                classType: Arrow,
                maxSize: 12,
                runChildUpdate: true,
                velocityY: .5,
                allowGravity: false
            });

            zone = this.add.zone(160, 500).setSize(100, 100);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;

            this.add.image(400, 300, 'sky');
            scoreText = this.add.text(100, 100, 'score: 0', { fontSize: '32px', fill: '#000' });

            platforms = this.physics.add.staticGroup()
            platforms.create(400, 568, 'ground').setScale(2).refreshBody()

            arrows= this.physics.add.group({
                classType: Arrow,
                maxSize: 12,
                runChildUpdate: true,
                velocityY: .5,
                allowGravity: false
            });

            player = this.physics.add.sprite(100, 450, 'dude');
            playerTwo = this.physics.add.sprite(100, 450, 'dude');


            player.setBounce(.2);
            player.setCollideWorldBounds(true);
            playerTwo.setBounce(.2);
            playerTwo.setCollideWorldBounds(true);

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

            socket.on('arrow', function (bool) {
                if (bool) {
                    console.log(`a arrow has been send`);
                    var arrowClass = arrowsClass.get();

                    if (arrowClass)
                    {
                        arrowClass.fire(10, 100, `right`);
                    }
                }
            });
            //this.physics.add.overlap(arrows, platforms, removeArrow, null, this);

            /*if(!secondPastBool) {
                console.log(`gaat dit er door`);
                timedEvent = this.time.addEvent({ delay: 1000, callback: secondPast, callbackScope: this, loop: {secondPastBool} });
            }*/
            console.log(arrows, arrowsClass);
            this.physics.add.overlap(arrowsClass, zone);
        }

        function removeArrow (arrows, platforms) {
            //arrows.disableBody(true, true);
            arrows.destroy()
            //console.log(`oke then`);
        }


        /*let secondPastBool= false;

        function secondPast() {
            console.log(`dit logt elke sconde of wa`);
            secondPastBool= true;
        }*/

        let timeWhenFunction = 0;

        /*function didSecondPass (time, timeLastFunction) {
            let oke = time - timeLastFunction;
            console.log(oke);

            if(oke === 1000) {
                console.log(`second passed`)
                return true;
            } else if ( oke < 1000) {
                console.log(`second didn't pass`)
                return true;
            } else {
                return false;
            }
        }
        */

        function update(time, delta) {
        
        zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone.body.touching.none) {
            if(cursors.up.isDown){
                    score += 10;
                    scoreText.setText('Score: ' + score);
            }
        }

        if (gameOver) {
            return;
        }
        //console.log(time);
        //console.log(timeWhenFunction);
        if (time - timeWhenFunction >300){
            if (this.input.keyboard.checkDown(cursors.left, 1000))
            {
                var arrowClass = arrowsClass.get();

                if (arrowClass)
                {
                    arrowClass.fire(200, 100, `left`);
                    socket.emit('arrow', true);
                    timeWhenFunction= time;
                }
            }

            if (this.input.keyboard.checkDown(cursors.right, 1000))
            {
                var arrowClass = arrowsClass.get();

                if (arrowClass)
                {
                    arrowClass.fire(320, 100, `right`);
                    socket.emit('arrow', true);
                    timeWhenFunction= time;
                }
            }
            //console.log(`second passed`);
        } 

        // socket.on('arrow', function (bool) {
        //     if (bool) {
        //         //console.log(`a arrow has been send`);
        //         //console.log(bool);
        //         //socket.emit('arrow', false);
        //     } else {
        //         //console.log(bool);
        //     }
        // });
       /* if (this.input.keyboard.checkDown(cursors.left, 1000))
        {
            var arrowClass = arrowsClass.get();

            if (arrowClass)
            {
                arrowClass.fire(200, 100);
                socket.emit('arrow', true);
                timeWhenFunction= time;
            }
        }
        
        //*/
        // ----------------------------------------- Arrow controller ------------------------------
        //console.log(didSecondPass(time, timeWhenFunction));
        /*
        if(cursors.left.isDown){
            var arrow = arrows.create(100, 16, 'arrow');
            arrow.rotation = 3.15;
            arrow.setCollideWorldBounds(true);
            arrow.allowGravity = false;
        }

        if(cursors.right.isDown){
            var arrow = arrows.create(210, 16, 'arrow');
            arrow.setCollideWorldBounds(true);
            arrow.allowGravity = false;
            secondPastBool=false;
        }
        //*/
        //console.log(timeWhenFunction);
        // ----------------------------------------- Arrow controller ------------------------------
             

        //----------------------------------------- character controller ------------------------------
        /*
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
                //console.log(`cursor is right`);
                socket.emit('right', false);
                rightDown= false;
            }
        }

        
        if(leftDown) {
            if (cursors.left.isUp) {
                //console.log(`cursor is left`);
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
        //*/
        //----------------------------------------- character controller ------------------------------
        }

        /*
        function makeArrow () {
            let arrowSecond;
            arrowSecond= this.physics.add.sprite(100, 64, 'arrow');
        }
        */
}
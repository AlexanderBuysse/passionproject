{
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 1000,
        parent: 'phaser-example',
        dom: {
            createContainer: true
        },
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

    //----------------------------- random vars ----------------------------------------
        // let player;
        // let playerTwo;
        // let leftDown= false;        
        // let rightDown= false;
        // let gameOver= false;
    //----------------------------- random vars ----------------------------------------


        let game = new Phaser.Game(config);
        let socket = io();

        let platforms;
        let cursors;

        let arrows;
        let arrowsClass;

        let timeWhenFunction = 0;

        let zone;
        let zone2;
        let zone3;
        let zone4;
        let scoreText;
        let score = 0;

        var element;
        let button;
        let doctor;

        const cordsLeft = 200;
        const cordsUp = 320;
        const cordsDown= 440;
        const cordsRight = 560;

        let rect;

        function preload() {

            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('arrow', 'assets/arrow.png');

            this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, framHeight:48});

            this.load.html('nameform', 'assets/text/loginform.html');

            this.load.image('buttonBG', 'assets/button-bg.png');
            this.load.image('buttonText', 'assets/button-text.png');
        }

        function create() { 
            //element = this.scene.add.dom(400, 300).createFromCache('nameform');
            cursors = this.input.keyboard.createCursorKeys();
        
            // ----------------------------------------- arrows class ------------------------------
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
                    } else if(direction === `up`) {
                        return this.rotation = -1.55;
                    } else if(direction === `down`) {
                        return this.rotation = 1.55;
                    }
                },

                update: function (time, delta)
                {
                    this.y += this.speed * delta *.5;

                    if (this.y > 1000)
                    {
                        this.setActive(false);
                        this.setVisible(false);
                    }
                }
            });

            arrowsClass = this.physics.add.group({
                classType: Arrow,
                maxSize: 6,
                runChildUpdate: true,
                velocityY: .5,
                allowGravity: false
            });

            arrows= this.physics.add.group({
                classType: Arrow,
                maxSize: 6,
                runChildUpdate: true,
                velocityY: .5,
                allowGravity: false
            });

            socket.on('arrow', function (arrayInfo) {
                if(!doctor) {
                    if (arrayInfo[0]) {
                        console.log(`a arrow has been send`);
                        SendArrow(arrayInfo[1], 0, false);
                    }
                }
            });

            // ----------------------------------------- arrows class ------------------------------

            // ----------------------------------------- zone ------------------------------
            
            zone = this.add.zone(cordsLeft-48, 930).setSize(100, 100);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;
        
            zone2 = this.add.zone(cordsUp-48, 930).setSize(100, 100);
            this.physics.world.enable(zone2);
            zone2.body.setAllowGravity(false);
            zone2.body.moves = false;

            zone3 = this.add.zone(cordsDown-48, 930).setSize(100, 100);
            this.physics.world.enable(zone3);
            zone3.body.setAllowGravity(false);
            zone3.body.moves = false;

            zone4 = this.add.zone(cordsRight-48, 930).setSize(100, 100);
            this.physics.world.enable(zone4);
            zone4.body.setAllowGravity(false);
            zone4.body.moves = false;

            this.add.image(400, 800, 'sky');
            scoreText = this.add.text(100, 800, 'score: 0', { fontSize: '32px', fill: '#000' }); 
            // ----------------------------------------- zone ------------------------------


            platforms = this.physics.add.staticGroup()
            platforms.create(400, 1000, 'ground').setScale(2).refreshBody()
            this.physics.add.overlap(arrowsClass, zone, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone2,removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone3, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone4, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, platforms, removeArrow, null, this);

            // ----------------------------------------- players ------------------------------
            /*
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

            this.physics.add.collider(player, platforms);
            this.physics.add.collider(playerTwo, platforms);
            //*/
            //this.physics.add.overlap(arrows, platforms, removeArrow, null, this);
            // ----------------------------------------- players ------------------------------
            let bg = this.add.image(0, 0, 'buttonBG').setInteractive();
            let text = this.add.image(0, 0, 'buttonText');

            let container = this.add.container(400, 300, [ bg, text ]);

            bg.on('pointerup', clickButton, this);

            rect = this.add.rectangle(400, 300, 300, 200).setStrokeStyle(2, 0xffff00);
        }
        
        function removeArrow (arrows, platforms) {
            arrows.destroy()
        }

        function removeArrowZone (zones, arrows) {
            //console.log(zones);
            if (zones.name===`pressed`){
                arrows.destroy();
                score += 10;
                scoreText.setText('Score: ' + score);
            }
        }

        function clickButton ()
        {
            doctor = true;
            //console.log(`button pressed`);
        }

        function SendArrow (direction, time, userPressedKey) {
            var arrowClass = arrowsClass.get();
            const cords = GetCords(direction);
            if (arrowClass)
            {
                arrowClass.fire(cords, 100, direction);
                if (userPressedKey) {
                    const arrowInfo = [true, direction];
                    socket.emit('arrow', arrowInfo);
                    timeWhenFunction= time;
                }
            }
        }

        function GetCords (direction) {
            if (direction === `left`) {
                return cordsLeft;
            } else if (direction === `right`) {
                return cordsRight;
            } else
            if (direction === `up`) {
                return cordsUp;                
            } else 
            if (direction === `down`) {
                return cordsDown;
            }
        }

        function arrowInZone (zoneNumber) {
            console.log(zone2);
            const nameRightZone= nameZone(zoneNumber); 
            nameRightZone.setName(`pressed`);
        }

        function nameZone (zoneName) {
            if (zoneName === 1) {
                return zone
            }
            if (zoneName === 2) {
                return zone2
            }
            if (zoneName === 3) {
                return zone3
            }
            if (zoneName === 4) {
                return zone4
            }
        }

        function update(time, delta) {

        // ----------------------------------------- zone controller ------------------------------
        zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone.body.touching.none) {
            if(cursors.left.isDown){
                arrowInZone(1);
            } 
        } else {
            zone.setName(`not pressed yet`);
        }

        zone2.body.debugBodyColor = zone2.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone2.body.touching.none) {
            if(cursors.up.isDown){
                console.log(zone2);
                arrowInZone(2);
            }
        } else {
            zone2.setName(`not pressed yet`);
        }

        zone3.body.debugBodyColor = zone3.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone3.body.touching.none) {

            if(cursors.down.isDown){
                    arrowInZone(3);
            }
        } else {
            zone3.setName(`not pressed yet`);
        }
        
        zone4.body.debugBodyColor = zone4.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone4.body.touching.none) {
            if(cursors.right.isDown){
                    arrowInZone(4);
            }
        } else {
            zone4.setName(`not pressed yet`);
        }

        // ----------------------------------------- zone controller ------------------------------
        
        // ----------------------------------------- arrow controller ------------------------------  

        if (time - timeWhenFunction >300){
            if (this.input.keyboard.checkDown(cursors.left, 1000))
            {
                if (doctor) {
                    SendArrow(`left`, time, true);
                } else {
                    console.log(`left`);
                }
            }

            if (this.input.keyboard.checkDown(cursors.right, 1000))
            {
                if (doctor) {
                    SendArrow(`right`, time, true);
                } else {
                    console.log(`right`);
                }

            }
    
            if (this.input.keyboard.checkDown(cursors.up, 1000))
            {
                if (doctor) {
                    SendArrow(`up`, time, true);
                } else {
                    console.log(`up`);
                }
            }

            if (this.input.keyboard.checkDown(cursors.down, 1000))
            {
                if (doctor) {
                    SendArrow(`down`, time, true);
                } else {
                    console.log(`down`);
                }
            }
        } 
        // ----------------------------------------- arrow controller ----------------------------------          

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
}
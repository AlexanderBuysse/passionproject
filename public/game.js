{
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 800,
        parent: 'phaser-example',
        backgroundColor: '#4488aa',
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
        var cursors;

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

        let emitter;
        let emitter2;
        let emitter3;
        let emitter4;
        let particles;

        const yPosEmitters = 650;
        const yPosZones = 718;
        const yPosPlatform = 800;
        
        let cody

        let life= 10; 
        let lifeGroup;

        function preload() {

            this.load.spritesheet('brawler', 'assets/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('arrow', 'assets/arrow.png');

            this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, framHeight:48});

            this.load.html('nameform', 'assets/text/loginform.html');

            this.load.image('blood', 'assets/blood.png');
            
            this.load.image('heart', 'assets/heart.png');
        }

        function create() { 

            this.anims.create({
                key: 'idle',
                frames: this.anims.generateFrameNumbers('brawler', { frames: [ 5, 6, 7, 8 ] }),
                frameRate: 8,
                repeat: -1
            });

            this.anims.create({
                key: 'punch',
                frames: this.anims.generateFrameNumbers('brawler', { frames: [ 15, 16, 17, 18, 17, 15 ] }),
                frameRate: 8,
                repeatDelay: 2000
            });

            cody = this.add.sprite(600, 370);
            cody.setScale(2);
            cody.play('idle');

            element = this.add.dom(150, 300).createFromCache('nameform');
            cursors = this.input.keyboard.createCursorKeys();

            element.setPerspective(800);
            element.addListener('click');
            element.on('click', function (event) {

                if (event.target.name === 'loginButton')
                {
                    let inputUsername = this.getChildByName('choose');
                    if (inputUsername.value === `true` && inputUsername.id === 'doctor')
                    {
                        this.removeListener('click');
                        doctor= true;

                        this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 1000, ease: 'Power3' });

                        this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 1000, ease: 'Power3',
                            onComplete: function ()
                            {
                                element.setVisible(false);
                            }
                        });
                    }
                }

            });
        
            this.tweens.add({
                targets: element,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });
        
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
                    this.setName(direction);
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

            lifeGroup= this.physics.add.group({
                maxSize: 10,
                allowGravity: false
            })
            for (let i = 0; i < life; i++) {
                lifeGroup.create(300+ (i*50), 100, 'heart').setScale(.4).refreshBody();  
            }

            // ----------------------------------------- arrows class ------------------------------

            // ----------------------------------------- zone ------------------------------
            
            zone = this.add.zone(cordsLeft, yPosZones).setSize(100, 100);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;
        
            zone2 = this.add.zone(cordsUp, yPosZones).setSize(100, 100);
            this.physics.world.enable(zone2);
            zone2.body.setAllowGravity(false);
            zone2.body.moves = false;

            zone3 = this.add.zone(cordsDown, yPosZones).setSize(100, 100);
            this.physics.world.enable(zone3);
            zone3.body.setAllowGravity(false);
            zone3.body.moves = false;

            zone4 = this.add.zone(cordsRight, yPosZones).setSize(100, 100);
            this.physics.world.enable(zone4);
            zone4.body.setAllowGravity(false);
            zone4.body.moves = false;

            //this.add.image(400, 800, 'sky');
            scoreText = this.add.text(100, yPosEmitters-100, 'score: 0', { fontSize: '32px', fill: '#000' }); 
            // ----------------------------------------- zone ------------------------------


            platforms = this.physics.add.staticGroup()
            platforms.create(400, yPosPlatform, 'ground').setScale(2).refreshBody()
            this.physics.add.overlap(arrowsClass, zone, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone2,removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone3, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone4, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, platforms, removeArrow, null, this);

            particles = this.add.particles('blood');

            emitter = particles.createEmitter({
                x: cordsLeft,
                y: yPosEmitters,
                lifespan: 5000,
                angle: { min: 265, max: 275 },
                speed: { min: 300, max: 500 },
                scale: { start: 0.6, end: 0 },
                gravityY: 1000,
                bounce: 0.9,
                blendMode: 'ADD',
                quantity: 4,
            });
            emitter.stop();

            
            emitter2 = particles.createEmitter({
                x: cordsUp,
                y: yPosEmitters,
                lifespan: 5000,
                angle: { min: 265, max: 275 },
                speed: { min: 300, max: 500 },
                scale: { start: 0.6, end: 0 },
                gravityY: 1000,
                bounce: 0.9,
                blendMode: 'ADD',
                quantity: 4,
            });
            emitter2.stop();

            emitter3 = particles.createEmitter({
                x: cordsDown,
                y: yPosEmitters,
                lifespan: 5000,
                angle: { min: 265, max: 275 },
                speed: { min: 300, max: 500 },
                scale: { start: 0.6, end: 0 },
                gravityY: 1000,
                bounce: 0.9,
                blendMode: 'ADD',
                quantity: 4,
            });
            emitter3.stop();

            emitter4 = particles.createEmitter({
                x: cordsRight,
                y: yPosEmitters,
                lifespan: 5000,
                angle: { min: 265, max: 275 },
                speed: { min: 300, max: 500 },
                scale: { start: 0.6, end: 0 },
                gravityY: 1000,
                bounce: 0.9,
                blendMode: 'ADD',
                quantity: 4,
            });
            emitter4.stop();
        }
        
        function removeArrow (arrows, platforms) {
            arrows.destroy();
            losePoints();
            if(!doctor) {            
                switch (arrows.name) {
                    case `left`:
                        emitter.start();
                        this.time.delayedCall(150, destroyEmitter, [], this);
                        break;

                    case `up`:
                        emitter2.start();
                        this.time.delayedCall(150, destroyEmitter, [], this);
                        break;
                    
                    case `down`:
                        emitter3.start();
                        this.time.delayedCall(150, destroyEmitter, [], this);
                        break;
                    
                    case `right`:
                        emitter4.start();
                        this.time.delayedCall(150, destroyEmitter, [], this);
                        break;
                
                    default:
                        console.log(`er is iets fout gegaan`);
                        break;
                    }
                }        
            }

        function removeArrowZone (zones, arrows) {
            if (zones.name===`pressed`){
                arrows.destroy();
                score += 10;
                scoreText.setText('Score: ' + score);
            }
        }

        /*function clickButton ()
        {
            doctor = true;
            //console.log(`button pressed`);
        }*/

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

        function losePoints () {
            score -= 10;
            scoreText.setText('Score: ' + score);
                            
            if (cody.anims.getName() === 'idle') {
                cody.play('punch');
                cody.chain([ 'idle' ]);
            }
        }

        function update(time, delta) {

        // ----------------------------------------- zone controller ------------------------------
        zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone.body.touching.none) {
            if(cursors.left.isDown){
                if (cursors.left.getDuration() <= 500) {
                    arrowInZone(1);
                } else {
                    losePoints ();
                }
            }
        } else {
            zone.setName(`not pressed yet`);
        }

        zone2.body.debugBodyColor = zone2.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone2.body.touching.none) {
            if(cursors.up.isDown){
                if (cursors.up.getDuration() <= 500) {
                    arrowInZone(2);
                }
            }
        } else {
            zone2.setName(`not pressed yet`);
        }

        zone3.body.debugBodyColor = zone3.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone3.body.touching.none) {
            if(cursors.down.isDown){
                if (cursors.down.getDuration() <= 500) {
                    arrowInZone(3);
                }
            }
        } else {
            zone3.setName(`not pressed yet`);
        }
        
        zone4.body.debugBodyColor = zone4.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone4.body.touching.none) {
            if(cursors.right.isDown){
                if (cursors.down.getDuration() <= 500) {
                    arrowInZone(4);
                }
            }
        } else {
            zone4.setName(`not pressed yet`);
        }

        if (!doctor) {
            if (zone.body.touching.none && this.input.keyboard.checkDown(cursors.left, 500)) {
                emitter.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
            }
            if (zone2.body.touching.none && this.input.keyboard.checkDown(cursors.up, 500)) {
                emitter2.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
            }
            if (zone3.body.touching.none && this.input.keyboard.checkDown(cursors.down, 500)) {
                emitter3.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
            }
            if (zone4.body.touching.none && this.input.keyboard.checkDown(cursors.right, 500)) {
                emitter4.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
            }
        }
        // ----------------------------------------- zone controller ------------------------------
        
        // ----------------------------------------- arrow controller ------------------------------  

        if (time - timeWhenFunction >500){
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

        function destroyEmitter() {
            emitter.stop();
            emitter2.stop();
            emitter3.stop();
            emitter4.stop();
        }
}
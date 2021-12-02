{
    var config = {
        type: Phaser.AUTO,
        width: 1250,
        height: 800,
        parent: 'phaser-example',
        backgroundColor: '#4488aa',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
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

        const cordsLeft=450+ 200;
        const cordsUp=450+ 320;
        const cordsDown=450+ 440;
        const cordsRight =450+ 560;

        let emitter;
        let emitter2;
        let emitter3;
        let emitter4;
        let particles;

        const yPosEmitters = 650;
        const yPosZones = 718;
        const yPosPlatform = 800;
        const xPosPlatform = 850

        const xPosHeart = 60;
        const yPosHeart = 50;

        const xPosTimer = 50;
        const yPosTimer = 215;
        
        let cody

        let life= 10; 
        let lifeGroup;

        let gameOver = false;
        let once = true;

        let heartSprite;

        let bloodexplosion;
        let emitterExplosion;

        let cacheJson;
        let timeInGame;

        let home;
        let joinRoom;

        let gameStart = false;

        let textHeart;

        const fiveMinTimer = 300000;
        let textTimer;

        let gameSpeed= 500;

        let textGameSpeed;

        let bpm= 0;
        let textBpm;
        const xPosBpm = 120;
        const yPosBpm = 380;
        
        
        function preload() {

            this.load.spritesheet('brawler', 'assets/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('arrow', 'assets/arrow.png');

            this.load.html('nameform', 'assets/text/loginform.html');

            this.load.image('blood', 'assets/blood.png');
            
            this.load.image('heart', 'assets/heart.png');
            this.load.atlas('heartgif', 'assets/heartSprite.png', 'assets/text/heart.json');

            this.load.image('bloodexplo', 'assets/blood.png');
            this.load.json('emitter', 'assets/text/explodeblood.json');

            this.load.html('home', 'assets/text/home.html')

            this.load.image('smallui', 'assets/ui/smallui.png')
            this.load.image('mediumui', 'assets/ui/mediumui.png')
        }

        function connect() {
            var ws = new WebSocket('wss://dev.pulsoid.net/api/v1/data/real_time?access_token=726df273-9330-4c18-9c14-c4b0d82384c9');
            ws.onopen = function() {
                // subscribe to some channels
                ws.send(JSON.stringify({
                    //.... some message the I must send when I connect ....
                }));
            };
            ws.onmessage = function(e) {
                //console.log('Message:', e.data);
                var keys = Object.keys(e.data);
                var values = keys.map(function(key) {
                return e.data[key];
                });
                console.log((parseInt(values[values.length - 4])*10)+ parseInt(values[values.length - 3]));
                bpm = (parseInt(values[values.length - 4])*10)+ parseInt(values[values.length - 3]);
            };
            ws.onclose = function(e) {
                console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
                setTimeout(function() {
                connect();
                }, 1000);
            };
            ws.onerror = function(err) {
                console.error('Socket encountered error: ', err.message, 'Closing socket');
                ws.close();
            };
        }

        function create() { 
            connect();
        //----------------------------- game loader ----------------------------------------------
            home = this.add.dom(400,370).createFromCache('home');

            element = this.add.dom(625, 800).createFromCache('nameform');
            cursors = this.input.keyboard.createCursorKeys();

            this.add.image(210, 80, 'smallui');
            this.add.image(210, 232, 'smallui');
            this.add.image(210, 384, 'smallui');
            this.add.image(210, 626, 'mediumui');
            element.setVisible(false);
            home.setVisible(false);

            element.setPerspective(800);
            element.addListener('click');
            element.addListener('submit');
            element.on('submit', function (event) {
                event.preventDefault();
                if(event.target[0].checked === true) {
                    this.removeListener('click');
                    this.removeListener('submit');
                    doctor= true;
                    gameStart= true; 

                    this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 1000, ease: 'Power3' });

                    this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 1000, ease: 'Power3',
                        onComplete: function ()
                        {
                            element.setVisible(false);
                            home.setVisible(false);
                        }
                    });
                } else {
                    this.removeListener('click');
                    this.removeListener('submit');
                    gameStart= true; 

                    this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 1000, ease: 'Power3' });

                    this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 1000, ease: 'Power3',
                        onComplete: function ()
                        {
                            element.setVisible(false);
                            home.setVisible(false);
                        }
                    });
                }
            })
            element.on('click', function (event) {
                if (event.target.name === 'leaveRoom') {
                    console.log(`i want to leave the room`);
                }
            });
            //----------------------------- game loader ----------------------------------------------
        
            this.tweens.add({
                targets: element,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });
            

            cacheJson= this.cache.json.get('emitter');
            bloodexplosion = this.add.particles('bloodexplo');

            this.anims.create({
                key: 'idleheart',
                frames: this.anims.generateFrameNames('heartgif', {prefix: 'sprite', end: 2, zeroPad:0}),
                frameRate: 3,
                repeat: -1
            });

            this.anims.create({
                key: 'deathheart',
                frames: this.anims.generateFrameNames('heartgif', {prefix: 'sprite', end: 17, zeroPad:0}),
                frameRate: 20,
                repeat: 0
            });

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


            cody = this.add.sprite(220, 580);
            cody.setScale(6);
            cody.play('idle');

        
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
                if (i <= 6) {
                    heartSprite = this.add.sprite(xPosHeart+ (i*50), yPosHeart);
                    heartSprite.setScale(.5);
                    heartSprite.play('idleheart');
                    lifeGroup.add(heartSprite);
                    console.log(`gaat hier door`);
;                } else {
                    console.log(xPosHeart+ ((i-7)*50), yPosHeart +10, i);
                    heartSprite = this.add.sprite(xPosHeart+ ((i-7)*50), yPosHeart+50);
                    heartSprite.setScale(.5);
                    heartSprite.play('idleheart');
                    lifeGroup.add(heartSprite);
                }
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
            scoreText = this.add.text(xPosTimer+200, yPosTimer+200, 'score: 0', { fontSize: '32px', fill: '#000' }); 
            textTimer = this.add.text(xPosTimer, yPosTimer, 'time left: 5:00 min', { fontSize: '25px', fill: '#000' })
            textBpm = this.add.text(xPosBpm, yPosBpm, 'BPM: 0', { fontSize: '25px', fill: '#000' })
            // ----------------------------------------- zone ------------------------------


            platforms = this.physics.add.staticGroup()
            platforms.create(xPosPlatform, yPosPlatform, 'ground').setScale(2).refreshBody()
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

        function update(time, delta) {
        if (gameOver && once) {
            alert(`u are dead`);
            once= false;
        }

        if ((fiveMinTimer-time)<= 0) {
            //console.log(`het spel is gedaan`);
            gameOver=true;
            if (gameOver && once) {
                alert(`u are dead`);
                once= false;
            }   
        }

        textBpm.setText('BPM: ' + bpm);
        textTimer.setText('time left: ' + (millisToMinutesAndSeconds(fiveMinTimer-time)));

        // ----------------------------------------- zone controller ------------------------------
        zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
        
        if(!zone.body.touching.none) {
            if(cursors.left.isDown){
                if (cursors.left.getDuration() <= 500) {
                    arrowInZone(1);
                } else {
                    losePoints ();
                    this.time.delayedCall(150, destroyEmitterHeart, [], this);
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
                this.time.delayedCall(150, destroyEmitterHeart, [], this);
            }
            if (zone2.body.touching.none && this.input.keyboard.checkDown(cursors.up, 500)) {
                emitter2.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
                this.time.delayedCall(150, destroyEmitterHeart, [], this);
            }
            if (zone3.body.touching.none && this.input.keyboard.checkDown(cursors.down, 500)) {
                emitter3.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
                this.time.delayedCall(150, destroyEmitterHeart, [], this);
            }
            if (zone4.body.touching.none && this.input.keyboard.checkDown(cursors.right, 500)) {
                emitter4.start();
                this.time.delayedCall(150, destroyEmitter, [], this);
                losePoints ();
                this.time.delayedCall(150, destroyEmitterHeart, [], this);
            }
        }
        // ----------------------------------------- zone controller ------------------------------
        
        // ----------------------------------------- arrow controller ------------------------------  

        if (time - timeWhenFunction >gameSpeed){
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
        }

        function removeArrow (arrows, platforms) {
            arrows.destroy();
            losePoints();
            //this.time.delayedCall(150, destroyEmitterHeart, [], this);
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

        function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }


        function removeArrowZone (zones, arrows) {
            if (zones.name===`pressed`){
                arrows.destroy();
                score += 10;
                scoreText.setText('Score: ' + score);
            }
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

        function getData () {
            
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

            if (!doctor) {
                if(life > 0){
                    life = life -1; 
                    lifeGroup.children.entries[life].play('deathheart');
                    emitterExplosion = bloodexplosion.createEmitter(cacheJson);
                    emitterExplosion.setPosition(lifeGroup.children.entries[life].x, lifeGroup.children.entries[life].y)
                    emitterExplosion.start();
                
                } else {
                    gameOver = true;
                }
            }
        }

        function destroyEmitter() {
            emitter.stop();
            emitter2.stop();
            emitter3.stop();
            emitter4.stop();
        }

        function destroyEmitterHeart() {
            emitterExplosion.stop();
        }

        function checkSpeed (speedMs) {
            if(speedMs === 500){
                return 1;
            } else  if (speedMs === 1000) { 
                return 2;
            } else if (speedMs === 250) {
                return 0.5; 
            } 
        } 
}
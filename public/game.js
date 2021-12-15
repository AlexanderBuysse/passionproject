{
    var config = {
        type: Phaser.AUTO,
        width: 1250,
        height: 800,
        parent: 'phaser-example',
        backgroundColor: '#1c1917',
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

        const cordsLeft=450+ 170;
        const cordsUp=450+ 320;
        const cordsDown=450+ 480;
        const cordsRight =450+ 630;

        let emitter;
        let emitter2;
        let emitter3;
        let emitter4;
        let particles;

        const yPosEmitters = 700;
        const yPosZones = 630;
        const yPosPlatform = 760;
        const xPosPlatform = 850

        const xPosHeart = 60;
        const yPosHeart = 105;

        const xPosTimer = 76;
        const yPosTimer = 235;
        
        let cody

        let life= 7; 
        let lifeGroup;

        let gameOver = false;
        let once = true;

        let heartSprite;

        let bloodexplosion;
        let emitterExplosion;

        let cacheJson;
        let timeInGame;

        let home;
        let rooms;
        let gameMenu;
        let tutorial;

        let gameStart = false;

        let textHeart;

        let fiveMinTimer = 5000;
        let textTimer;

        let gameSpeed= 500;
        let level = 1;
        let heartRateGemid = [];
        let arrowsCaught = 0;

        let textGameSpeed;

        let bpm= 0;
        let textBpm;
        const xPosBpm = 235;
        const yPosBpm = 340;

        var textTimeDoctor;
        var graphics;
        var hsv;
        var timerEvents = [];

        let averageHeartBeat;

        let room;
        let indie;

        let handDoctor;

        let tweenDoctor;
        let doctorWin = false;
        let patientWin = false;        
        let doctorWinHtml;
        let patientWinHtml;

        let playerOne= false;
        let playerTwo= false;

        let gameStartReally = false;
        let patientDied= false;
        let doctorDied= false;

        let scene;

        const yPosComboText = 500;
        const xPosComboText = 500;
        
        
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
            this.load.image('good', 'assets/good.png');
            this.load.json('emitter', 'assets/text/explodeblood.json');

            this.load.html('home', 'assets/text/home.html');
            this.load.html('rooms', 'assets/text/rooms.html');
            this.load.html('menu', 'assets/text/menu.html');
            this.load.html('tutorial', 'assets/text/tutorial.html');
            this.load.html('patientwin', 'assets/text/patientwin.html');
            this.load.html('doctorwin', 'assets/text/doctorwin.html');

            this.load.image('smallui', 'assets/design/smallui1.png');
            this.load.image('smallui2', 'assets/design/smallui2.png');
            this.load.image('smallui3', 'assets/design/smallui3.png');
            this.load.image('mediumui', 'assets/design/bigui.png');
            this.load.image('line', 'assets/design/line.png');     
            this.load.image('hart', 'assets/design/hart.png');
            this.load.image('long', 'assets/design/long.png');
            this.load.image('lever', 'assets/design/lever.png');
            this.load.image('hersenen', 'assets/design/hersenen.png');
            this.load.image('platformBlack', 'assets/design/platform.png');

            this.load.image('spiral', 'assets/design/spiral.png');

            this.load.image('arrowZone', 'assets/design/arrows.png');

            this.load.image('handDoctor', 'assets/design/handDoctor.png')
            this.load.image('headDoctor', 'assets/design/headDoctor.png')
            this.load.image('headPatient', 'assets/design/headPatient.png')

            this.load.image('indie', 'assets/design/indie.png');
            this.load.image('spuit', 'assets/design/spuit1.png');
        }

        function connect() {
            var ws = new WebSocket('wss://dev.pulsoid.net/api/v1/data/real_time?access_token=ca88ff26-710a-4bb8-81f6-bc32ffcabe5d');
            ws.onopen = function() {
                ws.send(JSON.stringify({
                }));
            };
            ws.onmessage = function(e) {
                const messageObj = JSON.parse(e.data);
                bpm = messageObj.data.heart_rate;
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
            scene = this;
            handDoctor = this.add.image(cordsLeft, -50, 'handDoctor');
            textTimeDoctor = this.add.text(200, 200);

            connect();
        //----------------------------- game loader ----------------------------------------------
            home = this.add.dom(400,370).createFromCache('home');

            element = this.add.dom(625, 800).createFromCache('nameform');
            cursors = this.input.keyboard.createCursorKeys();
            rooms = this.add.dom(625, 800).createFromCache('rooms');
            rooms.setVisible(false);

            gameMenu = this.add.dom(625, 800).createFromCache('menu');
            gameMenu.setVisible(false);

            doctorWinHtml= this.add.dom(625, 800).createFromCache('doctorwin');
            patientWinHtml = this.add.dom(625, 800).createFromCache('patientwin');

            gameMenu.setPerspective(800);
            gameMenu.addListener('submit');
            gameMenu.addListener('click');
            gameMenu.on('submit', function (event) {
                event.preventDefault();
                if(event.target[0].checked === true) {
                    rooms.setVisible(true);
                    gameMenu.setVisible(false);
                }
            })
            gameMenu.on('click', function (event) {
                if (event.target.name === 'tutorial') {
                    tutorial.setVisible(true);
                    gameMenu.setVisible(false);             
                }
            })

            doctorWinHtml.setPerspective(800);
            doctorWinHtml.addListener('click');
            doctorWinHtml.setVisible(false);
            doctorWinHtml.on('click', function (event) {
                if (event.target.name === 'tutorial') {
                    doctorWinHtml.setVisible(false);
                    gameMenu.setVisible(true);             
                }
            })

            patientWinHtml.setPerspective(800);
            patientWinHtml.addListener('click');
            patientWinHtml.setVisible(false);
            patientWinHtml.on('click', function (event) {
                if (event.target.name === 'tutorial') {
                    patientWinHtml.setVisible(false);
                    gameMenu.setVisible(true);             
                }
            })

            tutorial = this.add.dom(625,800).createFromCache('tutorial');
            tutorial.setVisible(false);
            tutorial.addListener('click');
            tutorial.on('click', function (event) {
                if (event.target.name === 'mainmenu') {
                    tutorial.setVisible(false);
                    gameMenu.setVisible(true);                  
                }
            });

            this.add.image(210, 80, 'smallui');
            this.add.image(210, 232, 'smallui2');
            this.add.image(210, 384, 'smallui3');
            this.add.image(210, 626, 'mediumui');
            element.setVisible(false);
            rooms.setVisible(true);
            //home.setVisible(false);

            element.setPerspective(800);
            rooms.setPerspective(800);
            rooms.addListener('click');
            rooms.addListener('submit');
            rooms.on('submit', function (event) {
                event.preventDefault();
                // for (let i = 0; i < 5; i++) {
                //     if(event.target[i].checked === true) {
                //     element.setVisible(true);
                //     rooms.setVisible(false);
                //     socket.emit("room", `room${i+1}`);
                //     }
                // }
            })
            rooms.on('click', function (event) {
                if (event.target.name === 'leaveRooms') {
                    rooms.setVisible(false);
                    gameMenu.setVisible(true);  
                }
                if (event.target.name === 'room1') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socket.emit("room", `room1`);
                }
                if (event.target.name === 'room2') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socket.emit("room", `room2`);
                }
                if (event.target.name === 'room3') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socket.emit("room", `room3`);
                }
                if (event.target.name === 'room4') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socket.emit("room", `room4`);
                }
                if (event.target.name === 'room5') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socket.emit("room", `room5`);
                }
            });


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
                            //socket emit room1Function
                            socket.emit('playerOne', true);
                            gameStarted=true;
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
                            //socket emit room1Function
                            socket.emit('playerTwo', true);
                            gameStarted=true;
                        }
                    });
                }
            })
            element.on('click', function (event) {
                if (event.target.name === 'leaveRoom') {
                    console.log(`i want to leave the room`);
                    element.setVisible(false);
                    rooms.setVisible(true);
                }
            });
            //----------------------------- game loader ----------------------------------------------
        
            this.tweens.add({
                targets: element,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });

            this.tweens.add({
                targets: rooms,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });
            this.tweens.add({
                targets: gameMenu,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });            
            this.tweens.add({
                targets: tutorial,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });
            this.tweens.add({
                targets: doctorWinHtml,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });
            this.tweens.add({
                targets: patientWinHtml,
                y: 300,
                duration: 1000,
                ease: 'Power3'
            });

            this.tweens.add({
                targets: handDoctor,
                x: cordsRight,
                duration: 250,
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
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'spuit');

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

                    if(level===3) {
                        this.rotation = this.rotation+.1;
                    }

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
                        SendArrow(arrayInfo[1], 0, false);
                        handDoctor.setPosition(GetCords(arrayInfo[1]),-50);
                    }
                }
            });
            socket.on('level', function (levelFromSocket) {
                if(doctor) {
                    level = levelFromSocket;
                }
            });
            socket.on(`rooms`, function (roomsObject) {
                console.log(roomsObject);
                //hier komterug
                const textRooms = rooms.getChildByID(`${roomsObject.room}Counter`).textContent;
                if(roomsObject.addCounter) {
                    if (textRooms === `1/2`){
                        rooms.getChildByID(`${roomsObject.room}Counter`).textContent= `2/2`;
                    } else if (textRooms === `0/2`) {
                        rooms.getChildByID(`${roomsObject.room}Counter`).textContent= `1/2`;
                    }
                    const array = roomsObject.room.split(``);
                    element.getChildByID(`roomNumber`).textContent = array[4];
                } else {
                    rooms.getChildByID(`${roomsObject.room}Counter`).textContent= `1/2`;
                }
            });

            socket.on(`playerOneTrue` , function (bool) {
                playerOne= true;
                if(playerOne&&playerTwo) {
                    gameStartReally = true;
                }
            })
            socket.on(`playerTwoTrue` , function (bool) {
                playerTwo= true;
                if(playerOne&&playerTwo) {
                    gameStartReally = true;
                }
            })
            socket.on(`gameWinner`, function (string) {
                console.log(string);
                if (string === `doctor`) {
                    doctorWin=true;
                } 
                if (string === `patient`) {
                    patientWin=true;
                }
            })
            socket.on(`playerMissed`, function (direction) {
                if(doctor) {
                    const missedEmitter = GetEmitter(direction);
                    missedEmitter.start();
                    life = life -1; 
                    lifeGroup.children.entries[life].play('deathheart');
                    emitterExplosion = bloodexplosion.createEmitter(cacheJson);
                    emitterExplosion.setPosition(lifeGroup.children.entries[life].x, lifeGroup.children.entries[life].y)
                    emitterExplosion.explode(200, lifeGroup.children.entries[life].x, lifeGroup.children.entries[life].y);
                    activateOnlyWhenSocketHasBeenSend=true;
                }
            });
            socket.on(`arrowWasRight`, function (direction) {
                if (doctor) {
                    const zone = getZone(direction);
                    zone.setName(`pressed`);
                    console.log(direction);
                }
            });

            lifeGroup= this.physics.add.group({
                maxSize: 7,
                allowGravity: false
            })
            for (let i = 0; i < life; i++) {
                if (i <= 6) {
                    heartSprite = this.add.sprite(xPosHeart+ (i*50), yPosHeart);
                    heartSprite.setScale(.5);
                    heartSprite.play('idleheart');
                    lifeGroup.add(heartSprite);                
                    } else {
                    //console.log(xPosHeart+ ((i-7)*50), yPosHeart +10, i);
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
            this.add.image(350, 332, 'line');
            scoreText = this.add.text(xPosComboText, yPosComboText, 'Combo', { fontSize: '32px', fill: '#b8baad', fontFamily: 'futura-pt, sans serif' }); 
            scoreText.setAlpha(0);
            textTimer = this.add.text(xPosTimer, yPosTimer, '5:00', { fontSize: '30px', fill: '#ff3e36', fontFamily: 'futura-pt, sans serif' })
            textBpm = this.add.text(xPosBpm, yPosBpm, '0', { fontSize: '30px', fill: '#ff3e36', fontFamily: 'futura-pt, sans serif' })
            textGameSpeed = this.add.text(268, 220, '1X', { fontSize: '50px', fill: '#ff3e36', fontFamily: 'poleno,  sans serif' })
            // ----------------------------------------- zone ------------------------------

            this.add.image(700,400, 'spiral').setDepth(-1);
            this.add.image(620, 720, 'hart').setDepth(1);
            this.add.image(760, 720, 'long').setDepth(1);
            this.add.image(940, 720, 'hersenen').setDepth(1);
            this.add.image(1100, 720, 'lever').setDepth(1);
            platforms = this.physics.add.staticGroup()
            platforms.create(xPosPlatform, yPosPlatform, 'platformBlack').refreshBody()
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

            indie= this.add.image(210, 424, 'indie');
        }

        function checkHeartDoctor () {
            if (bpm >= 100) {
                //console.log(`hartje is hoger dan 100`);
                gameSpeed= 900;
            } else if (bpm >= 80) {
                //console.log(`hartje is tussen 80 en 100`);
                gameSpeed= 500;
            } else if (bpm <= 80) {
                //console.log(`hart onder de 80`);
                gameSpeed= 300;
            }
        }

        function levelGameSpeed () {
            switch (level) {
                case 1:
                    gameSpeed= 900;
                    break;
                case 2:
                    gameSpeed= 800;
                    break;
                case 3:
                    gameSpeed=500;
                    break;
                case 4:
                    gameSpeed=400;
                    break;
                case 5:
                    gameSpeed=300;
                    break;
                case 6:
                    gameSpeed=200;
                    break;
                case 7:
                    gameSpeed=150;
                    break;
                default:
                    break;
            }         
        }

        function checkheartBeat() {
            if((averageHeartBeat-bpm) >= 5) {
                if(updateLevel === level ) {
                    if(level !== 2){
                        level--;
                        socket.emit('level', level);
                        indie.setPosition(95, 424)
                    } 
                }
            }
            if((averageHeartBeat-bpm) <= -5) {
                if(updateLevel === level ) {
                    level++;
                    socket.emit('level', level);
                    indie.setPosition(320, 424);
                }
            }
            if((averageHeartBeat-bpm) > -5 && (averageHeartBeat-bpm) < 5) {
                if(updateLevel !== level ) {
                    level = updateLevel;
                    socket.emit('level', level);
                    indie.setPosition(210, 424);
                }
            }
        }

        let lastSpeed;
        let updateLevel;

        function averageOfArray (arr) {
            return arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        }

        function changeLevel (timeF) {
            if (timeF >= 60000 && updateLevel=== 2 ) {
                console.log(`higher number`);
                updateLevel++
                level++
                socket.emit("level", level);    
            } else if(timeF >= 120000 && updateLevel=== 3) {
                updateLevel++
                level++
                socket.emit("level", level);     
            } else if (timeF >= 180000 && updateLevel=== 4) {
                updateLevel++
                level++
                socket.emit("level", level);
            } else if (timeF >= 240000 && updateLevel=== 4) {
                updateLevel++
                level++
                socket.emit("level", level);
            } else if (timeF >= 300000 && updateLevel=== 5) {
                console.log(`game over`);
            }
        }

        let onceDoctor = true;
        let gameStarted = false;
        let onceRoom = true;
        let onceStartGame = true;
        let timeStart;
        let activateOnlyWhenSocketHasBeenSend = false;

        function update(time, delta) {
            if (activateOnlyWhenSocketHasBeenSend) {
                activateOnlyWhenSocketHasBeenSend = false;
                this.time.delayedCall(150, destroyEmitter, [], this);
                this.time.delayedCall(150, destroyEmitterHeart, [], this);             
            }

            if(gameStartReally && onceStartGame) {
                fiveMinTimer = 300000;
                timeStart= time;
                onceStartGame = false;
            }

            if (onceRoom) {
                socket.emit(`getRoom`, true);
                onceRoom = false;
            }

            if (doctorWin && gameStartReally) {
                doctorWinHtml.setVisible(true);
                home.setVisible(true);
                gameStarted= false;
            }

            if(patientWin && gameStartReally) {
                patientWinHtml.setVisible(true);
                home.setVisible(true);
                gameStarted= false;
            }

            if (heartRateGemid.length === 10 && heartRateGemid[9] !== `end`) {
                averageHeartBeat= averageOfArray(heartRateGemid);
                heartRateGemid.pop();
                heartRateGemid.push(`end`);
                console.log(averageHeartBeat);
                level = 2;
                socket.emit("level", level);
                updateLevel= 2;
            }

            if (!doctor) {
                if (level >= 2 ) {
                    checkheartBeat()
                }
                changeLevel(time);
            }
            levelGameSpeed();

            if (gameOver && once && gameStartReally &&patientDied) {
                once= false;
                socket.emit(`gameOver`, false);
            }
            
            if (gameOver && once && gameStartReally&&doctorDied) {
                once= false;
                socket.emit(`gameOver`, true);
            }  

            if(gameStarted) {
                if (onceDoctor) {
                    if(doctor) {
                        this.add.image(220, 630, 'headDoctor');
                        const arrowLeft = this.add.image(cordsLeft, 150, 'arrowZone');
                        const arrowRight =this.add.image(cordsRight, 150, 'arrowZone');
                        const arrowUp = this.add.image(cordsUp, 150, 'arrowZone');
                        const arrowDown = this.add.image(cordsDown, 150, 'arrowZone');
                        arrowRight.setRotation(15.7);
                        arrowUp.setRotation(1.55);
                        arrowDown.setRotation(4.72);
                    } else {
                        this.add.image(220,630, 'headPatient');
                        const arrowLeft = this.add.image(cordsLeft, yPosZones, 'arrowZone');
                        const arrowRight =this.add.image(cordsRight, yPosZones, 'arrowZone');
                        const arrowUp = this.add.image(cordsUp, yPosZones, 'arrowZone');
                        const arrowDown = this.add.image(cordsDown, yPosZones, 'arrowZone');
                        arrowRight.setRotation(15.7);
                        arrowUp.setRotation(1.55);
                        arrowDown.setRotation(4.72);
                    }
                    onceDoctor = false;
                }
            }

            if ((fiveMinTimer-(time- timeStart))<= 0 && gameStartReally) {
                gameOver=true;
                doctorDied= true;
            }
            textGameSpeed.setText(level+ 'X');
            textBpm.setText(bpm);
            textTimer.setText(millisToMinutesAndSeconds(fiveMinTimer-(time- timeStart)));

            // ----------------------------------------- zone controller ------------------------------
            zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;
            
            if(!zone.body.touching.none) {
                if(cursors.left.isDown){
                    if (cursors.left.getDuration() <= 500) {
                        arrowInZone(1);
                    } else {
                        losePoints();
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

            if (!doctor && gameStarted &&gameStartReally) {
                if (zone.body.touching.none && this.input.keyboard.checkDown(cursors.left, 500)) {
                    emitter.start();
                    this.time.delayedCall(150, destroyEmitter, [], this);
                    losePoints (`left`);
                    this.time.delayedCall(150, destroyEmitterHeart, [], this);
                }
                if (zone2.body.touching.none && this.input.keyboard.checkDown(cursors.up, 500)) {
                    emitter2.start();
                    this.time.delayedCall(150, destroyEmitter, [], this);
                    losePoints (`up`);
                    this.time.delayedCall(150, destroyEmitterHeart, [], this);
                }
                if (zone3.body.touching.none && this.input.keyboard.checkDown(cursors.down, 500)) {
                    emitter3.start();
                    this.time.delayedCall(150, destroyEmitter, [], this);
                    losePoints (`down`);
                    this.time.delayedCall(150, destroyEmitterHeart, [], this);
                }
                if (zone4.body.touching.none && this.input.keyboard.checkDown(cursors.right, 500)) {
                    emitter4.start();
                    this.time.delayedCall(150, destroyEmitter, [], this);
                    losePoints (`right`);
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
            losePoints(arrows.name);
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
                    score += 1;
                    if (!doctor) {
                        newCombo();
                    }
                    if (level === 1 && heartRateGemid.length !== 10) {
                        heartRateGemid.push(bpm);
                    }
                    socket.emit(`arrowWasRight`, getDirectionZone (zones.x));
            }
        }

        let comboReset = true;

        function newCombo () {
            scoreText.setText('combo: ' + score);
                let particlesGood = scene.add.particles('good');

                let emitterGood = particlesGood.createEmitter({
                    speed: 500,
                    scale: { start: 1, end:0 }
                });
                emitterGood.stop();
                emitterGood.explode(20, xPosComboText+50, yPosComboText+5);

            scene.tweens.add({
                targets: scoreText,
                alpha: 1,
                duration: 500,
                onComplete : function () {
                    // here comes different animaitons for the combo meter
                    if( comboReset) {
                    scene.tweens.add({
                        targets: scoreText,
                        alpha: 1,
                        duration: 4000,
                        onComplete : function () {
                                scene.tweens.add({
                                    targets: scoreText,
                                    alpha: 0,
                                    duration: 1000
                                });
                            comboReset=true
                        }
                    });
                    }
                    comboReset=false;
                }
            })
        }

        function getDirectionZone (x) {
            if (x === 620) {
                return `left`;
            } else if (x === 1080) {
                return `right`;
            } else
            if (x === 770) {
                return `up`;                
            } else 
            if (x === 930) {
                return `down`;
            }
        }

        function getZone (direction) {
            if (direction === `left`) {
                return zone;
            } else if (direction === `right`) {
                return zone4;
            } else
            if (direction === `up`) {
                return zone2;                
            } else 
            if (direction === `down`) {
                return zone3;
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
                    handDoctor.setPosition(GetCords(direction),-50);
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

        function GetEmitter (direction) {
            if (direction === `left`) {
                return emitter;
            } else if (direction === `right`) {
                return emitter4;
            } else
            if (direction === `up`) {
                return emitter2;                
            } else 
            if (direction === `down`) {
                return emitter3;
            }
        }

        function arrowInZone (zoneNumber) {
            if(!doctor) {
                const nameRightZone= nameZone(zoneNumber);
                nameRightZone.setName(`pressed`);
            }
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

        function losePoints (direction) {
            score = 0;
            scoreText.setText('combo: ' + score);

                            
            if (cody.anims.getName() === 'idle') {
                cody.play('punch');
                cody.chain([ 'idle' ]);
            }

            if (!doctor) {
                if(life > 0){
                    life = life -1; 
                    lifeGroup.children.entries[life].play('deathheart');
                    emitterExplosion = bloodexplosion.createEmitter(cacheJson);
                    emitterExplosion.setPosition(lifeGroup.children.entries[life].x, lifeGroup.children.entries[life].y);
                    emitterExplosion.explode(200, lifeGroup.children.entries[life].x, lifeGroup.children.entries[life].y);
                } else {
                    gameOver = true;
                    patientDied=true;
                }
                socket.emit(`playerMissed`, direction);
            }
        }

        function destroyEmitter() {
            emitter.stop();
            emitter2.stop();
            emitter3.stop();
            emitter4.stop();
        }

        function destroyEmitterHeart() {
            //emitterExplosion.stop();
            //console.log(`Deze functie doet niets meer maar omdat het te veel werk is om het weg te doen zet ik er nu een leuk tekstje in.`)
        }

        function checkSpeed (speedMs) {
            if(speedMs === 500){
                return 1;
            } else  if (speedMs === 900) { 
                return 2;
            } else if (speedMs === 300) {
                return 0.5; 
            } 
        } 
}
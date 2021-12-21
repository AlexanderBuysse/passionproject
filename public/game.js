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
                debug: false,
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
        var cursors;

        let arrows;
        let arrowsClass;

        //let timeWhenFunction = 0;

        let zone;
        let zone2;
        let zone3;
        let zone4;
        let scoreText;
        //let score = 0;

        var element;
        let button;
        //let doctor;

        const cordsLeft=620;
        const cordsUp=770;
        const cordsDown=930;
        const cordsRight =1080;

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
        
        let spriteDoctor;
        //let spritePatient;
 
        let lifeGroup;

        //let gameOver = false;
        //let once = true;

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

        //let fiveMinTimer = 5000;
        let textTimer;

        let gameSpeed= 500;
        //let level = 1;
        //let heartRateGemid = [];
        let arrowsCaught = 0;

        let textGameSpeed;

        //let bpm= 0;
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
        //let doctorWin = false;
        //let patientWin = false;        
        let doctorWinHtml;
        let patientWinHtml;
        let countdown;

        //let playerOne= false;
        //let playerTwo= false;

        //let gameStartReally = false;
        let patientDied= false;
        let doctorDied= false;

        let scene;

        const yPosComboText = 500;
        const xPosComboText = 500;

        //let personedJoined = false;
        let selectDoctor = false;

        let roomSelected;

        let soundHalloween;

        //let disableSound= false;
        
        
        function preload() {

            this.load.spritesheet('brawler', 'assets/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('arrow', 'assets/arrow.png');

            this.load.html('nameform', 'assets/text/loginform.html');

            this.load.image('blood', 'assets/blood.png');
            
            this.load.image('heart', 'assets/heart.png');
            this.load.atlas('heartgif', 'assets/heartSprite.png', 'assets/text/heart.json');
            this.load.atlas('spriteDoctor', 'assets/sprites/spriteSheetDoctor.png', 'assets/sprites/spritesDoctor.json');
            this.load.atlas('spritePatient', 'assets/sprites/spriteSheetPatient.png', 'assets/sprites/spritesPatient.json');

            this.load.image('bloodexplo', 'assets/blood.png');
            this.load.image('good', 'assets/good.png');
            this.load.json('emitter', 'assets/text/explodeblood.json');

            this.load.html('home', 'assets/text/home.html');
            this.load.html('rooms', 'assets/text/rooms.html');
            this.load.html('menu', 'assets/text/menu.html');
            this.load.html('countdown', 'assets/text/countdown.html');
            this.load.html('tutorial', 'assets/text/tutorial.html');
            this.load.html('patientwin', 'assets/text/patientwin.html');
            this.load.html('doctorwin', 'assets/text/doctorwin.html');

            this.load.image('smallui', 'assets/design/livespatient.png');
            this.load.image('smalluiDoctor', 'assets/design/livesdoctor.png');
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

            this.load.audio('soundHalloween', 'assets/sound/halloween.mp3');
        }

        function connect() {
            var ws = new WebSocket('wss://dev.pulsoid.net/api/v1/data/real_time?access_token=ca88ff26-710a-4bb8-81f6-bc32ffcabe5d');
            ws.onopen = function() {
                ws.send(JSON.stringify({
                }));
            };
            ws.onmessage = function(e) {
                const messageObj = JSON.parse(e.data);
                scene.data.set(`bpm`, messageObj.data.heart_rate);
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
            let socket = io();
            let life= 7;
            this.data.set(`socket`, socket);
            this.data.set(`xPosHeart`, 60);
            this.data.set(`yPosHeart`,105);
            this.data.set(`yPosZones`,630);
            this.data.set(`cordsLeft`, 620);
            this.data.set(`cordsUp`, 770);
            this.data.set(`cordsDown`, 930);
            this.data.set(`cordsRight`, 1080);
            this.data.set(`xPosComboText`, 500);            
            this.data.set(`yPosComboText`, 500);
            this.data.set(`xPosTimer`, 76);            
            this.data.set(`yPosTimer`, 235);
            this.data.set(`xPosBpm`, 235);            
            this.data.set(`yPosBpm`, 340);
            this.data.set(`yPosPlatform`, 760);            
            this.data.set(`xPosPlatform`, 850);            
            this.data.set(`yPosEmitters`, 700);
            this.data.set(`onceTimePls`, true);
            this.data.set(`personedJoined`, false);
            this.data.set(`gameStartReally`, false);
            this.data.set(`activateOnlyWhenSocketHasBeenSend`, false);
            this.data.set(`onceRoom`, true);
            this.data.set(`doctorWin`, false);
            this.data.set(`patientWin`, false);
            this.data.set(`heartRateGemid`, []);
            this.data.set(`level`, 1);
            this.data.set(`gameOver`, false);
            this.data.set(`gameStarted`, false);
            this.data.set(`fiveMinTimer`, 5000);
            this.data.set(`timeStart`, undefined);
            this.data.set(`bpm`, 0);
            this.data.set(`timeWhenFunction`, 0);
            this.data.set(`playerOne`, false);
            this.data.set(`playerTwo`, false);
            this.data.set(`onceDoctor`, true);
            this.data.set(`disableSound`, false);
            this.data.set(`onceStartGame`, true);
            this.data.set(`counterTime`, 3);
            this.data.set(`doctor`, undefined);
            this.data.set(`score`, 0);
            this.data.set(`spritePatient`, undefined);
            this.data.set(`comboReset`, true);
            this.data.set(`once`, true);

            const socketCreate = this.data.get(`socket`);
            
            scene = this;
            this.data.set(`life`, life);
            handDoctor = this.add.image(this.data.get('cordsLeft'), -50, 'handDoctor');
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

            countdown = this.add.dom(625, 800).createFromCache('countdown');
            countdown.setVisible(false);

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

            this.add.image(210, 80, 'smalluiDoctor');
            this.add.image(210, 232, 'smallui2');
            this.add.image(210, 384, 'smallui3');
            this.add.image(210, 626, 'mediumui');
            element.setVisible(false);
            gameMenu.setVisible(true);
            //rooms.setVisible(true);
            //home.setVisible(false);

            element.setPerspective(800);
            rooms.setPerspective(800);
            rooms.addListener('click');
            rooms.addListener('submit');
            rooms.on('submit', function (event) {
                event.preventDefault();
            })
            rooms.on('click', function (event) {
                if (event.target.name === 'leaveRooms') {
                    rooms.setVisible(false);
                    gameMenu.setVisible(true);
                }
                if (event.target.name === 'room1') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socketCreate.emit("room", `room1`);
                    roomSelected = `room1`;
                }
                if (event.target.name === 'room2') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socketCreate.emit("room", `room2`);
                    roomSelected = `room2`;
                }
                if (event.target.name === 'room3') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socketCreate.emit("room", `room3`);
                    roomSelected = `room3`;
                }
                if (event.target.name === 'room4') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socketCreate.emit("room", `room4`);
                    roomSelected = `room4`;
                }
                if (event.target.name === 'room5') {
                    element.setVisible(true);
                    rooms.setVisible(false);
                    socketCreate.emit("room", `room5`);
                    roomSelected = `room5`;
                    scene.data.set(`disableSound`, true);
                }
            });


            element.addListener('click');
            element.addListener('submit');
            element.on('submit', function (event) {
                event.preventDefault();
                const oke = scene.data.get(`personedJoined`)
                if (oke) {
                    if(event.target[0].checked === true) {
                        this.removeListener('click');
                        this.removeListener('submit');
                        element.getChildByID(`submitlogin`).classList.add(`nothing`);
                        element.getChildByID(`patient`).disabled = true;
                        scene.data.set(`doctor`, true);
                        gameStart= true;
                        socketCreate.emit('playerOne', [true, roomSelected]);
                        scene.data.set(`gameStarted`, true);
                        if (!scene.data.get(`playerOne`) && !scene.data.get(`playerTwo`)) {
                            socketCreate.emit(`characterChosen`, [`doctor`, roomSelected]);
                        };
                    } else {
                        this.removeListener('click');
                        this.removeListener('submit');
                        element.getChildByID(`submitlogin`).classList.add(`nothing`);
                        element.getChildByID(`doctor`).disabled = true;
                        gameStart= true; 
                        socketCreate.emit('playerTwo', [true, roomSelected]);
                        scene.data.set(`gameStarted`, true);
                        if (!scene.data.get(`playerOne`) && !scene.data.get(`playerTwo`)) {
                            socketCreate.emit(`characterChosen`, [`patient`, roomSelected]);
                        };
                    }                    
                }
            })
            element.on('click', function (event) {
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
                targets: countdown,
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
                key: 'idleDoctor',
                frames: this.anims.generateFrameNames('spriteDoctor', {prefix: 'sprite', end: 4, zeroPad:0}),
                frameRate: 2,
                repeat: -1
            });

            this.anims.create({
                key: 'damageDoctor',
                frames: this.anims.generateFrameNames('spriteDoctor', {prefix: 'sprite',start: 5, end: 10, zeroPad:0}),
                frameRate: 7,
                repeat: 0
            });

            this.anims.create({
                key: 'winDoctor',
                frames: this.anims.generateFrameNames('spriteDoctor', {prefix: 'sprite',start: 11, end: 14, zeroPad:0}),
                frameRate: 3,
                repeat: 0
            });

            this.anims.create({
                key: 'idlePatient',
                frames: this.anims.generateFrameNames('spritePatient', {prefix: 'sprite', end: 4, zeroPad:0}),
                frameRate: 2,
                repeat: -1
            });

            this.anims.create({
                key: 'damagePatient',
                frames: this.anims.generateFrameNames('spritePatient', {prefix: 'sprite',start: 5, end: 10, zeroPad:0}),
                frameRate: 7,
                repeat: 0
            });

            this.anims.create({
                key: 'winPatient',
                frames: this.anims.generateFrameNames('spritePatient', {prefix: 'sprite',start: 11, end: 14, zeroPad:0}),
                frameRate: 3,
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

                    if(scene.data.get(`level`)===3) {
                        this.rotation = this.rotation+.1;
                    }
                    if(scene.data.get(`level`) === 4){
                        this.alpha= this.alpha-.01; 
                    }
                    if(scene.data.get(`level`) === 5) {
                        this.alpha= this.alpha-.01; 
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

            socketCreate.on('arrow', function (arrayInfo) {
                if(!scene.data.get(`doctor`)) {
                    if (arrayInfo[0]) {
                        SendArrow(arrayInfo[1], 0, false);
                        scene.tweens.add({
                            targets: handDoctor,
                            x: GetCords(arrayInfo[1]),
                            duration: 150,
                            ease: 'Elastic',
                            onComplete : function () {
                            }
                        });
                    }
                }
            });
            socketCreate.on('level', function (levelFromSocket) {
                if(scene.data.get(`doctor`)) {
                    console.log(levelFromSocket);
                    scene.data.set(`level`, levelFromSocket);
                }
            });
            socketCreate.on(`rooms`, function (roomsObject) {
                const selectRooms = number => {
                    if (number === 0 ){
                        return `room1`
                    }
                    if (number === 1 ){
                        return `room2`
                    }
                    if (number === 2){
                        return `room3`
                    }
                    if (number === 3){
                        return `room4`
                    }
                    if (number === 4 ){
                        return `room5`
                    }
                }
                //console.log(roomsObject);
                for (let i = 0; i < roomsObject.length; i++) {
                    const roomstring = selectRooms(i);
                    for (let j = 0; j < 3; j++) {
                        if (roomsObject[i].length===j ){
                            rooms.getChildByID(`${roomstring}Counter`).textContent= `${j}/2`; 
                            if (j === 2) {
                                rooms.getChildByID(`${roomstring}Submit`).disabled= true;
                                rooms.getChildByID(`${roomstring}Submit`).value= `Full`;
                            }else { 
                                rooms.getChildByID(`${roomstring}Submit`).disabled= false;
                                rooms.getChildByID(`${roomstring}Submit`).value= `Join`;        
                            }
                        }
                    }
                }
            });
            socketCreate.on(`left`, function (left) {
                console.log(left);
                window.location.reload();
            })

            socketCreate.on(`playerOneTrue` , function (bool) {
                scene.data.set(`playerOne`, true);
                if(scene.data.get(`playerOne`)&&scene.data.get(`playerTwo`)) {
                    scene.data.set(`gameStartReally`, true);
                }
            })
            socketCreate.on(`playerTwoTrue` , function (bool) {
                scene.data.set(`playerTwo`, true);
                if(scene.data.get(`playerOne`)&&scene.data.get(`playerTwo`)) {
                    scene.data.set(`gameStartReally`, true);
                }
            })
            socketCreate.on(`gameWinner`, function (string) {
                if (string === `doctor`) {
                    scene.data.set(`doctorWin`, true);
                } 
                if (string === `patient`) {
                    scene.data.set(`patientWin`, true);
                }
            })
            socketCreate.on(`playerMissed`, function (direction) {
                if(scene.data.get(`doctor`)) {
                    const missedEmitter = GetEmitter(direction);
                    missedEmitter.start();
                    let lifeHer = scene.data.get(`life`);
                    scene.data.set(`life`, lifeHer -1);
                    lifeGroup.children.entries[lifeHer-1].play('deathheart');
                    emitterExplosion = bloodexplosion.createEmitter(cacheJson);
                    emitterExplosion.setPosition(lifeGroup.children.entries[lifeHer-1].x, lifeGroup.children.entries[lifeHer-1].y)
                    emitterExplosion.explode(200, lifeGroup.children.entries[lifeHer-1].x, lifeGroup.children.entries[lifeHer-1].y);
                    scene.data.set(`activateOnlyWhenSocketHasBeenSend`, true);
                }
            });
            socketCreate.on(`arrowWasRight`, function (direction) {
                if (scene.data.get(`doctor`)) {
                    const zone = getZone(direction);
                    zone.setName(`pressed`);
                    if (spriteDoctor.anims.getName() === 'idleDoctor') {
                        spriteDoctor.play('damageDoctor');
                        spriteDoctor.chain([ 'idleDoctor' ]);
                    }
                    let particlesGood = scene.add.particles('good');

                    let emitterGood = particlesGood.createEmitter({
                        speed: 500,
                        scale: { start: 1, end:0 }
                    });
                    emitterGood.stop();
                    emitterGood.explode(20, zone.x, zone.y);
                }
            });

            socketCreate.on(`twoPlayersInRoom`, function (bool) {
                scene.data.set(`personedJoined`, bool);
            });

            socketCreate.on(`playerInRoom`, function (wop) {
                if(wop === `not` && !element.getChildByID(`doctor`).checked) {
                    //element.getChildByID(`doctor`).disabled=true;
                    //kijken voor character selector
                }
            });
            socketCreate.on(`disableCharacter`, function (string) {
                if (string === `doctor` && !scene.data.get(`gameStarted`)) {
                    element.getChildByID(string).disabled=true;
                    element.getChildByID(`patient`).checked=true;
                }
                if (string === `patient` && !scene.data.get(`gameStarted`)) {
                    element.getChildByID(string).disabled=true;
                    element.getChildByID(`doctor`).checked=true;
                }
            });
            socketCreate.on(`sound`, function (high) {
                if (scene.data.get(`doctor`) &&scene.data.get(`disableSound`)) {
                    if(high === 2) {
                        soundHalloween.setRate(1.1);
                    }
                    if( high === 3) {
                        soundHalloween.setRate(1.2);
                    }
                    if(high === 4) {
                        soundHalloween.setRate(1.3);
                    }
                    if(high === 5) {
                        soundHalloween.setRate(1.4);
                    }
                    if(high === 6) {
                        soundHalloween.setRate(1.5);
                    }
                }
            })

            lifeGroup= this.physics.add.group({
                maxSize: 7,
                allowGravity: false
            })

            for (let i = 0; i < scene.data.get(`life`); i++) {
                if (i <= 6) {
                    heartSprite = this.add.sprite(this.data.get(`xPosHeart`)+ (i*50), this.data.get(`yPosHeart`));
                    heartSprite.setScale(.5);
                    heartSprite.play('idleheart');
                    lifeGroup.add(heartSprite);                
                    } else {
                    heartSprite = this.add.sprite(this.data.get(`xPosHeart`)+ ((i-7)*50), this.data.get(`yPosHeart`)+50);
                    heartSprite.setScale(.5);
                    heartSprite.play('idleheart');
                    lifeGroup.add(heartSprite);
                }
            }
            // ----------------------------------------- arrows class ------------------------------

            // ----------------------------------------- zone ------------------------------
            
            zone = this.add.zone(scene.data.get('cordsLeft'), this.data.get(`yPosZones`)).setSize(100, 100);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;
        
            zone2 = this.add.zone(scene.data.get(`cordsUp`), this.data.get(`yPosZones`)).setSize(100, 100);
            this.physics.world.enable(zone2);
            zone2.body.setAllowGravity(false);
            zone2.body.moves = false;

            zone3 = this.add.zone(scene.data.get(`cordsDown`), this.data.get(`yPosZones`)).setSize(100, 100);
            this.physics.world.enable(zone3);
            zone3.body.setAllowGravity(false);
            zone3.body.moves = false;

            zone4 = this.add.zone(scene.data.get(`cordsRight`), this.data.get(`yPosZones`)).setSize(100, 100);
            this.physics.world.enable(zone4);
            zone4.body.setAllowGravity(false);
            zone4.body.moves = false;

            //this.add.image(400, 800, 'sky');
            this.add.image(350, 332, 'line');
            scoreText = this.add.text(scene.data.get(`xPosComboText`), scene.data.get(`yPosComboText`), 'Combo', { fontSize: '32px', fill: '#b8baad', fontFamily: 'futura-pt, sans serif' }); 
            scoreText.setAlpha(0);
            textTimer = this.add.text(scene.data.get(`xPosTimer`), scene.data.get(`yPosTimer`), '5:00', { fontSize: '30px', fill: '#ff3e36', fontFamily: 'futura-pt, sans serif' })
            textBpm = this.add.text(this.data.get(`xPosBpm`), this.data.get(`yPosBpm`), '0', { fontSize: '30px', fill: '#ff3e36', fontFamily: 'futura-pt, sans serif' })
            textGameSpeed = this.add.text(268, 220, '1X', { fontSize: '50px', fill: '#ff3e36', fontFamily: 'poleno,  sans serif' })
            // ----------------------------------------- zone ------------------------------

            this.add.image(700,400, 'spiral').setDepth(-1);
            this.add.image(620, 720, 'hart').setDepth(1);
            this.add.image(760, 720, 'long').setDepth(1);
            this.add.image(940, 720, 'hersenen').setDepth(1);
            this.add.image(1100, 720, 'lever').setDepth(1);
            platforms = this.physics.add.staticGroup()
            platforms.create(this.data.get(`xPosPlatform`), this.data.get(`yPosPlatform`), 'platformBlack').refreshBody()
            this.physics.add.overlap(arrowsClass, zone, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone2,removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone3, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, zone4, removeArrowZone, null, this);
            this.physics.add.overlap(arrowsClass, platforms, removeArrow, null, this);

            particles = this.add.particles('blood');

            emitter = particles.createEmitter({
                x: scene.data.get(`cordsLeft`),
                y: scene.data.get(`yPosEmitters`),
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
                x: scene.data.get(`cordsUp`),
                y: scene.data.get(`yPosEmitters`),
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
                x: scene.data.get(`cordsDown`),
                y: scene.data.get(`yPosEmitters`),
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
                x: scene.data.get(`cordsRight`),
                y: scene.data.get(`yPosEmitters`),
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
            if (scene.data.get(`bpm`) >= 100) {
                gameSpeed= 900;
            } else if (scene.data.get(`bpm`) >= 80) {
                gameSpeed= 500;
            } else if (scene.data.get(`bpm`) <= 80) {
                gameSpeed= 300;
            }
        }


        function levelGameSpeed () {
            switch (scene.data.get(`level`)) {
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
                    gameSpeed=400;
                    break;
                case 6:
                    gameSpeed=400;
                    break;
                case 7:
                    gameSpeed=400;
                    break;
                default:
                    break;
            }         
        }

        function checkheartBeat() {
            const socketCreate = scene.data.get(`socket`)
            if((averageHeartBeat-scene.data.get(`bpm`)) >= 5) {
                if(updateLevel ===scene.data.get(`level`)) {
                    if(scene.data.get(`level`) !== 2){
                        scene.data.set(`level`, scene.data.get(`level`) -1);
                        if (scene.data.get(`disableSound`)) {
                            soundHalloween.setRate(.8);
                        }
                        socketCreate.emit('level', [scene.data.get(`level`), roomSelected]);
                        indie.setPosition(95, 424)
                    } 
                }
            }
            if((averageHeartBeat-scene.data.get(`bpm`)) <= -5) {
                if(updateLevel === scene.data.get(`level`) ) {
                    scene.data.set(`level`, scene.data.get(`level`) +1);
                    if (scene.data.get(`disableSound`)) {
                        soundHalloween.setRate(1.2);
                    }
                    socketCreate.emit('level', [scene.data.get(`level`), roomSelected]);
                    indie.setPosition(320, 424);
                }
            }
            if((averageHeartBeat-scene.data.get(`bpm`)) > -5 && (averageHeartBeat-scene.data.get(`bpm`)) < 5) {
                if(updateLevel !== scene.data.get(`level`) ) {
                    scene.data.set(`level`, updateLevel)
                    if (scene.data.get(`disableSound`)) {
                        soundHalloween.setRate(1);
                    }
                    socketCreate.emit('level', [scene.data.get(`level`), roomSelected]);
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
            const socketCreate = scene.data.get(`socket`)
            //console.log(`level changed`);
            if (timeF >= 60000 && updateLevel=== 2 ) {
                updateLevel++
                scene.data.set(`level`, scene.data.get(`level`)+1);
                socketCreate.emit("level", [scene.data.get(`level`), roomSelected]);    
            } else if(timeF >= 120000 && updateLevel=== 3) {
                updateLevel++
                scene.data.set(`level`, scene.data.get(`level`)+1);
                socketCreate.emit("level", [scene.data.get(`level`), roomSelected]);     
            } else if (timeF >= 180000 && updateLevel=== 4) {
                updateLevel++
                scene.data.set(`level`, scene.data.get(`level`)+1);
                socketCreate.emit("level", [scene.data.get(`level`), roomSelected]);
            } else if (timeF >= 240000 && updateLevel=== 4) {
                updateLevel++
                scene.data.set(`level`, scene.data.get(`level`)+1);
                socketCreate.emit("level", [scene.data.get(`level`), roomSelected]);
            } else if (timeF >= 300000 && updateLevel=== 5) {
            }
        }

        //let onceDoctor = true;
        //let gameStarted = false;
        //let onceRoom = true;
        //let onceStartGame = true;
        //let timeStart;
        //let activateOnlyWhenSocketHasBeenSend = false;
        //let counterTime = 3;
        let onceTimePls = true;

        function reloadScreen () {
            window.location.reload();
        }

        function update(time, delta) {
            //console.log(this.data.get(`socket`));
            const socketCreate = scene.data.get(`socket`);
            const onceTimePls = scene.data.get(`onceTimePls`);
            const personedJoined = scene.data.get(`personedJoined`);
            const activateOnlyWhenSocketHasBeenSend = scene.data.get(`activateOnlyWhenSocketHasBeenSend`);
            const gameStartReally = scene.data.get(`gameStartReally`);
            const onceRoom = scene.data.get(`onceRoom`);
            const doctorWin = scene.data.get(`doctorWin`);
            const patientWin = scene.data.get(`patientWin`);
            const heartRateGemid = scene.data.get(`heartRateGemid`);
            const gameOver = scene.data.get(`gameOver`);
            const gameStarted = scene.data.get(`gameStarted`);
            const fiveMinTimer = scene.data.get(`fiveMinTimer`);
            const timeStart = scene.data.get(`timeStart`);
            const onceDoctor = scene.data.get(`onceDoctor`);
            const onceStartGame = scene.data.get(`onceStartGame`);
            
            if (onceTimePls) {
                if (personedJoined) {
                    element.getChildByID(`submitlogin`).value= `Lock decision`
                    scene.data.set(`onceTimePls`, false);
                }; 
            };
            if (activateOnlyWhenSocketHasBeenSend) {
                scene.data.set(`activateOnlyWhenSocketHasBeenSend`, false);
                this.time.delayedCall(150, destroyEmitter, [], this);
                this.time.delayedCall(150, destroyEmitterHeart, [], this);             
            }
            if(gameStartReally && onceStartGame) {
                scene.data.set(`onceStartGame`, false);
                element.setVisible(false);
                countdown.setVisible(true);
                this.time.delayedCall(1000, countdownF, [], this);
                this.time.delayedCall(2000, countdownF, [], this);
                this.time.delayedCall(3000, countdownF, [], this);
                this.time.delayedCall(4000, countdownF, [], this);
                this.time.delayedCall(5100, delay, [], this);
            }

            function countdownF () {
                let counterNow = scene.data.get(`counterTime`);
                countdown.getChildByID(`count`).textContent = counterNow--;
                scene.data.set(`counterTime`, counterNow--);
            }

            function delay () {
                scene.data.set(`fiveMinTimer`, 300000);
                scene.data.set(`timeStart`, time);
                countdown.setVisible(false);
                home.setVisible(false);
            }

            if (onceRoom) {
                socketCreate.emit(`getRoom`, true);
                scene.data.set(`onceRoom`, false);
            }

            if (doctorWin && gameStartReally) {
                doctorWinHtml.setVisible(true);
                home.setVisible(true);
                scene.data.set(`gameStarted`, false);
                this.time.delayedCall(120000, reloadScreen, [], this);
            }

            if(patientWin && gameStartReally) {
                patientWinHtml.setVisible(true);
                home.setVisible(true);
                scene.data.set(`gameStarted`, false);
                this.time.delayedCall(120000, reloadScreen, [], this);
            }

            if (heartRateGemid.length === 10 && heartRateGemid[9] !== `end`) {
                averageHeartBeat= averageOfArray(heartRateGemid);
                heartRateGemid.pop();
                heartRateGemid.push(`end`);
                scene.data.set(`heartRateGemid`, heartRateGemid);
                console.log(averageHeartBeat);
                scene.data.set(`level`, 2);
                if (!scene.data.get(`doctor`)) {
                    socketCreate.emit("level", [scene.data.get(`level`), roomSelected]);
                }
                updateLevel= 2;
            }

            if (!scene.data.get(`doctor`)) {
                if (scene.data.get(`level`) >= 2 ) {
                    checkheartBeat()
                }
                changeLevel(time);
            }
            levelGameSpeed();

            if (gameOver && scene.data.get(`once`) && gameStartReally &&patientDied) {;
                scene.data.set(`once`, false);
                socketCreate.emit(`gameOver`, [false, roomSelected]);
            }
            
            if (gameOver && scene.data.get(`once`) && gameStartReally&&doctorDied) {
                scene.data.set(`once`, false);
                socketCreate.emit(`gameOver`, [true, roomSelected]);
            }  

            if(gameStarted) {
                if (onceDoctor) {
                    if(scene.data.get(`doctor`)) {
                        //this.add.image(210, 80, 'smalluiDoctor');
                        spriteDoctor= this.add.sprite(220,643);
                        spriteDoctor.play(`idleDoctor`);
                        const arrowLeft = this.add.image(scene.data.get(`cordsLeft`), 150, 'arrowZone');
                        const arrowRight =this.add.image(scene.data.get(`cordsRight`), 150, 'arrowZone');
                        const arrowUp = this.add.image(scene.data.get(`cordsUp`), 150, 'arrowZone');
                        const arrowDown = this.add.image(scene.data.get(`cordsDown`), 150, 'arrowZone');
                        arrowRight.setRotation(15.7);
                        arrowUp.setRotation(1.55);
                        arrowDown.setRotation(4.72);
                    } else {
                        scene.data.set(`spritePatient`, this.add.sprite(220,643));
                        scene.data.get(`spritePatient`).play(`idlePatient`);
                        //this.add.image(210, 80, 'smallui');
                        const arrowLeft = this.add.image(scene.data.get(`cordsLeft`), scene.data.get(`yPosZones`), 'arrowZone');
                        const arrowRight =this.add.image(scene.data.get(`cordsRight`), scene.data.get(`yPosZones`), 'arrowZone');
                        const arrowUp = this.add.image(scene.data.get(`cordsUp`), scene.data.get(`yPosZones`), 'arrowZone');
                        const arrowDown = this.add.image(scene.data.get(`cordsDown`), scene.data.get(`yPosZones`), 'arrowZone');
                        arrowRight.setRotation(15.7);
                        arrowUp.setRotation(1.55);
                        arrowDown.setRotation(4.72);
                    }
                    if (scene.data.get(`disableSound`)) {
                        soundHalloween = this.sound.add('soundHalloween');
    
                        soundHalloween.play({
                            seek: 2.550
                        });
                    }
                    scene.data.set(`onceDoctor`, false);
                }
            }

            if ((fiveMinTimer-(time- timeStart))<= 0 && gameStartReally) {
                scene.data.set(`gameOver`, true);
                doctorDied= true;
            }
            textGameSpeed.setText(scene.data.get(`level`)+ 'X');
            textBpm.setText(scene.data.get(`bpm`));
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

            if (!scene.data.get(`doctor`) && gameStarted &&gameStartReally) {
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

            if (time - scene.data.get(`timeWhenFunction`) >gameSpeed){
                if (this.input.keyboard.checkDown(cursors.left, 1000))
                {
                    if (scene.data.get(`doctor`)) {
                        SendArrow(`left`, time, true);
                    } else {
                    }
                } 

                if (this.input.keyboard.checkDown(cursors.right, 1000))
                {
                    if (scene.data.get(`doctor`)) {
                        SendArrow(`right`, time, true);
                    } else {
                    }

                }
        
                if (this.input.keyboard.checkDown(cursors.up, 1000))
                {
                    if (scene.data.get(`doctor`)) {
                        SendArrow(`up`, time, true);
                    } else {
                    }
                }

                if (this.input.keyboard.checkDown(cursors.down, 1000))
                {
                    if (scene.data.get(`doctor`)) {
                        SendArrow(`down`, time, true);
                    } else {
                    }
                }
            } 
            // ----------------------------------------- arrow controller ----------------------------------          
        }

        function removeArrow (arrows, platforms) {
            arrows.destroy();
            losePoints(arrows.name);
            //this.time.delayedCall(150, destroyEmitterHeart, [], this);
            if(!scene.data.get(`doctor`)) {            
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
            const socketCreate = scene.data.get(`socket`)
            const heartRateGemid = scene.data.get(`heartRateGemid`)
            let score= scene.data.get(`score`);
            if (zones.name===`pressed`) {
                arrows.destroy();
                scene.data.set(`score`,score +1);
                if (!scene.data.get(`doctor`)) {
                    newCombo();
                    if (scene.data.get(`spritePatient`).anims.getName() === 'idlePatient') {
                        scene.data.get(`spritePatient`).play('winPatient');
                        scene.data.get(`spritePatient`).chain([ 'idlePatient' ]);
                    }
                }
                if (scene.data.get(`level`) === 1 && heartRateGemid.length !== 10) {
                    heartRateGemid.push(scene.data.get(`bpm`));
                    scene.data.set(`heartRateGemid`, heartRateGemid)
                }
                socketCreate.emit(`arrowWasRight`, [getDirectionZone (zones.x), roomSelected]);
            }
        }

        //let comboReset = true;

        function newCombo () {
            scoreText.setText('combo: ' + scene.data.get(`score`));
            let particlesGood = scene.add.particles('good');

            let emitterGood = particlesGood.createEmitter({
                speed: 500,
                scale: { start: 1, end:0 }
            });
            emitterGood.stop();
            emitterGood.explode(20, scene.data.get(`xPosComboText`)+50, scene.data.get(`yPosComboText`)+5);

            scene.tweens.add({
                targets: scoreText,
                alpha: 1,
                duration: 500,
                onComplete : function () {
                    // here comes different animaitons for the combo meter
                    if(scene.data.get(`comboReset`)) {
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
                                scene.data.set(`comboReset`, true);
                        }
                    });
                    }
                    scene.data.set(`comboReset`, false);
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
            const socketCreate = scene.data.get(`socket`)
            var arrowClass = arrowsClass.get();
            const cords = GetCords(direction);
            if (arrowClass)
            {
                arrowClass.fire(cords, 100, direction);
                if (userPressedKey) {
                    const arrowInfo = [true, direction];
                    socketCreate.emit('arrow', [arrowInfo, roomSelected]);
                    scene.data.set(`timeWhenFunction`, time);
                    //handDoctor.setPosition(GetCords(direction),-50);
                    scene.tweens.add({
                        targets: handDoctor,
                        x: GetCords(direction),
                        duration: 150,
                        ease: 'Elastic',
                        onComplete : function () {
                            // here comes different animaitons for the combo meter
                        }
                    });
                }
            }
        }

        function GetCords (direction) {
            if (direction === `left`) {
                return scene.data.get('cordsLeft');
            } else if (direction === `right`) {
                return scene.data.get(`cordsRight`);
            } else
            if (direction === `up`) {
                return scene.data.get(`cordsUp`);                
            } else 
            if (direction === `down`) {
                return scene.data.get(`cordsDown`);
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
            if(!scene.data.get(`doctor`)) {
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
            const socketCreate = scene.data.get(`socket`)
            scene.data.set(`score`, 0);
            scoreText.setText('combo: ' + scene.data.get(`score`));
            
            if(scene.data.get(`doctor`)) {
                if (spriteDoctor.anims.getName() === 'idleDoctor') {
                    spriteDoctor.play('winDoctor');
                    spriteDoctor.chain([ 'idleDoctor' ]);
                }
            }
            if (scene.data.get(`spritePatient`)) {
                if (scene.data.get(`spritePatient`).anims.getName() === 'idlePatient') {
                    scene.data.get(`spritePatient`).play('damagePatient');
                    scene.data.get(`spritePatient`).chain([ 'idlePatient' ]);
                }    
            }

            if (!scene.data.get(`doctor`)) {
                let lifeHer = scene.data.get(`life`);
                if(lifeHer > 0){
                    scene.data.set(`life`, lifeHer -1);
                    lifeGroup.children.entries[lifeHer -1].play('deathheart');
                    emitterExplosion = bloodexplosion.createEmitter(cacheJson);
                    emitterExplosion.setPosition(lifeGroup.children.entries[lifeHer -1].x, lifeGroup.children.entries[lifeHer -1].y);
                    emitterExplosion.explode(200, lifeGroup.children.entries[lifeHer -1].x, lifeGroup.children.entries[lifeHer -1].y);
                } else {
                    scene.data.set(`gameOver`, true);
                    patientDied=true;
                }
                socketCreate.emit(`playerMissed`, [direction, roomSelected]);
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
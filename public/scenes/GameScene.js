{


 class GameScene extends Phaser.Scene {
    constructor(){
        super('game-scene');
        
    }

    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 }); 
    }

    create(){
        
    }
}

//module.exports.GameScene = GameScene;
}

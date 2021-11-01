class BootScene extends Phaser.Scene 
{
    constructor()
    {
        super('Boot');
    }

    preload()
    {
        this.loadImages();
        this.loadSpriteSheets();
        this.loadAudio(); 
        this.loadTileMap();

        this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png');
    }

    loadImages()
    {
        //"this" refers to the scene, not the function
        this.load.image('button1', 'assets/images/ui/blue_button01.png');
        this.load.image('button2', 'assets/images/ui/blue_button02.png');
        this.load.image('background', 'assets/level/background_extruded.png');
    }

    loadSpriteSheets()
    {
        //defaults to first sprite in the spritesheet if not specified
        this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('heart', 'assets/images/heart.png', { frameWidth: 18, frameHeight: 18});
        this.load.spritesheet('characters', 'assets/images/player.png', { frameWidth: 50, frameHeight: 76});
        this.load.spritesheet('monster', 'assets/images/monsters.png', { frameWidth: 32, frameHeight: 32});
    }

    loadAudio()
    {
        //Pass an array of audio files, not all devices can play all sound types, so Phaser picks the best one for that device
        this.load.audio('goldSound', ['assets/audio/Pickup.wav']); 
        this.load.audio('enemyDeath', ['assets/audio/EnemyDeath.wav']); 
        this.load.audio('playerAttack', ['assets/audio/PlayerAttack.wav']); 
        this.load.audio('playerDamage', ['assets/audio/PlayerDamage.wav']); 
        this.load.audio('playerDeath', ['assets/audio/PlayerDeath.wav']); 

    }

    loadTileMap()
    {
        //Tiled map in JSON format
        this.load.tilemapTiledJSON('map', 'assets/level/forest.json');
        this.load.tilemapTiledJSON('overlay', 'assets/level/forest.json');
    }

    create()
    {
        this.scene.start('Title');
    }

}
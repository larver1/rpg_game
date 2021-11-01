var config = {
    type: Phaser.AUTO, //What rendering context? => WebGL if available, or canvas if not.
    width: 800,
    height: 600,
    //By default, Phaser makes the first scene active, and the rest inactive
    scene: [
        BootScene,
        TitleScene,
        GameScene,
        UiScene,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, //Shows hitboxes of objects and direction of sprites
            gravity: {
                y: 0, //Gravity only acts downwards
            },
        },
    },
    pixelArt: true, //Using pixel art
    roundPixels: false, //round pixels to integer so rendering isn't blurred
};

var game = new Phaser.Game(config);


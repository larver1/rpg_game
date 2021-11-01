class TitleScene extends Phaser.Scene 
{
    constructor()
    {
        super('Title');
    }

    create()
    {
        //Create title text, accesses scale manager which tells us the size of the game
        this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'MMORPG', { fontSize: '64px', fill: '#fff' });
        this.titleText.setOrigin(0.5);

        //Create play game button
        this.startGameButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.65, 'button1', 'button2', 'Start', this.startScene.bind(this, 'Game')); 

    }

    startScene(targetScene)
    {
        this.scene.start(targetScene, { map: 'map' });
    }

}
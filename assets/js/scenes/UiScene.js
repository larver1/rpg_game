class UiScene extends Phaser.Scene 
{
    constructor()
    {
        super('Ui');
    }

    init()
    {
        //Get reference to game scene
        this.gameScene = this.scene.get('Game');
    }

    create()
    {
        this.setupUiElements();
        this.setupEvents();
        this.gameScene.events.emit('uiDone');
    }

    update(time, delta)
    {
        if(this.hotbar)
        {
            this.hotbar.update(time, delta);
        }
    }


    setupUiElements()
    {
        //Create item hotbar
        this.hotbar = new UiHotbar(this, 31, 556, 8);

        //Create score and icon
        this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });
        this.coinIcon = this.add.image(15, 15, 'items', 3);

        //Create health and icon
        this.healthText = this.add.text(35, 48, 'Health: 10', { fontSize: '16px', fill: '#fff' });
        this.healthIcon = this.add.image(15, 56, 'heart', 0);

    }

    setupEvents()
    {
        //Listen for update score event from game scene
        this.gameScene.events.on('updateScore', (score) => {
            this.scoreText.setText(`Coins: ${score}`);
        });

        this.gameScene.events.on('updateHealth', (health) =>
        {
            this.healthText.setText(`Health: ${health}`);
        });

        this.gameScene.events.on('populateHotbar', (items, selectedItemIndex) =>
        {
            this.hotbar.populate(items, selectedItemIndex);
        });

        this.gameScene.events.on('changeHotbar', (items, selectedItemIndex) =>
        {
            this.hotbar.refresh(items, selectedItemIndex);
        });

        this.gameScene.events.on('newItem', (item) =>
        {
            this.hotbar.newItem(item);
        });

    }

}
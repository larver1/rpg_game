//Container can put game objects inside a container, and be children of the objects
//If you move the container, the children will move with the container.
class UiButton extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, key, hoverKey, text, targetCallback)
    {
        super(scene, x, y);
        this.scene = scene; //Scene it will be added to
        this.x = x; //X position of container
        this.y = y; //Y position of container
        this.key = key; //Background image of button
        this.hoverKey = hoverKey; //Image when player hovers over button
        this.text = text; //Text displayed on button
        this.targetCallback = targetCallback; //Function called when clicked the button
    
        this.createButton(); //create UI Button
        this.scene.add.existing(this); //Add container to scene
    }

    createButton()
    {
        //use image if no animation is needed, use sprite if animations are needed
        this.button = this.scene.add.image(0, 0, 'button1'); //This button will be placed at same position as container
        this.button.setInteractive();
        this.button.setScale(1.4);

        this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', fill: '#fff' });
        //Aligns the text position to the center of the button
        Phaser.Display.Align.In.Center(this.buttonText, this.button);

        //Add to container
        this.add(this.button);
        this.add(this.buttonText);

        //Listen for events

        //When you click it
        this.button.on('pointerdown', () => {
            this.targetCallback(); //Do the function that was passed in
        });

        //When you hover over
        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverKey);
        });

        //When you stop hovering over
        this.button.on('pointerout', () => {
            this.button.setTexture(this.key);
        });
    }

}


//Container can put game objects inside a container, and be children of the objects
//If you move the container, the children will move with the container.
class UiItemSlot extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, itemImage, spriteNo, maxCooldownTime, slotNum)
    {
        super(scene, x, y);
        this.scene = scene; //Scene it will be added to
        this.x = x; //X position of container
        this.y = y; //Y position of container
        this.itemImage = itemImage;
        this.spriteNo = spriteNo;
        this.cooldownTime = 0;
        this.maxCooldownTime = maxCooldownTime;
        this.slotNum = slotNum;
        this.gameScene = this.scene.scene.get('Game');
        this.slot;

        this.outlineColour = 0xffffff;
        this.outlineThickness = 1;

        this.createSlot(); //create UI Button
        this.scene.add.existing(this); //Add container to scene
    }

    createSlot(selectedItem)
    {
        //use image if no animation is needed, use sprite if animations are needed
        this.cooldown = this.scene.add.graphics();
        
        //Check if image was given, if not then show blank
        if(this.itemImage && this.spriteNo)
        {
            this.slot = this.scene.add.image(16, 16, this.itemImage, this.spriteNo); //This button will be placed at same position as container
        } 
        else 
        {
            this.slot = this.scene.add.image(16, 16);
            this.slot.texture === Phaser.Cache.DEFAULT;
        }

        this.updateCooldown(selectedItem);
        this.setupEvents();

        //Add to container
        this.box = this.add(this.cooldown);
        this.image = this.add(this.slot);

    }

    setupEvents()
    {
        this.gameScene.events.on(`resetCooldown-slot${this.slotNum}`, (cooldownAmount) =>
        {
            this.resetCooldown(cooldownAmount);
        });
    }

    updateCooldown(selectedItem)
    {
        this.cooldown.clear();
        this.cooldown.fillStyle(0xffffff, 0.8);
        this.cooldown.fillRect(0, 0, 32 * (this.cooldownTime / this.maxCooldownTime), 32);
        this.cooldown.fillStyle(0xffffff, 1);
        
        //Change outline based on if the item is selected or not
        if(selectedItem)
        {
            this.outlineColour = 0xff0000;
            this.outlineThickness = 2;
        } 
        
        this.cooldown.lineStyle(this.outlineThickness, this.outlineColour, 1);
        this.cooldown.strokeRect(0, 0, 32, 32);
    }

    resetCooldown(cooldownAmount)
    {
        this.maxCooldownTime = cooldownAmount;
        this.cooldownTime = cooldownAmount;
    }

    update(time, delta)
    {
        if(this.cooldownTime > 0) this.cooldownTime -= delta;

        if(this.cooldown)
        {
            this.updateCooldown();
        }
    }

}


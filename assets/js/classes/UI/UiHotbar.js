//Container can put game objects inside a container, and be children of the objects
//If you move the container, the children will move with the container.
class UiHotbar extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, numSlots)
    {
        super(scene, x, y);
        this.scene = scene; //Scene it will be added to
        this.x = x; //X position of container
        this.y = y; //Y position of container
        this.numSlots = numSlots;
        this.width = (numSlots * 38) + 5;
        this.height = 44;
        this.slotObjects = [];
        this.items = [];

        this.createHotbar(); //create UI Button
        this.scene.add.existing(this); //Add container to scene
    }

    createHotbar()
    {
        let currentX = 5;
        let slotID = 1;

        //Draw box which contains slots
        this.hotbarUI = this.scene.add.graphics();
        this.createHotbarUI();
        this.add(this.hotbarUI);

        //Add all hotbar slots to container
        for(let i = 0; i < this.numSlots; i++)
        {
            let slot = new UiItemSlot(this.scene, currentX, 6, null, null, 2000, slotID);
            this.slotObjects.push(slot); 
            this.add(slot);
            currentX += 38;
            slotID++;
        }
    }

    createHotbarUI()
    {
        this.hotbarUI.clear();
        this.hotbarUI.fillStyle(0x000000, 0.5);
        this.hotbarUI.fillRect(0, 0, this.width, this.height);
    }

    newItem(item)
    {
        this.slotObjects[item.slot - 1].slot.setTexture(item.itemImage, item.spriteNo);
    }
    
    populate(items, selectedItemIndex)
    {

        for(let i = 0; i < this.numSlots; i++)
        {
            if(!items[i]) break;

            let selectedItem = false;

            if(i == selectedItemIndex) selectedItem = true;

            this.slotObjects[i].itemImage = items[i].itemImage;
            this.slotObjects[i].spriteNo = items[i].spriteNo;

            this.slotObjects[i].createSlot(selectedItem);
        }

    }

    refresh(items, selectedItemIndex)
    {
        for(let i = 0; i < this.slotObjects.length; i++)
        {
            if(i == selectedItemIndex)
            {
                this.slotObjects[i].outlineColour = 0xff0000;
                this.slotObjects[i].outlineThickness = 2;
            } else
            {
                this.slotObjects[i].outlineColour = 0xffffff;
                this.slotObjects[i].outlineThickness = 1; 
            }
        }
    }

    update(time, delta)
    {
        for(const slot of this.slotObjects)
        {   
            slot.update(time, delta);
        }
    }

}


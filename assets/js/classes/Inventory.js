class Inventory
{
    constructor(scene, player, maxSize, items)
    {
        this.scene = scene;
        this.player = player;
        this.maxSize = maxSize;
        this.items = items;
        this.selectedItem = this.items[0];
        this.scene.add.existing(this.selectedItem);
    }

    update()
    {
        for(const item of this.items)
        {
            if(this.selectedItem != item && !item.active) item.changePos(this.player.x, this.player.y);
        }
    }

    addItem(item)
    {
        //Do not add an item if inventory is full
        if(this.items.length >= this.maxSize) return;

        //Add new item to hotbar and update it
        const itemLength = this.items.length + 1;
        item.slot = itemLength;
        this.items.push(item);
        this.scene.add.existing(item);
        this.scene.events.emit('newItem', item);
    }

    changeSelectedItem(value)
    {
        const oldIndex = this.items.indexOf(this.selectedItem);

        //Changing to item already selected is not valid
        if(oldIndex == (value - 1)) return;

        //Changing to slot with no item is also invalid
        if(!this.items[value - 1]) return;

        //Try scrolling forwards, if it is at the end of the hotbar then go back to 0
        if(oldIndex < this.items.length)
        {
            //Swap the displayed item
            this.selectedItem = this.items[value - 1];

            this.scene.resetCollisions();
            
            this.scene.events.emit('changeHotbar', this.items, this.items.indexOf(this.selectedItem));
        }
        
    }

    checkSelectedItem()
    {
        return this.selectedItem.getItemType();
    }

    checkHotbar(cursors)
    {
        //Check if hotbar is being changed
        if(Phaser.Input.Keyboard.JustDown(cursors.one))
        {
            this.changeSelectedItem(1);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.two))
        {
            this.changeSelectedItem(2);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.three))
        {
            this.changeSelectedItem(3);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.four))
        {
            this.changeSelectedItem(4);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.five))
        {
            this.changeSelectedItem(5);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.six))
        {
            this.changeSelectedItem(6);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.seven))
        {
            this.changeSelectedItem(7);
        } else if(Phaser.Input.Keyboard.JustDown(cursors.eight))
        {
            this.changeSelectedItem(8);
        }
    }


}
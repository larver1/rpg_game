class Chest extends Entity
{
    constructor(scene, x, y, key, frame, id, maxHealth, coins, player)
    {
        super(scene, x, y, key, frame, id, maxHealth, coins);
        this.scene = scene; //Scene the object will be added to
        this.coins = coins; //Amount of coins this chest contains
        this.id = id;
        this.player = player;

        //Enable physics to the image
        this.scene.physics.world.enable(this);
        this.setImmovable(true);

        //Add player to the existing scene
        this.scene.add.existing(this);
    }

    giveItem()
    {
        let item;
        console.log("adding item");
        if(this.player.inventory.items.length >= this.player.inventory.maxSize) return;

        if(Math.random() > 0.5)
            item = new Sword(this.scene, this.player.x, this.player.y, `weapon-${uuid.v4()}`, this.scene.player, null);
        else 
            item = new Knife(this.scene, this.player.x, this.player.y, `weapon-${uuid.v4()}`, this.scene.player, null);

        return item;
    }

}
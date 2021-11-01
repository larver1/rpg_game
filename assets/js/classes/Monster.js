class Monster extends Entity
{
    constructor(scene, x, y, key, frame, id, maxHealth, coins, player)
    {
        super(scene, x, y, key, frame, id, maxHealth, coins, player);

        //Enable physics to the image
        this.scene.physics.world.enable(this);
        this.setImmovable(false);
        this.setCollideWorldBounds(true);
        this.moveAI = true;
        this.visibleHealth = true;

        //Add monster to the existing scene
        this.scene.add.existing(this);

    }

}
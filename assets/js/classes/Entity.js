class Entity extends Phaser.Physics.Arcade.Image
{
    constructor(scene, x, y, key, frame, id, maxHealth, coins)
    {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.key = key;
        this.id = id;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.coins = coins;
        this.healthBar = new Healthbar(this.scene, this);
        this.visibleHealth = false;
    }

    update()
    {
        this.healthBar.updateHealthBar();
    }

    makeActive()
    {
        this.setActive(true);
        this.setVisible(true);
        this.healthBar.updateHealthBar();
        this.body.checkCollision.none = false;
    }

    makeInactive()
    {
        this.setActive(false);
        this.setVisible(false);
        this.healthBar.clear();
        this.body.checkCollision.none = true;
    }

    updateHealth(health)
    {
        this.health = health;
        this.healthBar.updateHealthBar();
    }

    respawn(entityObject)
    {
        this.health = entityObject.health;
        this.setPosition(entityObject.x, entityObject.y);
        this.healthBar.updateHealthBar();
    }

}
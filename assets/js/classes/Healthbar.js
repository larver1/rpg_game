class Healthbar
{
    constructor(scene, entity)
    {
        this.scene = scene;
        this.entity = entity;
        this.visible = false;

        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar()
    {
        this.healthBar.clear();
        if(!this.entity.visibleHealth) return;

        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.entity.x - 16, this.entity.y - (this.entity.height / 3), 32, 5);
        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healthBar.fillRect(this.entity.x - 16, this.entity.y - (this.entity.height / 3), 32 * (this.entity.health / this.entity.maxHealth), 5); 
    
        if(this.entity.isPlayer) this.scene.events.emit('updateHealth', this.entity.health);
    }

    clear()
    {
        this.healthBar.clear();
    }
}
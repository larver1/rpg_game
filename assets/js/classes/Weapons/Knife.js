class Knife extends Weapon 
{
    constructor(scene, x, y, id, player, slot)
    {
        super(scene, x, y, 'items', 4, id, player, slot);
        
        //Knife damage and cooldown
        this.damage = 1;
        this.cooldown = 250;
        this.castTime = 150;
        this.pauseTime = 150;

    }
}
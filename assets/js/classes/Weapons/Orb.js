class Orb extends Weapon 
{
    constructor(scene, x, y, id, player, slot)
    {
        super(scene, x, y, 'items', 6, id, player, slot);
        
        //Orb damage and cooldown
        this.damage = 5;
        this.cooldown = 2000;
        this.castTime = 1000;
        this.pauseTime = 200;
        this.velocity = 3;
        this.ranged = true;

    }

}
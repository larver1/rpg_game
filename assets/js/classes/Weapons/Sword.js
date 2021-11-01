class Sword extends Weapon 
{
    constructor(scene, x, y, id, player, slot)
    {
        super(scene, x, y, 'items', 5, id, player, slot);
        
        //Sword damage and cooldown
        this.damage = 2;
        this.cooldown = 2000;
        this.castTime = 600;
        this.pauseTime = 600;

    }

    rotate(angle)
    {
        this.angle += Math.floor(angle / 4);
    }


}
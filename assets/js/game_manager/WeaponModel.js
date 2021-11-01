class WeaponModel
{
    constructor(x, y, damage, cooldown)
    {
        this.id = `${spawnerId}-${uuid.v4()}`;
        this.x = x;
        this.y = y;
        this.key = 'items';
        this.damage = damage;
        this.cooldown = cooldown;
    }
}
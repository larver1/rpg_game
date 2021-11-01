class ChestModel
{
    constructor(x, y, gold, spawnerId)
    {
        this.id = `${spawnerId}-${uuid.v4()}`;
        this.x = x;
        this.y = y;
        this.gold = gold;
        this.spawnerId = spawnerId;
        this.key = 'items';
    }
}
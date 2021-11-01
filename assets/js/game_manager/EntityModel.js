class EntityModel
{
    constructor(x, y, gold, spawnerId, frame, health, attack, spawnLocations)
    {
        this.id = `${spawnerId}-${uuid.v4()}`;
        this.x = x;
        this.y = y;
        this.gold = gold;
        this.spawnerId = spawnerId;
        this.frame = frame;
        this.health = health;
        this.maxHealth = health;
        this.attack = attack;
        this.spawnLocations = spawnLocations;
    }

    updateHealth(health)
    {
        this.health += health;
        if(this.health > this.maxHealth) this.health = this.maxHealth;
    }

    updateGold(gold)
    {
        this.gold += gold;
    }

    throwErrorMsg(error)
    {
        console.los(`Entity Error ${this.id}\n ${error}`);
    }

    respawn()
    {
        if(!this.spawnLocations) return throwErrorMsg(`Entity doesn't have any SpawnLocations to respawn!`);
        this.health = this.maxHealth;
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        this.x = location[0];
        this.y = location[1];
    }
    
}
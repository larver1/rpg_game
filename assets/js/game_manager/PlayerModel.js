class PlayerModel
{
    constructor(spawnLocations)
    {
        this.health = 10;
        this.maxHealth = 10;
        this.gold = 0;
        this.id = `$player-${uuid.v4()}`;
        this.spawnLocations = spawnLocations;
        this.key = 'characters';

        this.weapon = 
        {
            damage: 5,
            cooldown: 10
        };
    
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        //Pull multiple values out of array and assign to variable
        [this.x, this.y] = location;
    
    }

    updateGold(gold)
    {
        this.gold += gold;
    }

    updateHealth(health)
    {
        this.health += health;
        if(this.health > 10) this.health = 10;
    }

    respawn()
    {
        this.health = this.maxHealth;
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        this.x = location[0];
        this.y = location[1];
    }
}
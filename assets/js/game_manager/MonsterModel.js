class MonsterModel
{
    constructor(x, y, gold, spawnerId, frame, health, attack)
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
        this.key = 'monster';
    }

    loseHealth(amount)
    {
        this.health -= amount;
    }

    move()
    {
        const randomPosition = randomNumber(1, 8);
        const distance = 32;

        switch(randomPosition)
        {
            case 1:
                this.x += distance;
                break;
            case 2:
                this.x -= distance;
                break;
            case 3:
                this.y += distance;
                break;
            case 4:
                this.y -= distance;
                break;
            case 5:
                this.x += distance;
                this.y += distance;
                break;
            case 6:
                this.x += distance;
                this.y -= distance;
                break;
            case 7:
                this.x -= distance;
                this.y += distance;
                break;
            case 8:
                this.x -= distance;
                this.y -= distance;
                break;
            default:
                break;
        }
    }
}
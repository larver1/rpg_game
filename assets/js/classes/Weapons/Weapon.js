class Weapon extends Phaser.Physics.Arcade.Image 
{
    constructor(scene, x, y, key, frame, id, player, slot)
    {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.id = id;
        this.active = false;

        //Default weapon cooldown, changes depending on weapon type
        this.damage = 0;
        this.cooldown = 100;
        this.castTime = 100;
        this.pauseTime = 0;
        this.velocity = 0;

        this.swordHit = false;
        this.ranged = false;
        this.player = player;
        this.weaponReady = true; //0 means that the cooldown is ready
        this.slot = slot;
        this.itemImage = key;
        this.spriteNo = frame;
        this.attackDirection = Direction.UP;

        //Create weapon game object
        this.setScale(0.75);
        this.scene.physics.world.enable(this);
        //Weapon is only visible when it is swinging
        this.alpha = 0;
    }

    getItemType()
    {
        return "weapon";
    }

    checkReady()
    {
        return this.weaponReady;
    }

    changePos(x, y)
    {
        this.setPosition(x, y);
    }

    rotate(angle)
    {
        this.angle += angle;
    }

    attack(direction)
    {
        this.active = true;

        //Temporary tree cutting logic
        let tileCollided = this.scene.map.getPosition(this.x, this.y, 'blocked');
        if(tileCollided)
        {
            tileCollided = tileCollided.index;
            if(tileCollided == 845 || tileCollided == 844 || tileCollided == 843 || tileCollided == 848) this.scene.map.removeTile(this.x, this.y);
            console.log(tileCollided);
        } 

        if(this.player.currentDirection === Direction.DOWN)
        {
            this.setAngle(-270);
            this.changePos(this.player.x, this.player.y + 20);
        } else if(this.player.currentDirection === Direction.UP)
        {
            this.setAngle(-90);
            this.changePos(this.player.x, this.player.y - 20);
        } else
        {
            this.setAngle(0);
        }

        if(this.player.currentDirection === Direction.LEFT)
        {
            this.changePos(this.player.x - 20, this.player.y);
            this.setAngle(-180)
        } else if(this.player.currentDirection === Direction.RIGHT)
        {
            this.changePos(this.player.x + 20, this.player.y);
            this.setAngle(0);
        }

        this.scene.events.emit(`resetCooldown-slot${this.slot}`, this.cooldown);
        this.alpha = 1;
        this.attackDirection = direction;
        this.player.inAnimation = true;

        this.scene.time.delayedCall(this.pauseTime, () => {
            this.player.inAnimation = false;
        }, [], this);

        this.scene.time.delayedCall(this.castTime, () => {
            if((!this.swordHit && this.ranged) || !this.ranged)
            {       
                this.finishAttack();
            }
        }, [], this);     

        //Wait the cooldown before setting weaponReady to true
        this.scene.time.delayedCall(this.cooldown, () =>
        {
            this.weaponReady = true; 
        }, [], this);

    }

    finishAttack()
    {
        this.alpha = 0;
        this.swordHit = false;
        this.weaponReady = false;
        this.player.playerAttacking = false;
        this.active = false; 

        let xOffset = 0;
        let yOffset = 0;
        switch(this.player.currentDirection)
        {
            case Direction.UP:
                yOffset = -20;
                break;
            case Direction.RIGHT:
                xOffset = 20;
                break;
            case Direction.DOWN:
                yOffset = 20;
                break;
            case Direction.LEFT:
                xOffset = -20;
                break;
            default:
                break;
        }

        this.changePos(this.player.x + xOffset, this.player.y + yOffset);
    }

    update()
    {
        if(this.flipX)
        {
            this.rotate(-10);
        } else
        {
            this.rotate(10);
        }

        switch(this.attackDirection)
        {
            case Direction.UP:
                this.y -= this.velocity;
                break;
            case Direction.DOWN:
                this.y += this.velocity;
                break;
            case Direction.LEFT:
                this.x -= this.velocity;
                break;
            case Direction.RIGHT:
                this.x += this.velocity;
                break;
            default:
                break;
        }

        if(!this.ranged) this.follow();
        
    }

    follow()
    {
        let xOffset = 0;
        let yOffset = 0;
        switch(this.player.currentDirection)
        {
            case Direction.UP:
                yOffset = -20;
                break;
            case Direction.RIGHT:
                xOffset = 20;
                break;
            case Direction.DOWN:
                yOffset = 20;
                break;
            case Direction.LEFT:
                xOffset = -20;
                break;
            default:
                break;
        }

        this.changePos(this.player.x + xOffset, this.player.y + yOffset);    
    }

    
}
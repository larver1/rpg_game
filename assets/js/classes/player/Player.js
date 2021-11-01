class Player extends Entity
{
    constructor(scene, x, y, key, frame, health, maxHealth, id, attackAudio)
    {
        //Don't need to pass in key or frame to super method of a container
        super(scene, x, y, key, frame, id, maxHealth, 0);
        this.scene = scene;
        this.velocity = 80; 
        this.currentDirection = Direction.RIGHT;
        this.playerAttacking = false;
        this.flipX = true;
        this.swordHit = false;
        this.health = health;
        this.maxHealth = maxHealth;
        this.id = id;
        this.attackAudio = attackAudio;
        this.inAnimation = false;
        this.isPlayer = true;

        //Enable physics to the image
        this.scene.physics.world.enable(this);
        this.setImmovable(true);
        this.setScale(0.5);

        //Add player to the existing scene
        this.scene.add.existing(this);

        //Enable physics to the image
        this.scene.physics.world.enable(this);

        this.body.setCollideWorldBounds(true);

        //Add player container to the existing scene
        this.scene.add.existing(this);

        //Camera follows the player
        this.scene.cameras.main.startFollow(this);

        //Create inventory to store items
        this.inventory = new Inventory(this.scene, this, 8, [new Orb(this.scene, this.x, this.y, `weapon-${uuid.v4()}`, this, 1)]);

        //Create player healthbar
        this.visibleHealth = true;
        this.healthBar = new Healthbar(this.scene, this);

        this.setupEventListeners();

    }

    setupEventListeners()
    {
        console.log(this.scene);
        this.scene.events.on('uiDone', () =>
        {
            //Populate hotbar
            this.scene.events.emit('populateHotbar', this.inventory.items, this.inventory.items.indexOf(this.inventory.selectedItem));
        });

    }

    updateHealth(health)
    {
        this.health = health;
        this.healthBar.updateHealthBar();
    }

    respawn(playerObject)
    {
        this.health = playerObject.health;
        this.setPosition(playerObject.x, playerObject.y);
        this.healthBar.updateHealthBar();
    }

    //Not called automatically, because it's not a scene object
    update(cursors)
    {
        //Sets both X and Y velocity to 0
        //Use this.body to reference arcade game object
        this.body.setVelocity(0);
        this.healthBar.updateHealthBar();
        this.inventory.update();

        this.checkAttack(cursors);
        this.inventory.items.map(i => i.active ? i.update() : null);

        //The player shouldn't be able to do anything else during an attack
        if(this.inAnimation) return;
        this.checkMove(cursors);
        this.inventory.checkHotbar(cursors);

        let tileCollided = this.scene.map.getPosition(this.x, this.y, 'background');
        console.log(tileCollided);
        
    }

    checkMove(cursors)
    {
        if(cursors.left.isDown)
        {
            this.body.setVelocityX(-this.velocity);
            this.currentDirection = Direction.LEFT;
            if(!this.inventory.selectedItem.active) this.inventory.selectedItem.changePos(this.x - 20, this.y);
            this.setFrame(3);
        } else if(cursors.right.isDown)
        {
            this.body.setVelocityX(this.velocity);
            this.currentDirection = Direction.RIGHT;
            if(!this.inventory.selectedItem.active) this.inventory.selectedItem.changePos(this.x + 20, this.y);
            this.setFrame(0);
        } 
        
        if(cursors.up.isDown)
        {
            this.body.setVelocityY(-this.velocity);
            this.currentDirection = Direction.UP;
            if(!this.inventory.selectedItem.active) this.inventory.selectedItem.changePos(this.x, this.y - 20);
            this.setFrame(2);
        } else if(cursors.down.isDown)
        {
            this.body.setVelocityY(this.velocity);
            this.currentDirection = Direction.DOWN;
            if(!this.inventory.selectedItem.active) this.inventory.selectedItem.changePos(this.x, this.y + 20);
            this.setFrame(1);
        }

    }

    checkAttack(cursors)
    {
        //When player starts attacking, make weapon visible
        //JustDown means if the key was pressed ONE time, not spammed
        if(Phaser.Input.Keyboard.JustDown(cursors.space) 
        && !this.inAnimation 
        && this.inventory.checkSelectedItem() == "weapon"
        && !this.inventory.selectedItem.active 
        && this.inventory.selectedItem.checkReady())
        {
            this.playerAttacking = true;
            this.attackAudio.play();
            //Call back after a certain amount of time
            this.inventory.selectedItem.attack(this.currentDirection);
        }


    }


}
class GameScene extends Phaser.Scene 
{
    constructor()
    {
        super('Game');
    }

    init(data)
    {
        //'Launch' means run another scene in parallel, 'Start' closes all existing scenes first.
        this.scene.launch('Ui');
        this.playerStats;
        this.player;
        this.mapName = data.map;
        this.map;
        this.overlayMap;
    }

    create()
    {
        this.createMap();
        this.createAudio();
        this.createGroups();
        this.createGameManager();
        this.createInput();
        //this.map.createRemainingLayers();
        this.cameraFadeIn();   
        this.createOverlayMap();     
    }

    update()
    {
        //Need to make sure player is created before we run update method
        if(this.player) this.player.update(this.cursors);
    }

    createMap()
    {
        this.map = new Map(this, this.mapName, 'background', 'background', 'blocked', false);
    }

    createOverlayMap()
    {
        this.overlayMap = new Map(this, 'overlay', 'background', 'background', 'blocked', true);
        console.log(this.overlayMap);
    }

    createAudio()
    {
        //Create audio object
        this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.3 });
        this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.2 });
        this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 });
        this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 });
        this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 });
    }

    createPlayer(playerObject)
    {
        this.player = new Player(
            this, 
            playerObject.x, 
            playerObject.y, 
            'characters', 
            0,
            playerObject.health,
            playerObject.maxHealth,
            playerObject.id,
            this.playerAttackAudio
        );

        this.entities.add(this.player);
        this.player.body.setCollideWorldBounds(true);
    }

    createGroups()
    {
        //Create chest group
        this.chests = this.physics.add.group();
        this.monsters = this.physics.add.group();
        this.entities = this.physics.add.group();

        //Phaser groups can allow all children update methods to run
        this.monsters.runChildUpdate = true;

    }

    spawnEntity(entity)
    {  

        //If entity being respawned is the player
        if(entity.key == "characters")
        {
            this.playerDeathAudio.play();
            this.player.respawn(entity);
            return;
        }

        //Loop through group and find the first inactive entity of that type, or return null
        let entityType = this.physics.add.group();

        this.entities.children.each(function(obj) {
            if(obj.key == entity.key)
            {
                entityType.add(obj);
            }
        }, this);

        let foundEntity = entityType.getFirstDead();

        //Arguments needed to pass into the entity
        let args = [
            this,
            entity.x,
            entity.y,
            entity.key,
            entity.frame,
            entity.id,
            entity.maxHealth,
            0,
            this.player
        ];

        //Create the entity based on the key
        if(!foundEntity)
        {
            switch(entity.key)
            {
                case 'monster':
                    foundEntity = new Monster(...args);
                    this.monsters.add(foundEntity);
                    break;
                case 'items':
                    foundEntity = new Chest(...args);
                    this.chests.add(foundEntity);
                    break;
                default:
                    break;
            }

            this.entities.add(foundEntity);
            foundEntity.setCollideWorldBounds(true);
        } else
        {
            foundEntity.id = entity.id;
            foundEntity.health = entity.maxHealth;
            foundEntity.maxHealth = entity.maxHealth;

            //setTexture() is used to replace the texture of an object
            foundEntity.setTexture(entity.key, entity.frame);
            foundEntity.setPosition(entity.x, entity.y);
            foundEntity.makeActive();
        }
    }

    createInput()
    {
        //Keyboard manager
        this.cursors = this.input.keyboard.addKeys({ 
            'one': Phaser.Input.Keyboard.KeyCodes.ONE,
            'two': Phaser.Input.Keyboard.KeyCodes.TWO,
            'three': Phaser.Input.Keyboard.KeyCodes.THREE,
            'four': Phaser.Input.Keyboard.KeyCodes.FOUR,
            'five': Phaser.Input.Keyboard.KeyCodes.FIVE,
            'six': Phaser.Input.Keyboard.KeyCodes.SIX,
            'seven': Phaser.Input.Keyboard.KeyCodes.SEVEN,
            'eight': Phaser.Input.Keyboard.KeyCodes.EIGHT,
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE

        });

    }

    addCollisions()
    {
        this.physics.add.collider(this.player, this.map.blockedLayer);
        //You can check for overlaps with a group of objects, not just single objects
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
        this.physics.add.collider(this.monsters, this.map.blockedLayer);
        
        //Call overlap method when player overlaps with a monster
        this.physics.add.overlap(this.player.inventory.selectedItem, this.monsters, this.enemyOverlap, null, this);
    }

    resetCollisions()
    {
        this.physics.add.overlap(this.player.inventory.selectedItem, this.monsters, this.enemyOverlap, null, this);
    }

    enemyOverlap(weapon, enemy)
    {
        if(this.player.playerAttacking 
        && this.player.inventory.checkSelectedItem() == "weapon" 
        && !this.player.inventory.selectedItem.swordHit
        && this.player.inventory.selectedItem.active)
        {
            this.player.inventory.selectedItem.swordHit = true;
            this.events.emit('monsterAttacked', enemy.id, this.player.id, this.player.inventory.selectedItem.damage);
            if(this.player.inventory.selectedItem.ranged) this.player.inventory.selectedItem.finishAttack();
        }
    }

    collectChest(player, chest)
    {
        this.goldPickupAudio.play(); 

        //Spawn new chest after some time
        this.events.emit('pickUpChest', chest.id, player.id, chest.giveItem());
    }

    changeMap()
    {
        this.map2 = new Map(this, 'map', 'background', 'background', 'blocked');
        this.map = this.map2;
        this.children.bringToTop(this.entities);
        this.addCollisions();
    }

    createGameManager()
    {
        this.events.on('spawnPlayer', (playerObject) => {
            this.createPlayer(playerObject);
            this.addCollisions();
        });

        this.events.on('givePlayerItem', (contents) => {
            this.player.inventory.addItem(contents);
        });

        this.events.on('entitySpawned', (entity) => 
        {
            this.spawnEntity(entity);
        });

        this.events.on('entityRemoved', (entityId) => {
            this.entities.getChildren().forEach((entity =>
            {
                if(entity.id === entityId)
                {
                    entity.makeInactive();
                    if(entity.key == "monster")
                    {
                        this.monsterDeathAudio.play();
                    }
                }
            }));
        });

        this.events.on('updateEntityHealth', (entityId, health) => {
            this.entities.getChildren().forEach((entity =>
            {
                if(entity.id === entityId)
                {
                    entity.updateHealth(health);
                    if(entity.key == "characters" && health < entity.health) this.playerDamageAudio.play();
                }
            }));
        });

        //currently only monsters move
        this.events.on('entityMovement', (entities) => {
            this.entities.getChildren().forEach((entity =>
            {
                Object.keys(entities).forEach((entityId) =>
                {
                    //If the entity has move AI
                    if(entity.id === entityId && entity.moveAI)
                    {
                        this.physics.moveToObject(entity, entities[entityId], 40);
                    }
                });
            }));
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();

    }

    resetGameManager()
    {
        this.gameManager.destroy();
        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }

    cameraFadeIn()
    {

        this.cameras.main.zoomTo(2, 3000, 'Sine.easeInOut');
        this.cameras.main.fadeIn(3000);

    }

}
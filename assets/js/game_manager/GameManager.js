class GameManager
{
    constructor(scene, mapData)
    {
        this.scene = scene;
        this.mapData = mapData;

        //Keep track of spawners and chests
        this.spawners = {};
        this.chests = {};
        this.monsters = {};
        this.players = {};
        this.entities = {};

        //Locations of objects
        this.playerLocations = [];
        this.chestLocations = {};
        this.monsterLocations = {};
    }

    setup()
    {
        this.parseMapData();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
    }

    parseMapData()
    {
        this.mapData.forEach((layer) =>
        {
            if(layer.name === 'player_locations')
            {
                layer.objects.forEach((obj) =>
                {
                    this.playerLocations.push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
                });
            }
            else if(layer.name === 'chest_locations')
            {
                layer.objects.forEach((obj) =>
                {
                    var spawner = getTiledProperty(obj, 'spawner');
                    //Check if spawner ID exists, and use it
                    if(this.chestLocations[spawner])
                    {
                        this.chestLocations[spawner].push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
                    } else
                    {
                        //Otherwise, create a new array containing the first set of XY values
                        this.chestLocations[spawner] = [[obj.x + (obj.width / 2), obj.y - (obj.height / 2)]];
                    }
                });
            } else if(layer.name === 'monster_locations')
            {
                layer.objects.forEach((obj) =>
                {
                    var spawner = getTiledProperty(obj, 'spawner');
                    //Check if spawner ID exists, and use it
                    if(this.monsterLocations[spawner])
                    {
                        this.monsterLocations[spawner].push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
                    } else
                    {
                        //Otherwise, create a new array containing the first set of XY values
                        this.monsterLocations[spawner] = [[obj.x + (obj.width / 2), obj.y - (obj.height / 2)]];
                    }
                });
            }
        });

    }

    setupEventListener()
    {
        this.scene.events.on('pickUpChest', (chestId, playerId, contents) => {
            //Does chest still exist
            if(this.entities[chestId])
            {
                //Shorthand to get gold from the chest
                const { gold } = this.entities[chestId];

                //Update player gold
                this.entities[playerId].updateGold(gold);
                this.scene.events.emit('updateScore', this.entities[playerId].gold);
                
                //Get chest spawner ID to get reference to spawner object and remove it
                this.spawners[this.entities[chestId].spawnerId].removeObject(chestId);
                this.scene.events.emit('entityRemoved', chestId);

                //Give item to player
                if(contents)
                {
                    this.scene.events.emit('givePlayerItem', contents);
                }

            }
        });

        this.scene.events.on('monsterAttacked', (monsterId, playerId, damage) => {
            //Does monster still exist
            if(this.entities[monsterId])
            {
                const { gold, attack } = this.entities[monsterId];
                //Lose monster health. If dead, remove object
                this.entities[monsterId].loseHealth(damage);
                if(this.entities[monsterId].health <= 0)
                {

                    //Update player gold
                    this.entities[playerId].updateGold(gold);
                    this.scene.events.emit('updateScore', this.entities[playerId].gold);

                    //Get monster spawner ID to get reference to spawner object and remove it
                    this.spawners[this.entities[monsterId].spawnerId].removeObject(monsterId);
                    this.scene.events.emit('entityRemoved', monsterId);
                
                    //Add bonus health to player
                    this.entities[playerId].updateHealth(2);
                    this.scene.events.emit('updateEntityHealth', playerId, this.entities[playerId].health);
                } else
                {
                    //Update player health and monster health
                    this.scene.events.emit('updateEntityHealth', playerId, this.entities[playerId].health);
                    this.entities[playerId].updateHealth(-attack);
                    this.scene.events.emit('updateEntityHealth', monsterId, this.entities[monsterId].health);

                    //Check player health, if below 0 then respawn
                    if(this.entities[playerId].health <= 0)
                    {
                        //Take away half gold
                        this.entities[playerId].updateGold(parseInt(-this.entities[playerId].gold / 2), 10);
                        this.scene.events.emit('updateScore', this.entities[playerId].gold);

                        //Respawn player
                        this.entities[playerId].respawn();
                        this.scene.events.emit('entitySpawned', this.entities[playerId]);

                    }
                }

            }
        });
    }

    setupSpawners()
    {
        const config = {
            spawnInterval: 3000,
            limit: 3,
            spawnerType: SpawnerType.CHEST,
            id: '',
            canMove: false
        };
        let spawner;

        //Create chest spawners
        Object.keys(this.chestLocations).forEach((key) =>
        {
            config.id = `items-${key}`;

            spawner = new Spawner(
                config,
                this.chestLocations[key], 
                this.addEntity.bind(this), 
                this.deleteEntity.bind(this)
            );
            this.spawners[spawner.id] = spawner;
        });

        //Create monster spawners
        Object.keys(this.monsterLocations).forEach((key) =>
        {
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;
            config.canMove = true;

            spawner = new Spawner(
                config,
                this.monsterLocations[key], 
                this.addEntity.bind(this), 
                this.deleteEntity.bind(this),
                this.moveEntities.bind(this),
            );
            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer()
    {
        //Tell gamescene to spawn the player at certain location
        const player = new PlayerModel(this.playerLocations);
        this.players[player.id] = player;
        this.entities[player.id] = player;
        this.scene.events.emit('spawnPlayer', player);
    }

    deleteEntity(entityId)
    {
        delete this.entities[entityId];
    }

    addEntity(entityId, entity)
    {
        this.entities[entityId] = entity;
        this.scene.events.emit('entitySpawned', entity);
    }

    moveEntities()
    {
        this.scene.events.emit('entityMovement', this.entities);
    }

}
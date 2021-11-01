class Spawner
{
    constructor(config, spawnLocations, addObject, deleteObject, moveObjects)
    {
        this.id = config.id;
        this.canMove = config.canMove;
        this.spawnInterval = config.spawnInterval; //Create new objects when we're below limit
        this.limit = config.limit; //Max number of objects at one time
        this.objectType = config.spawnerType; //Use spawner for any object type
        this.spawnLocations = spawnLocations;

        //Communicate between gamemanager and spawner
        //When we delete from gamemanager, delete from spawner, and vice versa
        this.addObject = addObject; 
        this.deleteObject = deleteObject;
        this.moveObjects = moveObjects;

        this.objectsCreated = [];
        this.start();
    }

    start()
    {
        //Create an object at every X if the num objects is below the limit
        this.interval = setInterval(() =>
        {
            if(this.objectsCreated.length < this.limit)
            {
                this.spawnObject();
            }
        }, this.spawnInterval);

        if(this.canMove)
        {
            this.moveEntities();
        }
    }

    spawnObject()
    {
        const location = this.pickRandomLocation();
        let config = [];
        let entity;

        //SpawnerType is an object in the utils.js file, means we can reference type of spawner easily
        switch(this.objectType)
        {
            case SpawnerType.CHEST:
                config = [location[0], location[1], randomNumber(10, 20), this.id];
                entity = new ChestModel(...config);   
                break;
            case SpawnerType.MONSTER:
                config = [location[0], location[1], randomNumber(10, 20), this.id, randomNumber(0, 20), randomNumber(3, 5), 1]
                entity = new MonsterModel(...config); 
                break;
            default:
                break;
        }

        this.objectsCreated.push(entity);
        this.addObject(entity.id, entity);
    }

    pickRandomLocation()
    {
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        //Some method runs function on each element of an array until it finds a true value
        const invalidLocation = this.objectsCreated.some((obj) =>
        {
            if(obj.x === location[0] && obj.y === location[1])
            {
                return true;
            }

            return false;
        });

        if(invalidLocation) return this.pickRandomLocation();
        return location;
    }

    removeObject(id)
    {
        //Returns array that does not contain the object we wish to delete
        this.objectsCreated = this.objectsCreated.filter(obj => obj.id !== id);
    }

    moveEntities()
    {
        this.moveMonsterInterval = setInterval(() =>
        {
            this.objectsCreated.forEach((entity) =>
            {
                entity.move();
            });

            this.moveObjects();

        }, 1000);
    }

}
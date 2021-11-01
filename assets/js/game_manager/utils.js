const SpawnerType = 
{
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
};

const Direction = 
{
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    UP: 'UP',
    DOWN: 'DOWN',
};

function randomNumber(min, max)
{
    return Math.floor(Math.random() * max) + min;
}

function getTiledProperty(obj, property_name) {
    for (var property_index = 0; property_index < obj.properties.length; property_index += 1) {
        var property = obj.properties[property_index];
        if (property.name == property_name) {
            return property.value;
        }
    }
}

/*
function createEntity(key, args)
{
    switch(key)
    {
        case 'monster':
            return new Monster(...args);
        case 'items':
            return new Chest(...args);
    }
}
*/
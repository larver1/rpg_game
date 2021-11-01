class Map
{
    constructor(scene, key, tileSetName, bgLayerName, blockedLayerName, overlay)
    {   
        this.scene = scene; //Scene map belongs to
        this.key = key; //Tiled JSON file key name
        this.tileSetName = tileSetName; //Tiled tileset image key name
        this.bgLayerName = bgLayerName; //Name of layer created in tiled for map bg
        this.blockedLayerName = blockedLayerName; //Name of layer created in tiled for blocked areas
        this.overlay = overlay;
        this.createMap();
    }

    createMap()
    {
        //Create tile map
        this.map = this.scene.make.tilemap({
             key: this.key,
             tileWidth: 32,
             tileHeight: 32
        });
        //Add tileset image to  map
        this.tiles = this.map.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2); //Name of layer, key of tileset image, frame width, frame height, margin, spacing

        if(this.overlay == true) 
        {
            this.createRemainingLayers();
            return;
        } 

        console.log("running this");

        //Create background
        this.backgroundLayer = this.map.createLayer(this.bgLayerName, this.tiles); //Name of layer in file, tiles loaded, starting x position, starting y position

        //Create blocked layer
        this.blockedLayer = this.map.createLayer(this.blockedLayerName, this.tiles);
        this.backgroundLayer2 = this.map.createLayer('background2', this.tiles); 

        this.blockedLayer.cullPaddingX = 10
        this.blockedLayer.cullPaddingY = 10

        this.backgroundLayer2.cullPaddingX = 10
        this.backgroundLayer2.cullPaddingY = 10

        this.blockedLayer.setCollisionByExclusion([-1]); //We want to check all tiles for collision, we are excluding none

        //Update world bounds
        this.scene.physics.world.bounds.width = this.map.widthInPixels;
        this.scene.physics.world.bounds.height = this.map.heightInPixels;
    
        //Limit camera to size of map
        this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels); //0, 0 is starting position of bounding box, height and width of bounding box is half camera width and height

    

   }

    createRemainingLayers()
    {
        this.backgroundLayer3 = this.map.createLayer('background3', this.tiles); 
        this.backgroundLayer3.cullPaddingX = 10
        this.backgroundLayer3.cullPaddingY = 10 
    }

    removeTile(x, y)
    {
        this.map.removeTileAtWorldXY(x, y);
    }

    getPosition(xPos, yPos, layerType)
    {
        return this.map.getTileAtWorldXY(xPos, yPos, true, this.scene.cameras.main, layerType);
    }
}  
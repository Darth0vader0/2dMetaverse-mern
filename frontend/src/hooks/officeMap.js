// OfficeMapScene.js
import Phaser from 'phaser';

export default class OfficeMapScene extends Phaser.Scene {
  constructor() {
    super('OfficeMapScene');
  }

  preload() {
    // Make sure these paths are correct and assets are in the public folder
    this.load.image('tiles', '/assets/background/final_map.png');
    this.load.tilemapTiledJSON('officeMap', '/assets/tiledMap/office_map.json');
    this.load.spritesheet('avatar', '/avatars/male1.jpg', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    // Load the tilemap
    const map = this.make.tilemap({ key: 'officeMap' });

    // Add the background image layer (as in your Tiled map)
    this.add.image(0, 0, 'tiles').setOrigin(0);

    // If you want to use the tile layer (currently empty in your map), uncomment below:
    // const tileset = map.addTilesetImage('final_map', 'tiles');
    // map.createLayer('Tile Layer 1', tileset);

    // TODO: Add player, collisions, and other game logic here
  }

  update() {
    // TODO: Add player movement and update logic here
  }
}
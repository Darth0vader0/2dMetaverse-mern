import Phaser from 'phaser';

export default class OfficeMapScene extends Phaser.Scene {
  constructor() {
    super('OfficeMapScene');
  }

  preload() {
    this.load.image('tiles', '/assets/background/final_map.png');
    this.load.tilemapTiledJSON('officeMap', '/assets/tiledMap/office_map.json');
    this.load.spritesheet('avatar', '/avatars/animation_frames/female1.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    // Load map and background
    const map = this.make.tilemap({ key: 'officeMap' });
    this.add.image(1, -3, 'tiles').setOrigin(0);

    // Setup physics groups
    this.walls = this.physics.add.staticGroup();
    this.chairs = this.physics.add.staticGroup();
    this.tables = this.physics.add.staticGroup();

    // Place player just after the entry door
    let spawnX = 100, spawnY = 100;
    const doorLayer = map.getObjectLayer('doors');
    if (doorLayer && doorLayer.objects.length > 0) {
      const entryDoor = doorLayer.objects.find(obj => obj.name === 'door_entry' || obj.type === 'door');
      if (entryDoor) {
        spawnX = entryDoor.x + (entryDoor.width || 0) / 2;
        spawnY = entryDoor.y + (entryDoor.height || 0) + 10;
      }
    }

    // Player: small, about the size of a chair
    this.player = this.physics.add.sprite(spawnX, spawnY, 'avatar', 0);
    this.player.setScale(0.5);
    
this.player.body.setSize(24, 32); 
    this.player.body.setOffset(20, 24); // Adjust offset to center the sprite better
    this.player.setCollideWorldBounds(true);
   this.anims.create({
  key: 'walk-down',
  frames: this.anims.generateFrameNumbers('avatar', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1
});

this.anims.create({
  key: 'walk-left',
  frames: this.anims.generateFrameNumbers('avatar', { start: 4, end: 7 }),
  frameRate: 10,
  repeat: -1
});

this.anims.create({
  key: 'walk-right',
  frames: this.anims.generateFrameNumbers('avatar', { start: 8, end: 11 }),
  frameRate: 10,
  repeat: -1
});

this.anims.create({
  key: 'walk-up',
  frames: this.anims.generateFrameNumbers('avatar', { start: 12, end: 15 }),
  frameRate: 10,
  repeat: -1
});

    // Camera and world bounds
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // Zoom in and scroll only on edge
    this.cameras.main.setZoom(1.6); // zoom in
    this.cameras.main.setDeadzone(200, 150); // player can move freely in center zone

    // Add colliders for walls, chairs, and tables
    this.addCollidersFromLayer(map, 'walls', this.walls);
    this.addCollidersFromLayer(map, 'chairs', this.chairs);
    this.addCollidersFromLayer(map, 'tables', this.tables);

    // Collide player with all groups
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.chairs);
    this.physics.add.collider(this.player, this.tables);

    // Movement input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollidersFromLayer(map, layerName, group) {
  const layer = map.getObjectLayer(layerName);
  if (!layer) return;

  layer.objects.forEach(obj => {
    // Only add if isCollidable property is true
    let isCollidable = false;
    if (obj.properties) {
      const prop = obj.properties.find(p => p.name === 'isCollidable');
      if (prop && prop.value === true) isCollidable = true;
    }

    if (isCollidable) {
      const x = obj.x + (obj.width || 0) / 2;
      const y = obj.y + (obj.height || 0) / 2;
      const width = obj.width || 1;
      const height = obj.height || 1;

      const debugRect = this.add.rectangle(x, y, width, height)
        .setOrigin(0.5)

      this.physics.add.existing(debugRect, true); // true = static body
      group.add(debugRect);
    }
  });
}


 update() {
  const speed = 80;
  const player = this.player;
  const cursors = this.cursors;

  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
    player.anims.play('walk-left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.anims.play('walk-right', true);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-speed);
    player.anims.play('walk-up', true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
    player.anims.play('walk-down', true);
  } else {
    player.anims.stop();
  }
}
}
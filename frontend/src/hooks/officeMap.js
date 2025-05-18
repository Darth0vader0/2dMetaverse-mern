import Phaser from 'phaser';

export default class OfficeMapScene extends Phaser.Scene {
  constructor() {
    super('OfficeMapScene');
  }

  preload() {
    this.load.image('tiles', '/assets/background/final_map.png');
    this.load.tilemapTiledJSON('officeMap', '/assets/tiledMap/officeMapFinal.json');
    this.load.spritesheet('avatar', '/avatars/animation_frames/female1.png', { frameWidth: 64, frameHeight: 64 });

    this.load.image('female1Back', '/avatars/sitting/female1Back.png');
    this.load.image('female1Top', '/avatars/sitting/female1Top1.png');
  }

  create() {
    const map = this.make.tilemap({ key: 'officeMap' });
    this.add.image(1, -3, 'tiles').setOrigin(0);

    this.walls = this.physics.add.staticGroup();
    this.chairs = this.physics.add.staticGroup();
    this.tables = this.physics.add.staticGroup();

    let spawnX = 100, spawnY = 100;
    const doorLayer = map.getObjectLayer('doors');
    if (doorLayer && doorLayer.objects.length > 0) {
      const entryDoor = doorLayer.objects.find(obj => obj.name === 'door_entry' || obj.type === 'door');
      if (entryDoor) {
        spawnX = entryDoor.x + (entryDoor.width || 0) / 2;
        spawnY = entryDoor.y + (entryDoor.height || 0) + 10;
      }
    }

    this.player = this.physics.add.sprite(spawnX, spawnY, 'avatar', 0);
    this.player.setScale(0.5);
    this.player.body.setSize(24, 32);
    this.player.body.setOffset(20, 24);
    this.player.setCollideWorldBounds(true);

    this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('avatar', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('avatar', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('avatar', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('avatar', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.6);
    this.cameras.main.setDeadzone(200, 150);

    this.addCollidersFromLayer(map, 'walls', this.walls);
    this.addCollidersFromLayer(map, 'chairs', this.chairs, true);
    this.addCollidersFromLayer(map, 'tables', this.tables);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.chairs);
    this.physics.add.collider(this.player, this.tables);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyE = this.input.keyboard.addKey('E');
    this.keyQ = this.input.keyboard.addKey('Q');

    this.sitPrompt = this.add.text(0, 0, 'Press E to Sit', {
      font: '16px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 2 }
    }).setScrollFactor(0).setVisible(false);

    this.isSitting = false;
    this.sittingSprite = null;
    this.currentChair = null;
  }

  addCollidersFromLayer(map, layerName, group, isChair = false) {
    const layer = map.getObjectLayer(layerName);
    if (!layer) return;

    layer.objects.forEach(obj => {
      const isCollidable = obj.properties?.some(p => p.name === 'isCollidable' && p.value);
      if (!isCollidable) return;

      const x = obj.x + obj.width / 2;
      const y = obj.y + obj.height / 2;

      const rect = this.add.rectangle(x, y, obj.width, obj.height).setOrigin(0.5).setVisible(false);
      this.physics.add.existing(rect, true);
      group.add(rect);

      if (isChair) {
        rect.occupied = false;
        const dirProp = obj.properties.find(p => p.name === 'direction');
        rect.direction = dirProp?.value || 'north';
      }
    });
  }

  update() {
    const speed = 80;

    if (this.isSitting) {
      if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
        if (this.sittingSprite) this.sittingSprite.destroy();
        this.player.setVisible(true);
        if (this.currentChair) this.currentChair.occupied = false;
        this.isSitting = false;
        this.currentChair = null;
      }
      return;
    }

    let nearbyChair = null;
    this.chairs.getChildren().forEach(chair => {
      if (!chair.occupied && Phaser.Math.Distance.Between(this.player.x, this.player.y, chair.x, chair.y) < 32) {
        nearbyChair = chair;
      }
    });

    if (nearbyChair) {
      this.sitPrompt.setPosition(this.player.x - 40, this.player.y - 40).setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.player.setVisible(false);

      // ...existing code...
let spriteKey = 'female1Back';
let angle = 0;
let offsetY = -13;
let offsetX = 0;
let displayWidth = 22;
let displayHeight = 24;

switch (nearbyChair.direction) {
  case 'north':
    spriteKey = 'female1Back';
    angle = 0;
    offsetY = -13;
    displayWidth = 22;
    displayHeight = 24;
    break;
  case 'south':
    spriteKey = 'female1Top';
    angle = 0;
    offsetY = -1;
    displayWidth = 18; // smaller
    displayHeight = 20; // smaller
    break;
  case 'east':
    spriteKey = 'female1Top';
    angle = -90;
    offsetY = 0;
    offsetX = -2;
    displayWidth = 18; // smaller
    displayHeight = 20; // smaller
    break;
  case 'west':
    spriteKey = 'female1Top';
    angle = 90;
    offsetY = 0;
    offsetX = 1;
    displayWidth = 18; // smaller
    displayHeight = 20; // smaller
    break;
  default:
    spriteKey = 'female1Back';
    angle = 0;
    offsetY = -13;
    displayWidth = 22;
    displayHeight = 24;
}

this.sittingSprite = this.add.image(
  nearbyChair.x + offsetX,
  nearbyChair.y + offsetY,
  spriteKey
)
  .setDepth(10)
  .setDisplaySize(displayWidth, displayHeight)
  .setAngle(angle);
// ...existing code...
        nearbyChair.occupied = true;
        this.isSitting = true;
        this.currentChair = nearbyChair;
        this.sitPrompt.setVisible(false);
      }
    } else {
      this.sitPrompt.setVisible(false);
    }

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk-left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk-right', true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play('walk-up', true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play('walk-down', true);
    } else {
      this.player.anims.stop();
    }
  }
}
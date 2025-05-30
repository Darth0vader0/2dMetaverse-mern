import Phaser from 'phaser';

export default class OfficeMapScene extends Phaser.Scene {
  static name = null;
  constructor() {
    super('OfficeMapScene');
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    const avatar = JSON.parse(localStorage.getItem('avatar'));
    // Local player avatar
    this.load.spritesheet('avatar', `/avatars/animation_frames/${avatar.name}.png`, { frameWidth: 64, frameHeight: 64 });
    // Bob for remote players
    this.load.spritesheet('alice', `/avatars/animation_frames/alice.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bob', `/avatars/animation_frames/bob.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('natasha', `/avatars/animation_frames/natasha.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('tom', `/avatars/animation_frames/tom.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('david', `/avatars/animation_frames/david.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('nisha', `/avatars/animation_frames/nisha.png`, { frameWidth: 64, frameHeight: 64 });

    this.load.image('tiles', '/assets/background/final_map.png');
    this.load.tilemapTiledJSON('officeMap', '/assets/tiledMap/officeMapFinal.json');
    this.load.image('female1Back', `/avatars/sitting/${avatar.name}Back.png`);
    this.load.image('female1Top', `/avatars/sitting/${avatar.name}Top.png`);
  }

  create() {
    const socket = this.socket;
    if (!socket) {
      console.error('Socket not initialized in OfficeMapScene');
    }
    const user = JSON.parse(localStorage.getItem('user'));
const avatar = JSON.parse(localStorage.getItem('avatar'));
const roomId = localStorage.getItem('roomId');

if (user && avatar && roomId && socket) {
  socket.emit('joinRoom', {
    username: user.username,
    nickname: user.nickname,
    avatar: avatar.name,
    roomId
  });
} else {
  console.error('Missing user, avatar, roomId, or socket for joinRoom');
}

    // --- Map and world setup ---
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

    // --- Local player setup ---
    this.player = this.physics.add.sprite(spawnX, spawnY, 'avatar', 0);
    this.player.setScale(0.5);
    this.player.body.setSize(24, 32);
    this.player.body.setOffset(20, 24);
    this.player.setCollideWorldBounds(true);

    // Local player animations
    this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('avatar', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('avatar', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('avatar', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('avatar', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    // alice animations for remote players
    this.anims.create({ key: 'alice-walk-down', frames: this.anims.generateFrameNumbers('alice', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alice-walk-left', frames: this.anims.generateFrameNumbers('alice', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alice-walk-right', frames: this.anims.generateFrameNumbers('alice', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alice-walk-up', frames: this.anims.generateFrameNumbers('alice', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: 'bob-walk-down', frames: this.anims.generateFrameNumbers('bob', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'bob-walk-left', frames: this.anims.generateFrameNumbers('bob', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'bob-walk-right', frames: this.anims.generateFrameNumbers('bob', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'bob-walk-up', frames: this.anims.generateFrameNumbers('bob', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: 'tom-walk-down', frames: this.anims.generateFrameNumbers('tom', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'tom-walk-left', frames: this.anims.generateFrameNumbers('tom', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'tom-walk-right', frames: this.anims.generateFrameNumbers('tom', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'tom-walk-up', frames: this.anims.generateFrameNumbers('tom', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: 'natasha-walk-down', frames: this.anims.generateFrameNumbers('natasha', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'natasha-walk-left', frames: this.anims.generateFrameNumbers('natasha', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'natasha-walk-right', frames: this.anims.generateFrameNumbers('natasha', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'natasha-walk-up', frames: this.anims.generateFrameNumbers('natasha', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: 'nisha-walk-down', frames: this.anims.generateFrameNumbers('nisha', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nisha-walk-left', frames: this.anims.generateFrameNumbers('nisha', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nisha-walk-right', frames: this.anims.generateFrameNumbers('nisha', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nisha-walk-up', frames: this.anims.generateFrameNumbers('nisha', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    this.anims.create({ key: 'david-walk-down', frames: this.anims.generateFrameNumbers('david', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'david-walk-left', frames: this.anims.generateFrameNumbers('david', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'david-walk-right', frames: this.anims.generateFrameNumbers('david', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'david-walk-up', frames: this.anims.generateFrameNumbers('david', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

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
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.sitPrompt = this.add.text(0, 0, 'Press E to Sit', {
      font: '16px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 2 }
    }).setScrollFactor(0).setVisible(false);

    this.isSitting = false;
    this.sittingSprite = null;
    this.currentChair = null;

    // --- Remote players setup ---
    this.remotePlayers = {};

    // Listen for current players
   socket.on('currentPlayers', (players) => {
      players.forEach(player => {
        
        this.addRemotePlayer(player);
      });

     console.log('Current players in room:', players);
    });

    // Listen for new player
    socket.on('newPlayer', (player) => {
      console.log(player)
      this.addRemotePlayer(player);
    });

    // Listen for player movement
    socket.on('playerMoved', ({ id, x, y, direction, animKey,avatar }) => {
      const remote = this.remotePlayers[id];
      if (remote) {
        remote.sprite.setPosition(x, y);
        if (animKey) remote.sprite.anims.play(`${avatar}-` + animKey, true);
      }
    });

    // Listen for player disconnect
      // Listen for player leaving the room
  socket.on('playerLeft', (nicknameOrId) => {
    // If your backend emits nickname, you may need to map nickname to id.
    // But it's best to emit the id from backend for consistency.
    // If you emit id:
    const id = nicknameOrId;
    if (this.remotePlayers[id]) {
      this.remotePlayers[id].sprite.destroy();
      delete this.remotePlayers[id];
    }
  });
  }

  addRemotePlayer(player) {
    if (this.remotePlayers[player.id]) return;
    
    const sprite = this.physics.add.sprite(player.x, player.y, player.avatar, 0)
      .setScale(0.5)
      .setDepth(5);
    if (player.animKey) sprite.anims.play(`${player.avatar}-`+ player.animKey, true);
    this.remotePlayers[player.id] = { sprite, info: player };
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
    const speed = 100;
    let moved = false;
    let direction = '';
    let animKey = '';
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
            displayWidth = 18;
            displayHeight = 20;
            break;
          case 'east':
            spriteKey = 'female1Top';
            angle = -90;
            offsetY = 0;
            offsetX = -2;
            displayWidth = 18;
            displayHeight = 20;
            break;
          case 'west':
            spriteKey = 'female1Top';
            angle = 90;
            offsetY = 0;
            offsetX = 1;
            displayWidth = 18;
            displayHeight = 20;
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

        nearbyChair.occupied = true;
        this.isSitting = true;
        this.currentChair = nearbyChair;
        this.sitPrompt.setVisible(false);
      }
    } else {
      this.sitPrompt.setVisible(false);
    }

    this.player.setVelocity(0);
    if (this.cursors.left.isDown || this.aKey.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk-left', true);
      moved = true;
      direction = 'left';
      animKey = 'walk-left';
    } else if (this.cursors.right.isDown || this.dKey.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk-right', true);
      moved = true;
      direction = 'right';
      animKey = 'walk-right';
    } else if (this.cursors.up.isDown || this.wKey.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play('walk-up', true);
      moved = true;
      direction = 'up';
      animKey = 'walk-up';
    } else if (this.cursors.down.isDown || this.sKey.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play('walk-down', true);
      moved = true;
      direction = 'down';
      animKey = 'walk-down';
    } else {
      this.player.anims.stop();
    }
    // Emit movement only if moved
    if (moved && this.socket) {
      this.socket.emit('playerMovement', {
        x: this.player.x,
        y: this.player.y,
        direction,
        animKey,
      });
    }
  }
}
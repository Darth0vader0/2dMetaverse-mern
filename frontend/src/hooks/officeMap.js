import Phaser from 'phaser';

export default class OfficeMapScene extends Phaser.Scene {
  static name = null;
  constructor() {
    super('OfficeMapScene');
  }

  init(data) {
    this.socket = data.socket;
    this.showArrow = data.showArrow ?? true;
    this.assignedChairId = data.assignedChairId;
  }

  preload() {
    const avatar = JSON.parse(localStorage.getItem('avatar'));
    // Local player avatar
    this.load.spritesheet('avatar', `/avatars/animation_frames/${avatar.name}.png`, { frameWidth: 64, frameHeight: 64 });

    // animation frames for remote players
    this.load.spritesheet('alice', `/avatars/animation_frames/alice.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bob', `/avatars/animation_frames/bob.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('natasha', `/avatars/animation_frames/natasha.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('tom', `/avatars/animation_frames/tom.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('david', `/avatars/animation_frames/david.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('nisha', `/avatars/animation_frames/nisha.png`, { frameWidth: 64, frameHeight: 64 });

    // background image of map
    this.load.image('tiles', '/assets/background/final_map.png');
    this.load.tilemapTiledJSON('officeMap', '/assets/tiledMap/officeMapFinal.json');
    // sitting of character default right now for every player but gender wise
    this.load.image('female1Back', `/avatars/sitting/aliceSitting.png`);
    this.load.image('male1Back', `/avatars/sitting/davidSitting.png`);

    // south , east ,west png for every player just named as female1Top
    this.load.image('female1Top', `/avatars/sitting/${avatar.name}Top.png`);

    // remote players top view
    this.load.image('aliceTop', `/avatars/sitting/aliceTop.png`)
    this.load.image('bobTop', `/avatars/sitting/bobTop.png`)
    this.load.image('davidTop', `/avatars/sitting/davidTop.png`)
    this.load.image('tomTop', `/avatars/sitting/tomTop.png`)
    this.load.image('nishaTop', `/avatars/sitting/nishaTop.png`)
    this.load.image('natashaTop', `/avatars/sitting/natashaTop.png`)

    // Arrow image for navigation
    this.load.image('arrow', '/arrows/arrow.png');
  }

  create() {
    const socket = this.socket;
    if (!socket) {
      console.error('Socket not initialized in OfficeMapScene');
    }
    // user's data from local storage 
    const user = JSON.parse(localStorage.getItem('user'));
    // avatar's data from local storage 
    const avatar = JSON.parse(localStorage.getItem('avatar'));
    // room id from local storage 
    const roomId = localStorage.getItem('roomId');

    // socket connection 
    if (user && avatar && roomId && socket &&user.gender) {
      socket.emit('joinRoom', {
        username: user.username,
        nickname: user.nickname,
        avatar: avatar.name,
        gender : user.gender,
        roomId
      });
    } else {
      console.error('Missing user, avatar, roomId, or socket for joinRoom');
    }

    // --- Map and world setup ---
    const map = this.make.tilemap({ key: 'officeMap' });
    this.map = map; // Save map reference for later use
    this.add.image(1, -3, 'tiles').setOrigin(0);

    this.walls = this.physics.add.staticGroup();
    this.chairs = this.physics.add.staticGroup();
    this.tables = this.physics.add.staticGroup();

    let spawnX = 100, spawnY = 100;
    // layers for collision
    const doorLayer = map.getObjectLayer('doors');
this.exitArea = null;
if (doorLayer && doorLayer.objects.length > 0) {
  this.exitArea = doorLayer.objects.find(obj =>
    obj.properties?.some(p => p.name === 'type' && p.value === 'exitArea')
  );
}
this.showExitPopup = false;
this.exitPopupDismissed = false;

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



    // Find the assigned chair object from the "chairs" layer
    const chairsLayer = map.getObjectLayer('chairs');
    this.assignedChairObj = null;
    if (chairsLayer && this.assignedChairId) {
      this.assignedChairObj = chairsLayer.objects.find(obj => {
        const chairIdProp = obj.properties?.find(p => p.name === 'chairId');
        return chairIdProp && chairIdProp.value === this.assignedChairId;
      });
    }
    this.data.set('showArrow', this.showArrow);
    // Create the arrow after the player is created
    if (this.assignedChairObj) {
      this.arrow = this.add.image(this.player.x, this.player.y, 'arrow').setDepth(20).setScale(0.5);
    }

    // Local player animations
    this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('avatar', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('avatar', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('avatar', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('avatar', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    // ...remote player animations (unchanged)...
    // alice animations for remote players whoes avatar is alice
    this.anims.create({ key: 'alice-walk-down', frames: this.anims.generateFrameNumbers('alice', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alice-walk-left', frames: this.anims.generateFrameNumbers('alice', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alice-walk-right', frames: this.anims.generateFrameNumbers('alice', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'alice-walk-up', frames: this.anims.generateFrameNumbers('alice', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    // bob animations
    this.anims.create({ key: 'bob-walk-down', frames: this.anims.generateFrameNumbers('bob', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'bob-walk-left', frames: this.anims.generateFrameNumbers('bob', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'bob-walk-right', frames: this.anims.generateFrameNumbers('bob', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'bob-walk-up', frames: this.anims.generateFrameNumbers('bob', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    //tom animations
    this.anims.create({ key: 'tom-walk-down', frames: this.anims.generateFrameNumbers('tom', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'tom-walk-left', frames: this.anims.generateFrameNumbers('tom', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'tom-walk-right', frames: this.anims.generateFrameNumbers('tom', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'tom-walk-up', frames: this.anims.generateFrameNumbers('tom', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    //natasha animation 
    this.anims.create({ key: 'natasha-walk-down', frames: this.anims.generateFrameNumbers('natasha', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'natasha-walk-left', frames: this.anims.generateFrameNumbers('natasha', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'natasha-walk-right', frames: this.anims.generateFrameNumbers('natasha', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'natasha-walk-up', frames: this.anims.generateFrameNumbers('natasha', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    // nisha animation
    this.anims.create({ key: 'nisha-walk-down', frames: this.anims.generateFrameNumbers('nisha', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nisha-walk-left', frames: this.anims.generateFrameNumbers('nisha', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nisha-walk-right', frames: this.anims.generateFrameNumbers('nisha', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nisha-walk-up', frames: this.anims.generateFrameNumbers('nisha', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    //david animation
    this.anims.create({ key: 'david-walk-down', frames: this.anims.generateFrameNumbers('david', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'david-walk-left', frames: this.anims.generateFrameNumbers('david', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'david-walk-right', frames: this.anims.generateFrameNumbers('david', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'david-walk-up', frames: this.anims.generateFrameNumbers('david', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });

    // camera angle
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.6);
    this.cameras.main.setDeadzone(200, 150);

    // walls, chairs and tables collisions
    this.addCollidersFromLayer(map, 'walls', this.walls);
    this.addCollidersFromLayer(map, 'chairs', this.chairs, true);
    this.addCollidersFromLayer(map, 'tables', this.tables);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.chairs);
    this.physics.add.collider(this.player, this.tables);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.keyE = this.input.keyboard.addKey('E');
    this.keyQ = this.input.keyboard.addKey('Q');
    // motion from WASD control
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // sit text
    this.sitPrompt = this.add.text(250, 150, 'Press E to Sit', {
      font: '16px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 2 }
    }).setScrollFactor(0).setVisible(false);

    this.isSitting = false;
    this.sittingSprite = null;
    this.currentChair = null;

    // --- Socket events and remote player logic (unchanged) ---
    this.remotePlayers = {};

    socket.on('currentPlayers', (players) => {
      players.forEach(player => {
        console.log(player)
        this.addRemotePlayer(player);
        // If the player is sitting, make them sit visually
        if (player.isSitting && player.chairDirection) {
          // Simulate the playerSitting event for this remote player
          const remote = this.remotePlayers[player.id];
          if (remote && !remote.isSitting) {
            const chair = this.findClosestChair(remote.sprite.x, remote.sprite.y);
            if (!chair) return;
            const avatarName = remote.info.avatar;
            let spriteKey = 'female1Back'; // fallback
            if (player.chairDirection === 'north') {
              spriteKey = (player.gender === 'male' ? 'male1Back' : 'female1Back');
            } else {
              spriteKey = avatarName + 'Top';
            }
            let offsetY = -13, offsetX = 0, angle = 0, width = 22, height = 24;
            switch (player.chairDirection) {
              case 'north': offsetY = -6; width = 42; height = 45; break;
              case 'south': offsetY = -1; width = 18; height = 20; break;
              case 'east': angle = -90; offsetX = -2; break;
              case 'west': angle = 90; offsetX = 1; break;
            }
            const sittingSprite = this.add.image(
              chair.x + offsetX,
              chair.y + offsetY,
              spriteKey
            ).setDepth(10).setDisplaySize(width, height).setAngle(angle);
            remote.sittingSprite = sittingSprite;
            remote.sprite.setVisible(false);
            remote.isSitting = true;
          }
        }
      });
      console.log('Current players in room:', players);
    });

    socket.on('newPlayer', (player) => {
      console.log(player)
      this.addRemotePlayer(player);
    });

    socket.on('playerMoved', ({ id, x, y, animKey, avatar }) => {
      const remote = this.remotePlayers[id];
      if (remote) {
        remote.sprite.setPosition(x, y);
        remote.info.x=remote.sprite.x;
        remote.info.y= remote.sprite.y;
        if (animKey) remote.sprite.anims.play(`${avatar}-` + animKey, true);
      }
    });

    socket.on('playerStopped', ({ id }) => {
      const remote = this.remotePlayers[id];
      if (remote) {
        remote.sprite.anims.stop();
      }
    });

    socket.on('playerSitting', ({ id, direction }) => {
      const remote = this.remotePlayers[id];
   
      if (remote && !remote.isSitting) {
        const chair = this.findClosestChair(remote.sprite.x, remote.sprite.y);
        if (!chair) return;
        const avatarName = remote.info.avatar;
        let spriteKey = 'female1Back'; // fallback
        if (direction === 'north') {
          if (user.gender == 'male') {
            spriteKey = 'male1Back'
          } else {
            spriteKey = "female1Back";
          }
        } else {
          spriteKey = avatarName + 'Top';
        }
        let offsetY = -13, offsetX = 0, angle = 0, width = 22, height = 24;
        switch (direction) {
          case 'north': offsetY = -6; width = 42; height = 45; break;
          case 'south': offsetY = -1; width = 18; height = 20; break;
          case 'east': angle = -90; offsetX = -2; break;
          case 'west': angle = 90; offsetX = 1; break;
        }
        const sittingSprite = this.add.image(
          chair.x + offsetX,
          chair.y + offsetY,
          spriteKey
        ).setDepth(10).setDisplaySize(width, height).setAngle(angle);
        remote.sittingSprite = sittingSprite;
        remote.sprite.setVisible(false);
        remote.info.isSitting = true;
        remote.info.x=remote.sprite.x;
        remote.info.y= remote.sprite.y;
        console.log(remote)

      }
    });

socket.on('playerStanding', ({ id }) => {
  const remote = this.remotePlayers[id];
  if (remote && remote.info.isSitting) {
    if (remote.sittingSprite) remote.sittingSprite.destroy();
    remote.sprite.setVisible(true);
    remote.info.isSitting = false;
  }
});

    socket.on('playerLeft', (nicknameOrId) => {
      const id = nicknameOrId;
      if (this.remotePlayers[id]) {
        this.remotePlayers[id].sprite.destroy();
        if (this.remotePlayers[id].nicknameText) {
          this.remotePlayers[id].nicknameText.destroy();
        }
        delete this.remotePlayers[id];
      }
    });
  }

  findClosestChair(x, y) {
    let closest = null;
    let minDist = 100; // max chair distance threshold
    this.chairs.getChildren().forEach(chair => {
      const dist = Phaser.Math.Distance.Between(x, y, chair.x, chair.y);
      if (dist < minDist && !chair.occupied) {
        closest = chair;
        minDist = dist;
      }
    });
    return closest;
  }

  addRemotePlayer(player) {
    if (this.remotePlayers[player.id]) return;
    const sprite = this.physics.add.sprite(player.x, player.y, player.avatar, 0)
      .setScale(0.5)
      .setDepth(5);
    if (player.animKey) sprite.anims.play(`${player.avatar}-` + player.animKey, true);

    // Add nickname text above the remote player's head
    const nicknameText = this.add.text(
      player.x,
      player.y - 10, // 10 pixels above the sprite
      player.nickname || player.username || "Player",
      {
        font: '14px Arial',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        align: 'center'
      }
    ).setOrigin(0.5, 1).setDepth(30);

    this.remotePlayers[player.id] = { sprite, info: player, nicknameText };
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
        // Set chairId for sitting logic
        const chairIdProp = obj.properties.find(p => p.name === 'chairId');
        rect.chairId = chairIdProp?.value || null;
      }
    });
  }



  update() {
    const speed = 100;
    let moved = false;
    let direction = '';
    let animKey = '';

    const activeElement = document.activeElement;
  const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
  if (isTyping) {
    // Optionally, stop player animation here too
    this.player.setVelocity(0);
    this.player.anims.stop();
    return;
  }
    Object.values(this.remotePlayers).forEach(remote => {
      if (remote.nicknameText && remote.sprite) {
        remote.nicknameText.x = remote.sprite.x;
        remote.nicknameText.y = remote.sprite.y - 10;
      }
    });


    if (this.isSitting) {
      if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
        if (this.sittingSprite) this.sittingSprite.destroy();
        this.player.setVisible(true);
        if (this.currentChair) this.currentChair.occupied = false;
        this.isSitting = false;
        this.socket.emit('playerStanding');
        this.currentChair = null;
      }
      return; // <--- Only return after updating remote nicknames!
    }

    let nearbyChair = null;
    this.chairs.getChildren().forEach(chair => {
      // Only consider the assigned chair
      const assignedChairId = this.data.get('assignedChairId') || this.assignedChairId;
      if (
        !chair.occupied &&
        Phaser.Math.Distance.Between(this.player.x, this.player.y, chair.x, chair.y) < 32 &&
        chair.chairId === assignedChairId // <-- Only allow sitting on assigned chair
      ) {
        nearbyChair = chair;
      }
    });


    // --- Arrow navigation logic ---
    const showArrow = this.data.get('showArrow');
    const assignedChairId = this.data.get('assignedChairId') || this.assignedChairId;

    // Dynamically create the arrow and assignedChairObj if needed
    if ((!this.arrow || !this.assignedChairObj) && assignedChairId && this.chairs) {
      // Find the assigned chair object from the "chairs" layer
      // Save map reference in create(): this.map = map;
      const chairsLayer = this.map?.getObjectLayer?.('chairs');
      if (chairsLayer) {
        this.assignedChairObj = chairsLayer.objects.find(obj => {
          const chairIdProp = obj.properties?.find(p => p.name === 'chairId');
          return chairIdProp && chairIdProp.value === assignedChairId;
        });
        if (this.assignedChairObj && !this.arrow) {
          this.arrow = this.add.image(this.player.x, this.player.y, 'arrow').setDepth(20).setScale(0.5);
        }
      }
    }

    if (this.arrow && this.assignedChairObj) {
      // Use center of chair object if width/height exist
      const chairX = this.assignedChairObj.x + (this.assignedChairObj.width || 0) / 2;
      const chairY = this.assignedChairObj.y + (this.assignedChairObj.height || 0) / 2;
      this.arrow.x = this.player.x;
      this.arrow.y = this.player.y - 30;
      const dx = chairX - this.player.x;
      const dy = chairY - this.player.y;
      this.arrow.rotation = Math.atan2(dy, dx);
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, chairX, chairY);
      this.arrow.setVisible(showArrow && dist > 40); // Hide arrow if close
    }



if (this.exitArea && this.player) {
  const playerRect = new Phaser.Geom.Rectangle(
    this.player.x - this.player.width / 2,
    this.player.y - this.player.height / 2,
    this.player.width,
    this.player.height
  );
  const exitRect = new Phaser.Geom.Rectangle(
    this.exitArea.x-20,
    this.exitArea.y-20,
    this.exitArea.width,
    this.exitArea.height
  );
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, exitRect)) {
    if (!this.showExitPopup && !this.exitPopupDismissed) {
      this.showExitPopup = true;
         window.setShowExitModal(true);
    }
  } else {
    // Reset dismissal when player leaves the area
    this.exitPopupDismissed = false;
    this.showExitPopup = false;
     
  }
}
    // --- Sitting logic ---
    if (nearbyChair) {
      this.sitPrompt.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.player.setVisible(false);
        let spriteKey = 'female1Back';
        const user = JSON.parse(localStorage.getItem('user'));
        let angle = 0;
        let offsetY = -13;
        let offsetX = 0;
        let displayWidth = 22;
        let displayHeight = 24;
        switch (nearbyChair.direction) {
          case 'north':
            spriteKey = user.gender + "1Back";
            angle = 0;
            offsetY = -6;
            displayWidth = 42;
            displayHeight = 45;
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
        this.socket.emit('playerSitting', { direction: nearbyChair.direction });
        this.currentChair = nearbyChair;
        this.sitPrompt.setVisible(false);
      }
    } else {
      this.sitPrompt.setVisible(false);
    }

    // --- Movement logic ---
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
      this.socket.emit('playerIsStop');
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
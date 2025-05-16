// PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import OfficeMapScene from '../../hooks/officeMap';

export default function PhaserGame() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,  // your map/game width
        height: 600, // your map/game height
        physics: {
          default: 'arcade',
          arcade: { debug: false }
        },
        scene: [OfficeMapScene],
        parent: 'phaser-container',  // the div ID where Phaser canvas mounts
      });
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="phaser-container" />;
}

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import BatmanScene from "./scenes/BatmanScene";

export default function BatmanGame({ onComplete }) {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (phaserGameRef.current) {
      return;
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 900 },
          debug: false,
        },
      },
      scene: BatmanScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    const finalizarFase = () => {
      onCompleteRef.current();
    };

    phaserGameRef.current.events.on("batman-complete", finalizarFase);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.events.off("batman-complete", finalizarFase);
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div className="game-container" ref={gameRef}></div>;
}
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import ChuckyScene from "./scenes/ChuckyScene";

export default function ChuckyGame({ onComplete }) {
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
      width: 1600,
      height: 720,
      parent: gameRef.current,
      backgroundColor: "#080613",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 920 },
          debug: false,
        },
      },
      scene: ChuckyScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    const finalizarFase = () => {
      onCompleteRef.current();
    };

    phaserGameRef.current.events.on("chucky-complete", finalizarFase);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.events.off("chucky-complete", finalizarFase);
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div className="game-container" ref={gameRef}></div>;
}

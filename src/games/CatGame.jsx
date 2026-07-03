import { useEffect, useRef } from "react";
import Phaser from "phaser";
import CatScene from "./scenes/CatScene";

export default function CatGame({ onComplete }) {
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
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: CatScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    const finalizarFase = () => {
      onCompleteRef.current();
    };

    phaserGameRef.current.events.on("cat-complete", finalizarFase);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.events.off("cat-complete", finalizarFase);
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div className="game-container" ref={gameRef}></div>;
}

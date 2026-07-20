import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import ChuckyScene from "./scenes/ChuckyScene";

export default function ChuckyGame({ onComplete }) {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const [memory, setMemory] = useState(null);

  const closeMemory = useCallback(() => {
    setMemory((current) => {
      current?.close?.();
      return null;
    });
  }, []);

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
    phaserGameRef.current.events.on("chucky-memory-open", setMemory);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.events.off("chucky-complete", finalizarFase);
        phaserGameRef.current.events.off("chucky-memory-open", setMemory);
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!memory) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        closeMemory();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMemory, memory]);

  return (
    <div className="chucky-game-shell">
      <div className="game-container" ref={gameRef}></div>
      {memory && (
        <div className="chucky-memory-overlay" role="dialog" aria-modal="true">
          <div className="chucky-memory-card">
            <figure className="chucky-memory-photo-frame">
              <img src={memory.photoUrl} alt={memory.title} />
            </figure>
            <div className="chucky-memory-copy">
              <p className="chucky-memory-kicker">Lembranca encontrada</p>
              <h2>{memory.title}</h2>
              <p>{memory.text}</p>
              <button type="button" onClick={closeMemory} autoFocus>
                Continuar
              </button>
              <small>Clique ou pressione Enter</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

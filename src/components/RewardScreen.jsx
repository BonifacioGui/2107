import { useEffect, useRef, useState } from "react";

const requestedSongPath = "/assets/audio/batman-theme-8bit.mp3";

const rewardMoments = [
  {
    title: "Serotonina no topo",
    image: "/assets/rewards/photos/congresso-criminal.jpg",
    caption: "Ela estudando o que ama, ocupando espaco e virando coragem em caminho.",
  },
  {
    title: "TCC",
    image: "/assets/rewards/photos/tcc-2.jpg",
    caption: "Mesmo com frio na barriga, ela senta, respira e entrega.",
  },
  {
    title: "Foco de guerreira",
    image: "/assets/rewards/photos/tcc-1.jpg",
    caption: "Aquela concentracao silenciosa de quem esta construindo futuro.",
  },
  {
    title: "Na faculdade",
    image: "/assets/rewards/photos/nafaculdade.jpg",
    caption: "O olhar atento de quem segue aprendendo mesmo nos dias dificeis.",
  },
  {
    title: "Lindona",
    image: "/assets/rewards/photos/livialinda.jpg",
    caption: "Ela bonita desse jeito que parece facil, mas e so ela sendo ela.",
  },
  {
    title: "Brilho",
    image: "/assets/rewards/photos/lindona.jpg",
    caption: "Uma lembranca simples, direta e inevitavel: ela e luz.",
  },
];

export default function RewardScreen({ onNext }) {
  const [collected, setCollected] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicLabel, setMusicLabel] = useState("Tocar tema 8-bit");
  const audioRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMoment(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      stopMusic();
    };
  }, []);

  function stopMusic() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setMusicPlaying(false);
    setMusicLabel("Tocar tema 8-bit");
  }

  async function toggleMusic() {
    if (musicPlaying) {
      stopMusic();
      return;
    }

    setMusicPlaying(true);

    try {
      const audio = audioRef.current;

      if (!audio) {
        throw new Error("audio-player-not-ready");
      }

      await audio.play();
      setMusicLabel("Tema 8-bit tocando");
    } catch {
      setMusicPlaying(false);
      setMusicLabel("Tentar tocar novamente");
    }
  }

  return (
    <section className="reward-screen">
      <audio ref={audioRef} src={requestedSongPath} loop preload="auto" />
      <div className="reward-panel">
        <span className="screen-label">Pacote Livia desbloqueado</span>

        <h1>{collected ? "As muitas formas de brilhar" : "Colete sua recompensa"}</h1>

        {!collected && (
          <p>
            Depois de enfrentar o medo, vem a parte boa: abrir lembrancas que
            mostram por que ela nunca desiste, mesmo quando a fase fica dificil.
          </p>
        )}

        {collected && (
          <>
            <div className="reward-actions">
              <button className="secondary-button" type="button" onClick={toggleMusic}>
                {musicPlaying ? "Pausar trilha" : musicLabel}
              </button>
            </div>

            <div className="photo-wall" aria-label="Mural de fotos e lembrancas">
              {rewardMoments.map((moment) => (
                <article className="photo-card" key={moment.title}>
                  <button
                    className="photo-open-button"
                    type="button"
                    onClick={() => setSelectedMoment(moment)}
                    aria-label={`Expandir foto: ${moment.title}`}
                  >
                    <div className="photo-placeholder">
                      <img src={moment.image} alt={moment.title} />
                    </div>
                  </button>
                  <h2>{moment.title}</h2>
                  <p>{moment.caption}</p>
                </article>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => {
            if (collected) {
              onNext();
              return;
            }

            setCollected(true);
          }}
          className="primary-button"
        >
          {collected ? "Continuar" : "Coletar recompensa"}
        </button>
      </div>

      {selectedMoment && (
        <div
          className="photo-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedMoment.title}
          onClick={() => setSelectedMoment(null)}
        >
          <figure className="photo-modal-content" onClick={(event) => event.stopPropagation()}>
            <button
              className="photo-modal-close"
              type="button"
              onClick={() => setSelectedMoment(null)}
              aria-label="Fechar foto"
            >
              X
            </button>
            <img src={selectedMoment.image} alt={selectedMoment.title} />
            <figcaption>
              <strong>{selectedMoment.title}</strong>
              <span>{selectedMoment.caption}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

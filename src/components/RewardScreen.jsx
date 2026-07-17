import { useEffect, useRef, useState } from "react";

const requestedSongPath = "/assets/audio/somos-so-nos-dois.mp3";

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
    title: "Percy",
    image: "/assets/rewards/photos/percy-real.jpg",
    caption: "Todo heroi tambem precisa de coberta, colo e um olhar muito serio.",
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
  const [musicLabel, setMusicLabel] = useState("Tocar trilha");
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const gainRef = useRef(null);
  const musicTimerRef = useRef(null);

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

  function playTone(frequency, start, duration, type = "sine", volume = 0.035) {
    const context = audioContextRef.current;
    const master = gainRef.current;

    if (!context || !master) {
      return;
    }

    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + 0.06);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function playGeneratedLoop() {
    const context = audioContextRef.current;

    if (!context) {
      return;
    }

    const start = context.currentTime + 0.04;
    const melody = [220, 277.18, 329.63, 369.99, 329.63, 277.18, 246.94];

    melody.forEach((note, index) => {
      playTone(note, start + index * 0.42, 0.34, "triangle", 0.025);
    });

    [110, 164.81, 146.83, 123.47].forEach((note, index) => {
      playTone(note, start + index * 0.84, 0.64, "sine", 0.018);
    });
  }

  function startGeneratedMusic() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      setMusicPlaying(false);
      setMusicLabel("Trilha indisponivel");
      return;
    }

    const context = new AudioContext();
    const gain = context.createGain();

    gain.gain.value = 0.085;
    gain.connect(context.destination);
    audioContextRef.current = context;
    gainRef.current = gain;

    playGeneratedLoop();
    musicTimerRef.current = window.setInterval(playGeneratedLoop, 3600);
    setMusicLabel("Trilha suave tocando");
  }

  function stopMusic() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (musicTimerRef.current) {
      window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }

    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setMusicPlaying(false);
    setMusicLabel("Tocar trilha");
  }

  async function toggleMusic() {
    if (musicPlaying) {
      stopMusic();
      return;
    }

    setMusicPlaying(true);

    try {
      const response = await fetch(requestedSongPath, { method: "HEAD" });

      if (!response.ok) {
        throw new Error("audio-not-found");
      }

      const audio = new Audio(requestedSongPath);
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;
      await audio.play();
      setMusicLabel("Musica tocando");
    } catch {
      startGeneratedMusic();
    }
  }

  return (
    <section className="reward-screen">
      <div className="reward-panel">
        <span className="screen-label">Recompensa desbloqueada</span>

        <h1>{collected ? "Um mural nosso" : "Colete sua recompensa"}</h1>

        {!collected && (
          <p>
            Depois de enfrentar o medo em Gotham, vem a parte boa: abrir as
            lembrancas que mostram por que ela nunca desiste, mesmo quando a
            fase fica dificil.
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

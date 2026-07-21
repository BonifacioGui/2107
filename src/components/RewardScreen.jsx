import { useEffect, useRef, useState } from "react";

const requestedSongPath = "/assets/audio/ela-une-todas-as-coisas.mp3";

const rewardMoments = [
  {
    title: "Serotonina no topo",
    image: "/assets/rewards/photos/congresso-criminal.jpg",
    caption: "Eu sei o quanto você gosta desse tema e o quanto isso foi importante pra você!",
  },
  {
    title: "TCC",
    image: "/assets/rewards/photos/tcc-2.jpg",
    caption: "Você foi lá para coroar toda a sua dedicação e esforço durante esses 5 anos de graduação. Você foi incrível, como eu tinha certeza que seria. Eu te amo.",
  },
  {
    title: "Foco de guerreira",
    image: "/assets/rewards/photos/tcc-1.jpg",
    caption: "HUMILHANDO TURO E TOROS!",
  },
  {
    title: "Na faculdade",
    image: "/assets/rewards/photos/nafaculdade.jpg",
    caption: "A milior do mundo estudando!",
  },
  {
    title: "Lindona",
    image: "/assets/rewards/photos/livialinda.jpg",
    caption: "LINDA PERFEITA GOSTOSA ABSURDA",
  },
  {
    title: "Brilho",
    image: "/assets/rewards/photos/lindona.jpg",
    caption: "LINDA COMO SEMPRE! .",
  },
  {
    title: "Rock, terror e Palmeiras",
    image: "/assets/rewards/photos/livia-pink-floyd.jpg",
    caption: "Tu é rockeira em pernambuco po kkkkk",
  },
  {
    title: "Entre flores",
    image: "/assets/rewards/photos/livia-flores.jpg",
    caption: "Uma modelo!",
  },
  {
    title: "Sua mamãe",
    image: "/assets/rewards/photos/mae-livia.png",
    caption: "De onde também vêm o cuidado, a força e tanto amor que fazem parte de você. Uma das responsáveis por você ser quem é e por te mimar.",
  },
  {
    title: "Q isso po",
    image: "/assets/rewards/photos/livia-chapeu-rosa.png",
    caption: "Bora ver, Ana Castelo",
  },
  {
    title: "Zé bonitinha",
    image: "/assets/rewards/photos/livia-oculos-azuis.png",
    caption: "Miopia da bolinha kkkkkk",
  },
  {
    title: "Seu papai",
    image: "/assets/rewards/photos/pai-livia.png",
    caption: "Presença, proteção e carinho também ajudam a contar a história de quem você é. Sempre cuidando de você do jeito dele. Sempre te mimando... Só mais 72h e o BYD vem",
  },
];

const percyMoments = [
  { title: "Linguinha para fora", image: "/assets/rewards/percy/percy-linguinha.jpg", caption: "É o nosso autista preferido, não tem jeito kkkkkk" },
  { title: "Colinho da Livinha", image: "/assets/rewards/percy/percy-e-livia.jpg", caption: "A lenda já não tava tankando a rua kkkkkk." },
  { title: "Percy em casa", image: "/assets/rewards/percy/percy-sentado.jpg", caption: "O velho depois de derrotar o seu maior inimigo kkkk." },
  { title: "Percyzinho", image: "/assets/rewards/percy/percy-bebe-1.jpg", caption: "A lenda chegando" },
  { title: "Pequeno aventureiro", image: "/assets/rewards/percy/percy-bebe-2.jpg", caption: "Um pingo" },
  { title: "Assistindo juntinhos", image: "/assets/rewards/percy/percy-assistindo.jpg", caption: "A lenda tava precisando de um biscoito vum kkkk." },
];

export default function RewardScreen({ onNext }) {
  const [collected, setCollected] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMoment(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  async function startMusic() {
    try {
      const audio = audioRef.current;

      if (!audio) {
        throw new Error("audio-player-not-ready");
      }

      await audio.play();
      setMusicBlocked(false);
    } catch {
      setMusicBlocked(true);
    }
  }

  function collectReward() {
    setCollected(true);
    startMusic();
  }

  return (
    <section className="reward-screen">
      <audio ref={audioRef} src={requestedSongPath} loop preload="auto" />
      <div className="reward-panel">
        <span className="screen-label">Pacote Livia desbloqueado</span>

        <h1>{collected ? "As muitas formas de brilhar" : "Colete sua recompensa"}</h1>

        {!collected && (
          <p>
            Depois de enfrentar o medo, vem a parte boa: abrir lembranças que
            mostram por que você nunca desiste, mesmo quando a fase fica dificil.
          </p>
        )}

        {collected && (
          <>
            <div className="reward-now-playing">
              <span>Agora tocando</span>
              <strong>Ela Une Todas as Coisas</strong>
              {musicBlocked && (
                <button className="secondary-button" type="button" onClick={startMusic}>
                  Tocar música
                </button>
              )}
            </div>

            <h2 className="reward-section-title">As muitas formas de ser Lívia</h2>
            <div className="photo-wall" aria-label="Mural de fotos e lembranças">
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

            <h2 className="reward-section-title">As muitas formas de ser Percy</h2>
            <div className="photo-wall" aria-label="Mural de fotos do Percy">
              {percyMoments.map((moment) => (
                <article className="photo-card" key={moment.title}>
                  <button className="photo-open-button" type="button" onClick={() => setSelectedMoment(moment)} aria-label={`Expandir foto: ${moment.title}`}>
                    <div className="photo-placeholder"><img src={moment.image} alt={moment.title} /></div>
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

            collectReward();
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

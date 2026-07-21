import { useEffect, useRef, useState } from "react";

const moments = [
  { image: "/assets/rewards/couple/maos.jpg", title: "Sempre de mãos dadas", caption: "Mesmo quando o medo aperta, a gente encontra coragem um no outro." },
  { image: "/assets/rewards/couple/nosso-comeco.jpg", title: "Nosso começo", caption: "Prestigiando sua mamãe" },
  { image: "/assets/rewards/couple/lado-a-lado.jpg", title: "Lado a lado", caption: "Até nos dias escuros, você sempre foi luz." },
  { image: "/assets/rewards/couple/beijo-1.jpg", title: "Carinho que ficou", caption: "Época boa kkk" },
  { image: "/assets/rewards/couple/beijo-2.jpg", title: "Nós dois", caption: "Eu escolheria viver cada fase ao seu lado outra vez. Sempre!" },
  { image: "/assets/rewards/couple/nosso-comeco-2.png", title: "Desde o começo", caption: "Nas antiga na casa de vó" },
  { image: "/assets/rewards/couple/beijo-3.png", title: "Nosso carinho", caption: "Em cada beijo ficou guardado um pedaço da história que continuamos escolhendo viver." },
];

export default function CoupleCarousel({ onNext, startAt = 0 }) {
  const [index, setIndex] = useState(0);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const audioRef = useRef(null);
  const moment = moments[index];

  const playMusic = async () => {
    try {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = Math.max(0, startAt);
      await audio.play();
      setMusicBlocked(false);
    } catch {
      setMusicBlocked(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, startAt);
      audio.play().catch(() => setMusicBlocked(true));
    }
    return () => audio?.pause();
  }, [startAt]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(0, value - 1));
      if (event.key === "ArrowRight" || event.key === "Enter") {
        if (index === moments.length - 1) onNext();
        else setIndex((value) => value + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, onNext]);

  return (
    <section className="couple-carousel-screen">
      <audio ref={audioRef} src="/assets/audio/runaway.mp3" preload="auto" />
      <div className="couple-carousel">
        <div className="couple-photo-frame"><img src={moment.image} alt={moment.title} /></div>
        <div className="couple-carousel-copy">
          <span className="screen-label">Uma história em muitas fases</span>
          <h1>{moment.title}</h1>
          <p>{moment.caption}</p>
          <div className="carousel-progress" aria-label={`Foto ${index + 1} de ${moments.length}`}>
            {moments.map((item, itemIndex) => <span className={itemIndex === index ? "active" : ""} key={item.image} />)}
          </div>
          <div className="carousel-actions">
            <button type="button" className="secondary-button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Anterior</button>
            <button type="button" className="primary-button" onClick={() => index === moments.length - 1 ? onNext() : setIndex((value) => value + 1)}>{index === moments.length - 1 ? "Continuar" : "Próxima"}</button>
          </div>
          {musicBlocked && <button className="carousel-music-retry" type="button" onClick={playMusic}>Tocar nossa música</button>}
          <small>Use as setas ou pressione Enter</small>
        </div>
      </div>
    </section>
  );
}

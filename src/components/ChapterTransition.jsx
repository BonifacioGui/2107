import { useEffect } from "react";

export default function ChapterTransition({ eyebrow, title, text, onNext }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext]);

  return (
    <section className="chapter-transition">
      <div className="chapter-transition__line" aria-hidden="true" />
      <p className="chapter-transition__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="chapter-transition__text">{text}</p>
      <button type="button" onClick={onNext} autoFocus>
        Continuar
      </button>
      <small>Pressione Enter</small>
    </section>
  );
}

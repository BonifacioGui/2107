export default function TributeScreen({
  title,
  paragraphs,
  buttonText,
  onNext,
}) {
  return (
    <section className="tribute-screen">
      <div className="tribute-glow"></div>

      <div className="tribute-card">
        <div className="tribute-card__ornament" aria-hidden="true">
          <span />
          <strong>&hearts;</strong>
          <span />
        </div>
        <span className="tribute-label">2107</span>

        <h1>{title}</h1>

        <div className="tribute-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <button onClick={onNext} className="primary-button">
          {buttonText}
        </button>
      </div>
    </section>
  );
}

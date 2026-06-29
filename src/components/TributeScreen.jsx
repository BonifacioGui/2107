export default function TributeScreen({
  title,
  paragraphs,
  buttonText,
  onNext,
}) {
  return (
    <section className="card homenagem-card">
      <h1>{title}</h1>

      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      <button onClick={onNext} className="primary-button">
        {buttonText}
      </button>
    </section>
  );
}
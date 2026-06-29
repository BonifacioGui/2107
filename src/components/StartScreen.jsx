export default function StartScreen({ onStart }) {
  return (
    <section className="card intro-card">
      <h1>2107</h1>

      <p>
        Uma pequena aventura sobre coragem, amor e tudo que eu admiro em você.
      </p>

      <button onClick={onStart} className="primary-button">
        Começar
      </button>
    </section>
  );
}
export default function StartScreen({ onStart }) {
  return (
    <section className="card intro-card">
      <h1>2107</h1>

      <p>
        Uma aventura feita de coragem, carinho e pequenos detalhes que lembram
        tudo que eu admiro em voce.
      </p>

      <button onClick={onStart} className="primary-button">
        Comecar aventura
      </button>
    </section>
  );
}

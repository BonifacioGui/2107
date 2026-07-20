export default function StartScreen({ onStart }) {
  return (
    <section className="card intro-card">
      <h1>2107</h1>

      <p>
        Uma brincadeira que fiz para te homenagear de alguma forma. Peguei coisas que você gosta e que são importantes para você e tentei transformar em uma aventura. Espero que você goste.
      </p>

      <button onClick={onStart} className="primary-button">
        Comecar aventura
      </button>
    </section>
  );
}

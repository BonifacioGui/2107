export default function HowToScreen({ onStart }) {
  return (
    <section className="card info-card">
      <span className="screen-label">Como jogar</span>

      <h1>Missao Coragem</h1>

      <div className="how-to-grid">
        <article>
          <strong>Movimento</strong>
          <p>Use o teclado para andar, pular e explorar. As fases tambem aceitam WASD.</p>
        </article>

        <article>
          <strong>Acao</strong>
          <p>No Batman, X arremessa. No Chucky, X ou F acende a lanterna.</p>
        </article>

        <article>
          <strong>Vidas</strong>
          <p>Sao 3 coracoes. Ao errar, ela respira, levanta e continua.</p>
        </article>

        <article>
          <strong>Objetivo</strong>
          <p>Cada fase guarda um jeito de continuar: coragem, carinho, susto e lembranca.</p>
        </article>
      </div>

      <button onClick={onStart} className="primary-button">
        Jogar
      </button>
    </section>
  );
}

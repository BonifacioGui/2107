export default function HowToScreen({ onStart }) {
  return (
    <section className="card info-card">
      <span className="screen-label">Como jogar</span>

      <h1>Missão Coragem</h1>

      <div className="how-to-grid">
        <article>
          <strong>Movimento</strong>
          <p>Use o teclado para andar, pular e explorar. As fases também aceitam WASD.</p>
        </article>

        <article>
          <strong>Ação</strong>
          <p>Pressione X para arremessar.</p>
        </article>

        <article>
          <strong>Vidas</strong>
          <p>São 3 corações. Ao errar, você respira, levanta e continua.</p>
        </article>

        <article>
          <strong>Objetivo</strong>
          <p>Explore, observe o ambiente e descubra o objetivo sem pressa.</p>
        </article>
      </div>

      <button onClick={onStart} className="primary-button">
        Jogar
      </button>
    </section>
  );
}

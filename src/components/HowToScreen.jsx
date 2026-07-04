export default function HowToScreen({ onStart }) {
  return (
    <section className="card info-card">
      <span className="screen-label">Como jogar</span>

      <h1>Missao Coragem</h1>

      <div className="how-to-grid">
        <article>
          <strong>Movimento</strong>
          <p>Use o teclado para andar, pular e explorar. A fase do Percy tambem aceita WASD.</p>
        </article>

        <article>
          <strong>Batarangue</strong>
          <p>Aperte X para arremessar. Ele machuca os medos e tambem o Coringa.</p>
        </article>

        <article>
          <strong>Vidas</strong>
          <p>Sao 3 coracoes. Ao errar, ela respira, levanta e continua.</p>
        </article>

        <article>
          <strong>Objetivo</strong>
          <p>Primeiro junte os simbolos. Depois enfrente o Coringa e libere a recompensa.</p>
        </article>
      </div>

      <button onClick={onStart} className="primary-button">
        Jogar
      </button>
    </section>
  );
}

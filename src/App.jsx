import { useState } from "react";
import "./App.css";
import BatmanGame from "./games/BatmanGame";

function App() {
  const [tela, setTela] = useState("inicio");

  return (
    <main className="page">
      {tela === "inicio" && (
        <section className="card intro-card">
          <h1>2107</h1>

          <p>
            Uma pequena aventura sobre coragem, amor e tudo que eu admiro em
            você.
          </p>

          <button onClick={() => setTela("batman")} className="primary-button">
            Começar
          </button>
        </section>
      )}

      {tela === "batman" && (
        <section className="card">
          <h1>A Coragem que Eu Vejo em Você</h1>

          <p>
            Colete os símbolos de coragem e enfrente os medos pelo caminho.
          </p>

          <BatmanGame onComplete={() => setTela("homenagemBatman")} />
        </section>
      )}

      {tela === "homenagemBatman" && (
        <section className="card homenagem-card">
          <h1>Você enfrentou o medo ❤️</h1>

          <p>
            Coragem não é não sentir medo. Coragem é continuar mesmo quando algo
            assusta.
          </p>

          <p>
            E é isso que eu admiro tanto em você. Eu aprendo muito vendo você
            enfrentar seus medos, mesmo quando não é fácil.
          </p>

          <button onClick={() => setTela("inicio")} className="primary-button">
            Voltar ao início
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
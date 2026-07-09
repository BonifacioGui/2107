import { useState } from "react";
import "./App.css";

import StartScreen from "./components/StartScreen";
import HowToScreen from "./components/HowToScreen";
import GameLayout from "./components/GameLayout";
import RewardScreen from "./components/RewardScreen";
import TributeScreen from "./components/TributeScreen";

import BatmanGame from "./games/BatmanGame";
import CatGame from "./games/CatGame";
import ChuckyGame from "./games/ChuckyGame";

import { tributes } from "./data/tributes";

const screens = new Set([
  "start",
  "howTo",
  "batman",
  "reward",
  "batmanTribute",
  "cat",
  "chucky",
  "finalTribute",
]);

function getInitialScreen() {
  const screenParam = new URLSearchParams(window.location.search).get("screen");

  return screens.has(screenParam) ? screenParam : "start";
}

function App() {
  const [screen, setScreen] = useState(getInitialScreen);

  return (
    <main className="page">
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("howTo")} />
      )}

      {screen === "howTo" && (
        <HowToScreen onStart={() => setScreen("batman")} />
      )}

      {screen === "batman" && (
        <GameLayout
          title="A Coragem que Eu Vejo em Voce"
          description="Colete os simbolos de coragem, use o batarangue e enfrente o Coringa."
        >
          <BatmanGame onComplete={() => setScreen("reward")} />
        </GameLayout>
      )}

      {screen === "reward" && (
        <RewardScreen onNext={() => setScreen("batmanTribute")} />
      )}

      {screen === "batmanTribute" && (
        <TributeScreen
          title={tributes.batman.title}
          paragraphs={tributes.batman.paragraphs}
          buttonText="Continuar"
          onNext={() => setScreen("cat")}
        />
      )}

      {screen === "cat" && (
        <GameLayout
          title="Percy e os Cantinhos da Casa"
          description="Passeie sem pressa, guarde pequenas memorias e encontre Livinha no fim."
        >
          <CatGame onComplete={() => setScreen("chucky")} />
        </GameLayout>
      )}

      {screen === "chucky" && (
        <GameLayout
          title="O Susto que Vira Risada"
          description="Colete lembrancas, use a lanterna e encontre quem ficou assustado no escuro."
        >
          <ChuckyGame onComplete={() => setScreen("finalTribute")} />
        </GameLayout>
      )}

      {screen === "finalTribute" && (
        <TributeScreen
          title={tributes.final.title}
          paragraphs={tributes.final.paragraphs}
          buttonText="Voltar ao inicio"
          onNext={() => setScreen("start")}
        />
      )}
    </main>
  );
}

export default App;

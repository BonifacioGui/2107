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
  "chucky",
  "cat",
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
          description="Explore os telhados, encontre coragem e siga em frente."
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
          onNext={() => setScreen("chucky")}
        />
      )}

      {screen === "chucky" && (
        <GameLayout
          title="O Susto que Vira Risada"
          description="Atravesse o escuro, encontre lembrancas e volte para a luz."
        >
          <ChuckyGame onComplete={() => setScreen("cat")} />
        </GameLayout>
      )}

      {screen === "cat" && (
        <GameLayout
          title="Percy e os Cantinhos da Casa"
          description="Passeie sem pressa e guarde as pequenas memorias da casa."
        >
          <CatGame onComplete={() => setScreen("finalTribute")} />
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

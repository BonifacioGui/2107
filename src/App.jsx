import { useState } from "react";
import "./App.css";

import StartScreen from "./components/StartScreen";
import HowToScreen from "./components/HowToScreen";
import GameLayout from "./components/GameLayout";
import RewardScreen from "./components/RewardScreen";
import TributeScreen from "./components/TributeScreen";
import ChapterTransition from "./components/ChapterTransition";
import CoupleCarousel from "./components/CoupleCarousel";

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
  "transitionTwo",
  "chucky",
  "coupleReward",
  "transitionThree",
  "cat",
  "finalTribute",
]);

function getInitialScreen() {
  const screenParam = new URLSearchParams(window.location.search).get("screen");

  return screens.has(screenParam) ? screenParam : "start";
}

function App() {
  const [screen, setScreen] = useState(getInitialScreen);
  const [rescueSongStart, setRescueSongStart] = useState(0);

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
          title="A Coragem que Eu Vejo em Você"
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
          onNext={() => setScreen("transitionTwo")}
        />
      )}

      {screen === "transitionTwo" && (
        <ChapterTransition
          eyebrow="Capítulo concluído"
          title="Uma nova porta se abriu"
          text="A coragem muda de forma, mas continua caminhando ao seu lado."
          onNext={() => setScreen("chucky")}
        />
      )}

      {screen === "chucky" && (
        <GameLayout
          title="O Susto que Vira Risada"
          description="Atravesse o escuro, encontre lembranças e volte para a luz."
        >
          <ChuckyGame onComplete={(payload) => {
            setRescueSongStart(payload?.rescueSongSeek || 0);
            setScreen("coupleReward");
          }} />
        </GameLayout>
      )}

      {screen === "coupleReward" && (
        <CoupleCarousel startAt={rescueSongStart} onNext={() => setScreen("transitionThree")} />
      )}

      {screen === "transitionThree" && (
        <ChapterTransition
          eyebrow="Capítulo concluído"
          title="Depois da tempestade"
          text="Agora, o caminho pede menos pressa e mais atenção aos pequenos afetos."
          onNext={() => setScreen("cat")}
        />
      )}

      {screen === "cat" && (
        <GameLayout
          title="Percy e os Cantinhos da Casa"
          description="Passeie sem pressa e guarde as pequenas memórias da casa."
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

import { useState } from "react";
import "./App.css";

import StartScreen from "./components/StartScreen";
import GameLayout from "./components/GameLayout";
import TributeScreen from "./components/TributeScreen";

import BatmanGame from "./games/BatmanGame";
import CatGame from "./games/CatGame";

import { tributes } from "./data/tributes";

function App() {
  const [screen, setScreen] = useState("start");

  return (
    <main className="page">
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("batman")} />
      )}

      {screen === "batman" && (
        <GameLayout
          title="A Coragem que Eu Vejo em Você"
          description="Colete os símbolos de coragem e enfrente os medos pelo caminho."
        >
          <BatmanGame onComplete={() => setScreen("batmanTribute")} />
        </GameLayout>
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
          title="O Lugar Seguro"
          description="Colete lembranças de carinho e encontre o presente final."
        >
          <CatGame onComplete={() => setScreen("finalTribute")} />
        </GameLayout>
      )}

      {screen === "finalTribute" && (
        <TributeScreen
          title={tributes.final.title}
          paragraphs={tributes.final.paragraphs}
          buttonText="Voltar ao início"
          onNext={() => setScreen("start")}
        />
      )}
    </main>
  );
}

export default App;
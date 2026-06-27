import { useEffect, useRef } from "react";
import Phaser from "phaser";

class BatmanScene extends Phaser.Scene {
  constructor() {
    super("BatmanScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#050713");

    this.mobileInput = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    this.faseConcluida = false;

    this.criarCenarioGotham();

    this.add
      .text(400, 38, "Fase 1: Enfrentando o Medo", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 73, "Colete os símbolos de coragem e atravesse a escuridão", {
        fontSize: "16px",
        color: "#b8c7ff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.criarHeroi();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.coragem = 0;
    this.totalCoragem = 5;

    this.coragemText = this.add.text(20, 20, "Coragem: 0/5", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "Arial",
    });

    this.items = this.physics.add.group();

    const posicoes = [
      [220, 445],
      [350, 330],
      [500, 465],
      [650, 315],
      [720, 515],
    ];

    posicoes.forEach(([x, y]) => {
      const item = this.add.circle(x, y, 16, 0xf5c542);
      this.physics.add.existing(item);
      item.body.setCircle(16);
      item.body.setAllowGravity(false);

      item.icon = this.add
        .text(x, y - 1, "★", {
          fontSize: "25px",
          color: "#fff2a8",
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: [item, item.icon],
        y: y - 8,
        duration: 900,
        yoyo: true,
        repeat: -1,
      });

      this.items.add(item);
    });

    this.physics.add.overlap(
      this.player,
      this.items,
      this.coletarItem,
      null,
      this
    );

    this.sombras = this.physics.add.group();

    this.criarMedo(405, 520, "medo");
    this.criarMedo(600, 410, "agulha");

    this.physics.add.overlap(
      this.player,
      this.sombras,
      this.tocarMedo,
      null,
      this
    );

    this.mensagem = this.add
      .text(400, 300, "", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    if (this.deveExibirControlesMobile()) {
      this.criarControlesMobile();
    }
  }

  update() {
    if (this.faseConcluida) {
      this.player.body.setVelocity(0);
      this.atualizarVisualHeroi();
      return;
    }

    const velocidade = 220;

    this.player.body.setVelocity(0);

    const esquerda = this.cursors.left.isDown || this.mobileInput.left;
    const direita = this.cursors.right.isDown || this.mobileInput.right;
    const cima = this.cursors.up.isDown || this.mobileInput.up;
    const baixo = this.cursors.down.isDown || this.mobileInput.down;

    if (esquerda) {
      this.player.body.setVelocityX(-velocidade);
    } else if (direita) {
      this.player.body.setVelocityX(velocidade);
    }

    if (cima) {
      this.player.body.setVelocityY(-velocidade);
    } else if (baixo) {
      this.player.body.setVelocityY(velocidade);
    }

    this.atualizarVisualHeroi();
  }

  criarCenarioGotham() {
    this.add.rectangle(400, 300, 800, 600, 0x050713);

    this.add.circle(640, 105, 44, 0xf6f1c4, 0.9);
    this.add.circle(620, 95, 44, 0x050713, 0.85);

    this.add
      .triangle(655, 530, 610, 140, 700, 140, 655, 530, 0xf5c542, 0.08)
      .setAlpha(0.8);

    this.add.circle(655, 140, 55, 0xf5c542, 0.16);
    this.add
      .text(655, 140, "🦇", {
        fontSize: "38px",
      })
      .setOrigin(0.5);

    const predios = [
      [40, 460, 80, 230],
      [120, 430, 90, 290],
      [220, 475, 80, 200],
      [315, 445, 110, 260],
      [430, 470, 100, 210],
      [535, 430, 90, 290],
      [650, 460, 120, 230],
      [760, 440, 100, 270],
    ];

    predios.forEach(([x, y, largura, altura]) => {
      this.add.rectangle(x, y, largura, altura, 0x0b1026);
      this.criarJanelasPredio(x, y, largura, altura);
    });

    this.add.rectangle(400, 585, 800, 35, 0x05050b);

    for (let i = 0; i < 35; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);

      const gota = this.add.rectangle(x, y, 2, 16, 0x9eb7ff, 0.32);

      this.tweens.add({
        targets: gota,
        y: 650,
        x: x + 80,
        duration: Phaser.Math.Between(900, 1500),
        repeat: -1,
        delay: Phaser.Math.Between(0, 900),
      });
    }

    this.add.circle(120, 570, 100, 0x9eb7ff, 0.05);
    this.add.circle(330, 575, 140, 0x9eb7ff, 0.04);
    this.add.circle(580, 570, 130, 0x9eb7ff, 0.04);
  }

  criarJanelasPredio(x, y, largura, altura) {
    const topo = y - altura / 2 + 25;
    const base = y + altura / 2 - 30;

    for (let janelaY = topo; janelaY < base; janelaY += 34) {
      for (
        let janelaX = x - largura / 2 + 18;
        janelaX < x + largura / 2 - 12;
        janelaX += 28
      ) {
        const acesa = Phaser.Math.Between(0, 1) === 1;

        if (acesa) {
          this.add.rectangle(janelaX, janelaY, 10, 16, 0xf5c542, 0.7);
        }
      }
    }
  }

  criarHeroi() {
    this.player = this.add.rectangle(100, 500, 42, 55, 0x080808, 0);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.heroCape = this.add.triangle(
      100,
      508,
      0,
      -35,
      -35,
      35,
      35,
      35,
      0x020202,
      0.95
    );

    this.heroBody = this.add.rectangle(100, 500, 30, 46, 0x111111);
    this.heroHead = this.add.circle(100, 466, 17, 0x111111);

    this.heroEarLeft = this.add.triangle(
      90,
      452,
      0,
      -16,
      -7,
      7,
      7,
      7,
      0x111111
    );

    this.heroEarRight = this.add.triangle(
      110,
      452,
      0,
      -16,
      -7,
      7,
      7,
      0x111111
    );

    this.heroSymbol = this.add
      .text(100, 497, "🦇", {
        fontSize: "17px",
      })
      .setOrigin(0.5);
  }

  atualizarVisualHeroi() {
    const x = this.player.x;
    const y = this.player.y;

    this.heroCape.setPosition(x, y + 8);
    this.heroBody.setPosition(x, y);
    this.heroHead.setPosition(x, y - 34);
    this.heroEarLeft.setPosition(x - 10, y - 48);
    this.heroEarRight.setPosition(x + 10, y - 48);
    this.heroSymbol.setPosition(x, y - 3);
  }

  criarMedo(x, y, texto) {
    const sombra = this.add.rectangle(x, y, 75, 75, 0x35155d, 0.85);
    sombra.setStrokeStyle(2, 0x8f5cff, 0.6);

    this.physics.add.existing(sombra);
    sombra.body.setAllowGravity(false);

    this.sombras.add(sombra);

    this.add
      .text(x, y, texto, {
        fontSize: "13px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: sombra,
      scaleX: 1.08,
      scaleY: 1.08,
      alpha: 0.65,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  deveExibirControlesMobile() {
    const telaPequena = window.innerWidth <= 768;
    const toque = window.matchMedia("(pointer: coarse)").matches;

    return telaPequena || toque;
  }

  criarControlesMobile() {
    this.criarBotaoControle(90, 520, "←", "left");
    this.criarBotaoControle(170, 520, "→", "right");
    this.criarBotaoControle(130, 470, "↑", "up");
    this.criarBotaoControle(130, 570, "↓", "down");

    this.add
      .text(130, 420, "controle", {
        fontSize: "13px",
        color: "#9fa8da",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.input.on("pointerup", () => {
      this.pararMovimentoMobile();
    });
  }

  criarBotaoControle(x, y, texto, direcao) {
    const botao = this.add
      .circle(x, y, 30, 0xffffff, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.35)
      .setInteractive();

    const label = this.add
      .text(x, y, texto, {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive();

    const ativar = () => {
      this.mobileInput[direcao] = true;
    };

    const desativar = () => {
      this.mobileInput[direcao] = false;
    };

    botao.on("pointerdown", ativar);
    label.on("pointerdown", ativar);

    botao.on("pointerup", desativar);
    label.on("pointerup", desativar);

    botao.on("pointerout", desativar);
    label.on("pointerout", desativar);
  }

  pararMovimentoMobile() {
    this.mobileInput.left = false;
    this.mobileInput.right = false;
    this.mobileInput.up = false;
    this.mobileInput.down = false;
  }

  coletarItem(player, item) {
    if (item.icon) {
      item.icon.destroy();
    }

    item.destroy();

    this.coragem += 1;
    this.coragemText.setText(`Coragem: ${this.coragem}/${this.totalCoragem}`);

    if (this.coragem === this.totalCoragem && !this.faseConcluida) {
      this.faseConcluida = true;

      this.mensagem.setText(
        "Você venceu o medo.\nCoragem não é não sentir medo.\nÉ continuar mesmo assim."
      );

      this.time.delayedCall(2500, () => {
        this.game.events.emit("batman-complete");
      });
    }
  }

  tocarMedo() {
    if (!this.faseConcluida) {
      this.cameras.main.shake(120, 0.006);
    }
  }
}

export default function BatmanGame({ onComplete }) {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (phaserGameRef.current) {
      return;
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: BatmanScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    const finalizarFase = () => {
      onCompleteRef.current();
    };

    phaserGameRef.current.events.on("batman-complete", finalizarFase);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.events.off("batman-complete", finalizarFase);
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div className="game-container" ref={gameRef}></div>;
}
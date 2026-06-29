import Phaser from "phaser";

export default class BatmanScene extends Phaser.Scene {
  constructor() {
    super("BatmanScene");
  }

  preload() {
    this.load.image("batmanHero", "/assets/characters/batman.png");
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
    this.simbolosColetados = [];

    this.coragemText = this.add.text(20, 20, "Símbolos: 0/5", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "Arial",
    });

    this.feedbackText = this.add
      .text(400, 115, "", {
        fontSize: "18px",
        color: "#f5c542",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.items = this.physics.add.group();

    const simbolos = [
      { x: 220, y: 445, nome: "Força", icone: "⚡" },
      { x: 350, y: 330, nome: "Calma", icone: "🌙" },
      { x: 500, y: 465, nome: "Confiança", icone: "🛡️" },
      { x: 650, y: 315, nome: "Amor", icone: "❤️" },
      { x: 720, y: 515, nome: "Coragem", icone: "✨" },
    ];

    simbolos.forEach(({ x, y, nome, icone }) => {
      const item = this.add.circle(x, y, 18, 0xf5c542, 0.9);
      this.physics.add.existing(item);
      item.body.setCircle(18);
      item.body.setAllowGravity(false);

      item.nome = nome;

      item.icon = this.add
        .text(x, y - 2, icone, {
          fontSize: "24px",
        })
        .setOrigin(0.5);

      item.label = this.add
        .text(x, y + 32, nome, {
          fontSize: "13px",
          color: "#ffffff",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: [item, item.icon, item.label],
        y: "-=8",
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
      this.player.setFlipX(true);
    } else if (direita) {
      this.player.body.setVelocityX(velocidade);
      this.player.setFlipX(false);
    }

    if (cima) {
      this.player.body.setVelocityY(-velocidade);
    } else if (baixo) {
      this.player.body.setVelocityY(velocidade);
    }
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
    this.player = this.add.image(100, 500, "batmanHero");

    this.physics.add.existing(this.player);

    this.player.setDisplaySize(82, 82);
    this.player.body.setCollideWorldBounds(true);

    this.player.body.setSize(42, 58);
    this.player.body.setOffset(20, 18);
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
    const nomeSimbolo = item.nome;

    if (item.icon) {
      item.icon.destroy();
    }

    if (item.label) {
      item.label.destroy();
    }

    item.destroy();

    this.simbolosColetados.push(nomeSimbolo);

    this.coragem += 1;
    this.coragemText.setText(`Símbolos: ${this.coragem}/${this.totalCoragem}`);

    this.feedbackText.setText(`Símbolo coletado: ${nomeSimbolo}`);

    this.time.delayedCall(900, () => {
      if (!this.faseConcluida) {
        this.feedbackText.setText("");
      }
    });

    if (this.coragem === this.totalCoragem && !this.faseConcluida) {
      this.faseConcluida = true;

      this.feedbackText.setText("");

      this.mensagem.setText(
        "Você reuniu força, calma, confiança, amor e coragem.\n\nMesmo quando sente medo, você continua.\nE isso me ensina muito."
      );

      this.time.delayedCall(3500, () => {
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
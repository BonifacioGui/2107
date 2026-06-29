import Phaser from "phaser";

export default class CatScene extends Phaser.Scene {
  constructor() {
    super("CatScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#23152f");

    this.mobileInput = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    this.faseConcluida = false;

    this.criarCenarioAconchegante();

    this.add
      .text(400, 38, "Fase 2: O Lugar Seguro", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 73, "Colete lembranças de carinho pelo caminho", {
        fontSize: "16px",
        color: "#ffd6ef",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.criarGatinho();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.afeto = 0;
    this.totalAfeto = 5;

    this.afetoText = this.add.text(20, 20, "Carinho: 0/5", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "Arial",
    });

    this.feedbackText = this.add
      .text(400, 115, "", {
        fontSize: "18px",
        color: "#ffd166",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.items = this.physics.add.group();

    const lembrancas = [
      { x: 180, y: 430, nome: "Cuidado", icone: "❤️" },
      { x: 315, y: 330, nome: "Carinho", icone: "🐾" },
      { x: 470, y: 455, nome: "Calma", icone: "🌙" },
      { x: 625, y: 335, nome: "Sorriso", icone: "✨" },
      { x: 710, y: 505, nome: "Amor", icone: "🎁" },
    ];

    lembrancas.forEach(({ x, y, nome, icone }) => {
      const item = this.add.circle(x, y, 18, 0xffd166, 0.9);
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
      this.atualizarVisualGatinho();
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

    this.atualizarVisualGatinho();
  }

  criarCenarioAconchegante() {
    this.add.rectangle(400, 300, 800, 600, 0x23152f);

    this.add.circle(120, 120, 80, 0xffc2d1, 0.12);
    this.add.circle(680, 150, 110, 0xffd166, 0.1);
    this.add.circle(400, 500, 180, 0xffffff, 0.04);

    this.add.rectangle(400, 565, 800, 70, 0x3b214b);

    this.add.rectangle(150, 505, 180, 80, 0x6d3d7c);
    this.add.rectangle(150, 455, 150, 35, 0x8f5d8d);

    this.add.rectangle(620, 490, 130, 150, 0x4a2a5c);
    this.add.rectangle(620, 395, 150, 22, 0xffd166, 0.8);

    this.add.text(620, 360, "cantinho seguro", {
      fontSize: "15px",
      color: "#ffd6ef",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    for (let i = 0; i < 25; i++) {
      const x = Phaser.Math.Between(30, 770);
      const y = Phaser.Math.Between(120, 540);

      const brilho = this.add.circle(x, y, 2, 0xffffff, 0.45);

      this.tweens.add({
        targets: brilho,
        alpha: 0.1,
        duration: Phaser.Math.Between(900, 1600),
        yoyo: true,
        repeat: -1,
      });
    }
  }

  criarGatinho() {
    this.player = this.add.rectangle(100, 500, 48, 48, 0xffffff, 0);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.catBody = this.add.ellipse(100, 500, 58, 38, 0xf2f2f2);
    this.catHead = this.add.circle(100, 468, 24, 0xf2f2f2);

    this.catEarLeft = this.add.triangle(
      84,
      449,
      0,
      -18,
      -10,
      8,
      10,
      8,
      0xf2f2f2
    );

    this.catEarRight = this.add.triangle(
      116,
      449,
      0,
      -18,
      -10,
      8,
      10,
      8,
      0xf2f2f2
    );

    this.catFace = this.add
      .text(100, 469, "🐱", {
        fontSize: "31px",
      })
      .setOrigin(0.5);

    this.catTail = this.add.arc(132, 500, 20, 20, 220, 80, false, 0xf2f2f2, 1);
    this.catTail.setStrokeStyle(6, 0xf2f2f2);
  }

  atualizarVisualGatinho() {
    const x = this.player.x;
    const y = this.player.y;

    this.catBody.setPosition(x, y + 6);
    this.catHead.setPosition(x, y - 26);
    this.catEarLeft.setPosition(x - 16, y - 45);
    this.catEarRight.setPosition(x + 16, y - 45);
    this.catFace.setPosition(x, y - 25);
    this.catTail.setPosition(x + 32, y + 6);
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
        color: "#ffd6ef",
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
    const nomeLembranca = item.nome;

    if (item.icon) {
      item.icon.destroy();
    }

    if (item.label) {
      item.label.destroy();
    }

    item.destroy();

    this.afeto += 1;
    this.afetoText.setText(`Carinho: ${this.afeto}/${this.totalAfeto}`);

    this.feedbackText.setText(`Lembrança coletada: ${nomeLembranca}`);

    this.time.delayedCall(900, () => {
      if (!this.faseConcluida) {
        this.feedbackText.setText("");
      }
    });

    if (this.afeto === this.totalAfeto && !this.faseConcluida) {
      this.faseConcluida = true;

      this.feedbackText.setText("");

      this.mensagem.setText(
        "Depois de enfrentar o medo,\nsempre existe um lugar seguro.\n\nE eu queria que você sempre sentisse isso comigo."
      );

      this.time.delayedCall(3500, () => {
        this.game.events.emit("cat-complete");
      });
    }
  }
}
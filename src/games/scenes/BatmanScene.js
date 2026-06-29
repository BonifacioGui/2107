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
      jump: false,
    };

    this.faseConcluida = false;
    this.ultimoToqueMedo = 0;

    this.criarCenarioGotham();

    this.add
      .text(400, 38, "Fase 1: Enfrentando o Medo", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 73, "Pule pelas plataformas e reúna os símbolos de coragem", {
        fontSize: "16px",
        color: "#b8c7ff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.criarPlataformas();
    this.criarHeroi();
    this.criarSimbolos();
    this.criarMedos();
    this.criarFinalDaFase();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

    this.mensagem = this.add
      .text(400, 300, "", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    this.physics.add.collider(this.player, this.plataformas);
    this.physics.add.collider(this.items, this.plataformas);
    this.physics.add.collider(this.sombras, this.plataformas);
    this.physics.add.collider(this.portalFinal, this.plataformas);

    this.physics.add.overlap(
      this.player,
      this.items,
      this.coletarItem,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.sombras,
      this.tocarMedo,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.portalFinal,
      this.tentarFinalizarFase,
      null,
      this
    );

    if (this.deveExibirControlesMobile()) {
      this.criarControlesMobile();
    }
  }

  update() {
    if (this.faseConcluida) {
      this.player.body.setVelocityX(0);
      return;
    }

    const velocidade = 230;
    const forcaPulo = -520;

    const esquerda = this.cursors.left.isDown || this.mobileInput.left;
    const direita = this.cursors.right.isDown || this.mobileInput.right;
    const pulando =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      this.mobileInput.jump;

    this.player.body.setVelocityX(0);

    if (esquerda) {
      this.player.body.setVelocityX(-velocidade);
      this.player.setFlipX(true);
    } else if (direita) {
      this.player.body.setVelocityX(velocidade);
      this.player.setFlipX(false);
    }

    if (pulando && this.player.body.blocked.down) {
      this.player.body.setVelocityY(forcaPulo);
      this.mobileInput.jump = false;
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

  criarPlataformas() {
    this.plataformas = this.physics.add.staticGroup();

    this.criarPlataforma(400, 575, 820, 50);
    this.criarPlataforma(190, 455, 150, 22);
    this.criarPlataforma(390, 370, 145, 22);
    this.criarPlataforma(595, 455, 150, 22);
    this.criarPlataforma(690, 305, 135, 22);
  }

  criarPlataforma(x, y, largura, altura) {
    const plataforma = this.add.rectangle(x, y, largura, altura, 0x161b3a);
    plataforma.setStrokeStyle(2, 0x3d4b91, 0.9);

    this.physics.add.existing(plataforma, true);
    this.plataformas.add(plataforma);

    this.add.rectangle(x, y - altura / 2, largura, 4, 0xf5c542, 0.25);
  }

  criarHeroi() {
    this.player = this.physics.add.image(80, 500, "batmanHero");

    this.player.setDisplaySize(78, 78);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);

    this.player.body.setSize(38, 58);
    this.player.body.setOffset(20, 18);
  }

  criarSimbolos() {
    this.items = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const simbolos = [
      { x: 190, y: 410, nome: "Força", icone: "⚡" },
      { x: 390, y: 325, nome: "Calma", icone: "🌙" },
      { x: 595, y: 410, nome: "Confiança", icone: "🛡️" },
      { x: 690, y: 260, nome: "Amor", icone: "❤️" },
      { x: 745, y: 520, nome: "Coragem", icone: "✨" },
    ];

    simbolos.forEach(({ x, y, nome, icone }) => {
      const item = this.add.circle(x, y, 18, 0xf5c542, 0.9);
      this.physics.add.existing(item);
      item.body.setAllowGravity(false);
      item.body.setImmovable(true);
      item.body.setCircle(18);

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
  }

  criarMedos() {
    this.sombras = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.criarMedo(310, 540, "medo");
    this.criarMedo(500, 335, "agulha");
    this.criarMedo(675, 420, "receio");
  }

  criarMedo(x, y, texto) {
    const sombra = this.add.rectangle(x, y, 70, 70, 0x35155d, 0.85);
    sombra.setStrokeStyle(2, 0x8f5cff, 0.6);

    this.physics.add.existing(sombra);
    sombra.body.setAllowGravity(false);
    sombra.body.setImmovable(true);

    this.sombras.add(sombra);

    sombra.label = this.add
      .text(x, y, texto, {
        fontSize: "13px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [sombra, sombra.label],
      scaleX: 1.08,
      scaleY: 1.08,
      alpha: 0.65,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  criarFinalDaFase() {
    this.portalFinal = this.add.rectangle(760, 505, 42, 90, 0xf5c542, 0.2);
    this.portalFinal.setStrokeStyle(2, 0xf5c542, 0.9);

    this.physics.add.existing(this.portalFinal);
    this.portalFinal.body.setAllowGravity(false);
    this.portalFinal.body.setImmovable(true);

    this.add
      .text(760, 445, "saída", {
        fontSize: "13px",
        color: "#f5c542",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.portalFinal,
      alpha: 0.45,
      duration: 900,
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
    this.criarBotaoControle(720, 520, "↑", "jump");

    this.add
      .text(130, 470, "mover", {
        fontSize: "13px",
        color: "#9fa8da",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(720, 470, "pular", {
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
      if (direcao === "jump") {
        this.mobileInput.jump = true;
        return;
      }

      this.mobileInput[direcao] = true;
    };

    const desativar = () => {
      if (direcao !== "jump") {
        this.mobileInput[direcao] = false;
      }
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
  }

  tocarMedo() {
    if (this.faseConcluida) {
      return;
    }

    const agora = this.time.now;

    if (agora - this.ultimoToqueMedo < 700) {
      return;
    }

    this.ultimoToqueMedo = agora;

    this.cameras.main.shake(120, 0.006);
    this.player.body.setVelocityY(-260);

    this.feedbackText.setText("Você sentiu medo... mas continuou.");

    this.time.delayedCall(900, () => {
      if (!this.faseConcluida) {
        this.feedbackText.setText("");
      }
    });
  }

  tentarFinalizarFase() {
    if (this.faseConcluida) {
      return;
    }

    if (this.coragem < this.totalCoragem) {
      this.feedbackText.setText("Reúna todos os símbolos antes de sair.");

      this.time.delayedCall(1000, () => {
        if (!this.faseConcluida) {
          this.feedbackText.setText("");
        }
      });

      return;
    }

    this.faseConcluida = true;
    this.player.body.setVelocity(0);

    this.feedbackText.setText("");

    this.mensagem.setText(
      "Você atravessou a escuridão.\nReuniu força, calma, confiança, amor e coragem.\n\nMesmo quando sente medo, você continua.\nE isso me ensina muito."
    );

    this.time.delayedCall(3800, () => {
      this.game.events.emit("batman-complete");
    });
  }
}
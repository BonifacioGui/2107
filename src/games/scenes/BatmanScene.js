import Phaser from "phaser";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./batman/constants";
import {
  criarCenarioGotham,
  atualizarCenarioGotham,
} from "./batman/background";
import { criarPlataformas } from "./batman/platforms";

export default class BatmanScene extends Phaser.Scene {
  constructor() {
    super("BatmanScene");
  }

  preload() {
    this.load.image("gothamSky", "/assets/backgrounds/gotham-sky.png");

    this.load.image(
      "gothamBuildingsBack",
      "/assets/backgrounds/gotham-buildings-back.png"
    );

    this.load.image(
      "gothamBuildingsFront",
      "/assets/backgrounds/gotham-buildings-front.png"
    );

    this.load.image("gothamFog", "/assets/backgrounds/gotham-fog.png");

    this.load.image("itemForca", "/assets/items/simbolo-forca.png");
    this.load.image("itemCalma", "/assets/items/simbolo-calma.png");
    this.load.image("itemConfianca", "/assets/items/simbolo-confianca.png");
    this.load.image("itemAmor", "/assets/items/simbolo-amor.png");
    this.load.image("itemCoragem", "/assets/items/simbolo-coragem.png");

    this.load.image("enemyMedo", "/assets/enemies/medo.png");
    this.load.image("enemyAgulha", "/assets/enemies/agulha.png");
    this.load.image("enemyReceio", "/assets/enemies/receio.png");

    this.load.image("rooftopPlatform", "/assets/platforms/rooftop-platform.png");
    this.load.image("rooftopGround", "/assets/platforms/rooftop-ground.png");

    this.load.image("gothamExit", "/assets/objects/gotham-exit.png");

    this.load.spritesheet(
      "batmanHero",
      "/assets/characters/batman-spritesheet.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.load.spritesheet(
      "batmanThrow",
      "/assets/characters/batman-throw-spritesheet.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    this.load.spritesheet(
      "batarang",
      "/assets/characters/batarang-spritesheet.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
  }

  create() {
    this.largura = this.scale.width || DEFAULT_WIDTH;
    this.altura = this.scale.height || DEFAULT_HEIGHT;
    this.chaoY = this.altura - 48;

    this.cameras.main.setBackgroundColor("#050713");
    this.physics.world.setBounds(0, 0, this.largura, this.altura);

    this.mobileInput = {
      left: false,
      right: false,
      jump: false,
      attack: false,
    };

    this.faseConcluida = false;
    this.ultimoToqueMedo = 0;
    this.estaMachucado = false;
    this.estaAtacando = false;
    this.ultimoAtaque = -9999;
    this.recargaAtaque = 520;

    criarCenarioGotham(this);

    this.add
      .text(this.largura / 2, 36, "Fase 1: Enfrentando o Medo", {
        fontSize: "38px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .text(
        this.largura / 2,
        84,
        "Pule pelas plataformas, reúna os símbolos de coragem e enfrente os medos pelo caminho.",
        {
          fontSize: "20px",
          color: "#c7d2ff",
          fontFamily: "Arial",
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    criarPlataformas(this);
    this.criarAnimacoesHeroi();
    this.criarHeroi();
    this.criarSimbolos();
    this.criarMedos();
    this.criarFinalDaFase();

    this.batarangues = this.physics.add.group({
      allowGravity: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.attackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );

    this.coragem = 0;
    this.totalCoragem = 5;
    this.simbolosColetados = [];

    this.coragemText = this.add
      .text(34, 34, "Símbolos: 0/5", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setDepth(100);

    this.feedbackBox = this.add
      .rectangle(this.largura / 2, 126, 760, 44, 0x050713, 0.72)
      .setStrokeStyle(1, 0xf5c542, 0.35)
      .setVisible(false)
      .setDepth(99);

    this.feedbackText = this.add
      .text(this.largura / 2, 126, "", {
        fontSize: "20px",
        color: "#f5c542",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.mensagem = this.add
      .text(this.largura / 2, this.altura / 2, "", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: Math.min(950, this.largura - 160) },
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.physics.add.collider(this.player, this.plataformas);
    this.physics.add.collider(this.items, this.plataformas);
    this.physics.add.collider(this.sombras, this.plataformas);

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

    this.physics.add.overlap(
      this.batarangues,
      this.sombras,
      this.acertarMedo,
      null,
      this
    );

    if (this.deveExibirControlesMobile()) {
      this.criarControlesMobile();
    }
  }

  update(time) {
    atualizarCenarioGotham(this);
    this.atualizarBatarangues();
    this.atualizarSpriteAtaque();
    this.atualizarMedos(time);

    if (this.faseConcluida) {
      this.player.body.setVelocityX(0);
      this.tocarAnimacao("batman-idle");
      return;
    }

    if (this.estaMachucado) {
      return;
    }

    const atacando =
      Phaser.Input.Keyboard.JustDown(this.attackKey) || this.mobileInput.attack;

    if (atacando) {
      this.mobileInput.attack = false;
      this.atacar();
    }

    const velocidade = 285;
    const forcaPulo = -565;

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

    const estaNoChao = this.player.body.blocked.down;
    const estaAndando = Math.abs(this.player.body.velocity.x) > 5;

    if (!this.estaAtacando) {
      if (!estaNoChao) {
        this.tocarAnimacao("batman-jump");
      } else if (estaAndando) {
        this.tocarAnimacao("batman-walk");
      } else {
        this.tocarAnimacao("batman-idle");
      }
    }
  }

  tocarAnimacao(nomeAnimacao) {
    if (this.player.anims.currentAnim?.key === nomeAnimacao) {
      return;
    }

    this.player.anims.play(nomeAnimacao, true);
  }

  criarAnimacoesHeroi() {
    this.criarAnimacaoSeNaoExistir({
      key: "batman-idle",
      frames: this.anims.generateFrameNumbers("batmanHero", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "batman-walk",
      frames: this.anims.generateFrameNumbers("batmanHero", {
        start: 2,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "batman-jump",
      frames: this.anims.generateFrameNumbers("batmanHero", {
        start: 8,
        end: 9,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "batman-hurt",
      frames: this.anims.generateFrameNumbers("batmanHero", {
        start: 10,
        end: 10,
      }),
      frameRate: 1,
      repeat: 0,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "batman-throw",
      frames: [{ key: "batmanThrow", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "batarang-spin",
      frames: this.anims.generateFrameNumbers("batarang", {
        start: 0,
        end: 1,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  criarAnimacaoSeNaoExistir(config) {
    if (!this.anims.exists(config.key)) {
      this.anims.create(config);
    }
  }

  atacar() {
    const agora = this.time.now;

    if (
      this.estaAtacando ||
      this.faseConcluida ||
      this.estaMachucado ||
      agora - this.ultimoAtaque < this.recargaAtaque
    ) {
      return false;
    }

    this.ultimoAtaque = agora;
    this.estaAtacando = true;

    const direcao = this.player.flipX ? -1 : 1;

    this.player.setVisible(false);

    this.batmanAtaque = this.add
      .sprite(this.player.x, this.player.y, "batmanThrow", 0)
      .setDisplaySize(88, 88)
      .setFlipX(direcao === -1)
      .setDepth(32);

    this.batmanAtaque.anims.play("batman-throw", true);

    this.time.delayedCall(105, () => {
      if (!this.faseConcluida && this.estaAtacando) {
        this.criarBatarangue(direcao);
      }
    });

    this.time.delayedCall(250, () => {
      this.finalizarAtaqueVisual();
    });

    return true;
  }

  atualizarSpriteAtaque() {
    if (!this.batmanAtaque || !this.estaAtacando) {
      return;
    }

    this.batmanAtaque.setPosition(this.player.x, this.player.y);
    this.batmanAtaque.setFlipX(this.player.flipX);
  }

  finalizarAtaqueVisual() {
    if (this.batmanAtaque) {
      this.batmanAtaque.destroy();
      this.batmanAtaque = null;
    }

    this.estaAtacando = false;
    this.player.setVisible(true);
  }

  criarBatarangue(direcao) {
    const batarangue = this.physics.add.sprite(
      this.player.x + direcao * 48,
      this.player.y - 8,
      "batarang",
      0
    );

    batarangue.direcao = direcao;

    batarangue.setDisplaySize(34, 34);
    batarangue.setFlipX(direcao === -1);
    batarangue.setDepth(50);

    batarangue.body.setAllowGravity(false);
    batarangue.body.setSize(26, 26);
    batarangue.body.setOffset(19, 19);
    batarangue.body.setVelocity(direcao * 740, 0);

    batarangue.anims.play("batarang-spin", true);

    this.batarangues.add(batarangue);

    this.time.delayedCall(1700, () => {
      if (batarangue && batarangue.active) {
        batarangue.destroy();
      }
    });
  }

  atualizarBatarangues() {
    if (!this.batarangues) {
      return;
    }

    this.batarangues.getChildren().forEach((batarangue) => {
      if (!batarangue || !batarangue.active || !batarangue.body) {
        return;
      }

      batarangue.body.setAllowGravity(false);
      batarangue.body.setVelocity(batarangue.direcao * 740, 0);

      if (batarangue.x < -120 || batarangue.x > this.largura + 120) {
        batarangue.destroy();
      }
    });
  }

  acertarMedo(batarangue, sombra) {
    if (batarangue && batarangue.active) {
      batarangue.destroy();
    }

    if (sombra.partes) {
      sombra.partes.forEach((parte) => parte.destroy());
    }

    sombra.destroy();

    this.mostrarFeedback("Você enfrentou um medo.", "#f5c542");

    this.time.delayedCall(900, () => {
      if (!this.faseConcluida) {
        this.esconderFeedback();
      }
    });
  }

  criarHeroi() {
    this.player = this.physics.add.sprite(90, this.chaoY - 70, "batmanHero", 0);

    this.player.setDisplaySize(80, 80);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.03);
    this.player.setDepth(30);

    this.player.body.setSize(42, 62);
    this.player.body.setOffset(43, 60);

    this.tocarAnimacao("batman-idle");
  }

  criarSimbolos() {
    this.items = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const simbolos = [
      {
        nome: "Força",
        chave: "itemForca",
        mensagem: "Força encontrada. Continue avançando.",
      },
      {
        nome: "Calma",
        chave: "itemCalma",
        mensagem: "Calma recuperada. Respire e siga.",
      },
      {
        nome: "Confiança",
        chave: "itemConfianca",
        mensagem: "Confiança ativada. Você consegue.",
      },
      {
        nome: "Amor",
        chave: "itemAmor",
        mensagem: "Amor coletado. Ele ilumina o caminho.",
      },
      {
        nome: "Coragem",
        chave: "itemCoragem",
        mensagem: "Coragem reunida. Falta pouco.",
      },
    ];

    const posicoes = Phaser.Utils.Array.Shuffle([
      { x: this.largura * 0.2, y: this.chaoY - 168 },
      { x: this.largura * 0.45, y: this.chaoY - 262 },
      { x: this.largura * 0.68, y: this.chaoY - 162 },
      { x: this.largura * 0.86, y: this.chaoY - 292 },
      { x: this.largura * 0.95, y: this.chaoY - 78 },
    ]);

    simbolos.forEach(({ nome, chave, mensagem }, index) => {
      const { x, y } = posicoes[index];

      const brilho = this.add.circle(x, y, 30, 0xf5c542, 0.12).setDepth(23);

      const item = this.physics.add.sprite(x, y, chave);

      item.setDisplaySize(44, 44);
      item.setDepth(25);

      item.body.setAllowGravity(false);
      item.body.setImmovable(true);
      item.body.setSize(36, 36, true);

      item.nome = nome;
      item.mensagem = mensagem;
      item.partes = [brilho];

      this.tweens.add({
        targets: [brilho, item],
        y: "-=8",
        duration: 950,
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: brilho,
        scaleX: 1.15,
        scaleY: 1.15,
        alpha: 0.05,
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

    this.criarMedo({
      x: this.largura * 0.36,
      y: this.chaoY - 52,
      chave: "enemyMedo",
      alcance: 70,
      tamanho: 72,
    });

    this.criarMedo({
      x: this.largura * 0.56,
      y: this.chaoY - 258,
      chave: "enemyAgulha",
      alcance: 90,
      tamanho: 76,
    });

    this.criarMedo({
      x: this.largura * 0.78,
      y: this.chaoY - 154,
      chave: "enemyReceio",
      alcance: 80,
      tamanho: 72,
    });
  }

  criarMedo({ x, y, chave, alcance, tamanho }) {
    const aura = this.add.circle(x, y, 34, 0x7d35ff, 0.1).setDepth(18);

    const sombra = this.physics.add.sprite(x, y, chave);

    sombra.setDisplaySize(tamanho, tamanho);
    sombra.setDepth(20);

    sombra.body.setAllowGravity(false);
    sombra.body.setImmovable(true);
    sombra.body.setSize(42, 42, true);

    sombra.baseX = x;
    sombra.alcance = alcance;
    sombra.direcao = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    sombra.velocidade = Phaser.Math.Between(18, 34);
    sombra.proximaMudanca = this.time.now + Phaser.Math.Between(900, 1800);

    this.sombras.add(sombra);

    sombra.aura = aura;
    sombra.partes = [aura];

    this.tweens.add({
      targets: aura,
      scaleX: 1.16,
      scaleY: 1.16,
      alpha: 0.04,
      duration: 760,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: sombra,
      angle: 3,
      duration: 950,
      yoyo: true,
      repeat: -1,
    });
  }

  atualizarMedos(time) {
    if (!this.sombras || this.faseConcluida) {
      return;
    }

    this.sombras.getChildren().forEach((sombra) => {
      if (!sombra || !sombra.active || !sombra.body) {
        return;
      }

      if (time > sombra.proximaMudanca) {
        const opcoes = [-1, -1, 0, 1, 1];
        sombra.direcao = Phaser.Utils.Array.GetRandom(opcoes);
        sombra.proximaMudanca = time + Phaser.Math.Between(900, 1800);
      }

      if (sombra.x <= sombra.baseX - sombra.alcance) {
        sombra.direcao = 1;
      }

      if (sombra.x >= sombra.baseX + sombra.alcance) {
        sombra.direcao = -1;
      }

      sombra.body.setVelocityX(sombra.direcao * sombra.velocidade);

      if (sombra.aura) {
        sombra.aura.setPosition(sombra.x, sombra.y);
      }
    });
  }

  criarFinalDaFase() {
    const x = this.largura * 0.955;
    const y = this.chaoY - 74;

    this.portalFinal = this.physics.add.sprite(x, y, "gothamExit");

    this.portalFinal.setDisplaySize(78, 118);
    this.portalFinal.setDepth(15);

    this.portalFinal.body.setAllowGravity(false);
    this.portalFinal.body.setImmovable(true);
    this.portalFinal.body.setSize(58, 100, true);

    this.tweens.add({
      targets: this.portalFinal,
      alpha: 0.72,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });
  }

  mostrarFeedback(texto, cor = "#f5c542") {
    if (this.feedbackTimer) {
      this.feedbackTimer.remove(false);
    }

    this.feedbackBox.setVisible(true);
    this.feedbackText.setColor(cor);
    this.feedbackText.setText(texto);

    this.feedbackTimer = this.time.delayedCall(1500, () => {
      this.esconderFeedback();
    });
  }

  esconderFeedback() {
    this.feedbackBox.setVisible(false);
    this.feedbackText.setText("");
  }

  deveExibirControlesMobile() {
    const telaPequena = window.innerWidth <= 768;
    const toque = window.matchMedia("(pointer: coarse)").matches;

    return telaPequena || toque;
  }

  criarControlesMobile() {
    this.criarBotaoControle(100, this.altura - 92, "←", "left");
    this.criarBotaoControle(180, this.altura - 92, "→", "right");
    this.criarBotaoControle(this.largura - 180, this.altura - 92, "X", "attack");
    this.criarBotaoControle(this.largura - 100, this.altura - 92, "↑", "jump");

    this.input.on("pointerup", () => {
      this.pararMovimentoMobile();
    });
  }

  criarBotaoControle(x, y, texto, direcao) {
    const botao = this.add
      .circle(x, y, 32, 0xffffff, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.35)
      .setInteractive()
      .setDepth(100);

    const label = this.add
      .text(x, y, texto, {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(101);

    const ativar = () => {
      if (direcao === "jump") {
        this.mobileInput.jump = true;
        return;
      }

      if (direcao === "attack") {
        this.mobileInput.attack = true;
        return;
      }

      this.mobileInput[direcao] = true;
    };

    const desativar = () => {
      if (direcao !== "jump" && direcao !== "attack") {
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

    if (item.partes) {
      item.partes.forEach((parte) => parte.destroy());
    }

    item.destroy();

    this.simbolosColetados.push(nomeSimbolo);

    this.coragem += 1;
    this.coragemText.setText(`Símbolos: ${this.coragem}/${this.totalCoragem}`);

    this.mostrarFeedback(item.mensagem, "#f5c542");
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

    if (this.estaAtacando) {
      this.finalizarAtaqueVisual();
    }

    this.estaMachucado = true;
    this.player.setVisible(true);

    this.cameras.main.shake(120, 0.006);
    this.tocarAnimacao("batman-hurt");
    this.player.body.setVelocityY(-260);

    this.mostrarFeedback("Você teve medo, mas continuou.", "#c7d2ff");

    this.time.delayedCall(500, () => {
      this.estaMachucado = false;
    });
  }

  tentarFinalizarFase() {
    if (this.faseConcluida) {
      return;
    }

    if (this.coragem < this.totalCoragem) {
      this.mostrarFeedback("Reúna todos os símbolos antes de sair.", "#f5c542");
      return;
    }

    this.faseConcluida = true;
    this.player.body.setVelocity(0);
    this.player.setVisible(true);
    this.tocarAnimacao("batman-idle");

    this.esconderFeedback();

    this.mensagem.setText(
      "Você atravessou a escuridão.\nReuniu força, calma, confiança, amor e coragem.\n\nMesmo quando sente medo, você continua.\nE isso me ensina muito."
    );

    this.time.delayedCall(3800, () => {
      this.game.events.emit("batman-complete");
    });
  }
}
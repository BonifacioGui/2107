import Phaser from "phaser";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./batman/constants";
import {
  criarCenarioGotham,
  atualizarCenarioGotham,
} from "./batman/background";
import { criarPlataformas } from "./batman/platforms";

const RECOMPENSAS_BATMAN = [
  {
    id: "trajetoria",
    key: "rewardCongressoCriminal",
    image: "/assets/rewards/real/congresso-criminal.jpg",
    titulo: "Trajetoria",
    legenda:
      "Ela aprende, cresce e se coloca no mundo. Isso tambem e coragem.",
  },
  {
    id: "tcc",
    key: "rewardTcc",
    image: "/assets/rewards/real/tcc-2.jpg",
    titulo: "TCC",
    legenda:
      "Mesmo quando o frio na barriga chega, ela senta, respira e entrega.",
  },
  {
    id: "faculdade",
    key: "rewardFaculdade",
    image: "/assets/rewards/real/nafaculdade.jpg",
    titulo: "Na faculdade",
    legenda:
      "Olhar atento, mente trabalhando. A coragem dela tambem mora no estudo.",
  },
  {
    id: "comeco",
    key: "rewardNossoComeco",
    image: "/assets/rewards/real/nosso-comeco.jpg",
    titulo: "Nosso comeco",
    legenda:
      "Antes de qualquer boss, ja existia esse lugar onde a gente escolheu ficar.",
  },
  {
    id: "percy",
    key: "rewardPercyReal",
    image: "/assets/rewards/real/percy-real.jpg",
    titulo: "Percy",
    legenda:
      "Todo heroi precisa de casa, colo e alguem que o veja com ternura.",
  },
];

const RECOMPENSA_BOSS = {
  key: "rewardEuELivia",
  image: "/assets/rewards/real/eu-e-livia.jpg",
  titulo: "Depois da escuridao",
  legenda:
    "No fim da fase, nao e sobre vencer sozinho. E sobre voltar para o que faz tudo valer a pena.",
};

const FOTOS_EXTRAS_BATMAN = [
  { key: "rewardLindona", image: "/assets/rewards/real/lindona.jpg" },
  { key: "rewardLiviaLinda", image: "/assets/rewards/real/livialinda.jpg" },
  { key: "rewardTccMesa", image: "/assets/rewards/real/tcc-1.jpg" },
  { key: "rewardViajando", image: "/assets/rewards/real/viajando.jpg" },
  { key: "rewardNoite", image: "/assets/rewards/real/noite.jpg" },
];

export default class BatmanScene extends Phaser.Scene {
  constructor() {
    super("BatmanScene");
  }

  preload() {
    this.load.image("gothamBackdrop", "/assets/backgrounds/gotham-user.jpg");
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

    [...RECOMPENSAS_BATMAN, RECOMPENSA_BOSS, ...FOTOS_EXTRAS_BATMAN].forEach(
      (foto) => {
        this.load.image(foto.key, foto.image);
      }
    );

    this.load.image("itemForca", "/assets/items/simbolo-forca.png");
    this.load.image("itemCalma", "/assets/items/simbolo-calma.png");
    this.load.image("itemConfianca", "/assets/items/simbolo-confianca.png");
    this.load.image("itemAmor", "/assets/items/simbolo-amor.png");
    this.load.image("itemCoragem", "/assets/items/simbolo-coragem.png");

    this.load.image("enemyMedo", "/assets/enemies/medo.png");
    this.load.image("enemyAgulha", "/assets/enemies/agulha.png");
    this.load.image("enemyReceio", "/assets/enemies/receio.png");

    this.load.spritesheet(
      "jokerBoss",
      "/assets/characters/joker-spritesheet-fixed-v2.png",
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );

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
    this.maxVidas = 3;
    this.vidas = this.maxVidas;
    this.bossDerrotado = false;
    this.faseDoBoss = false;
    this.ultimoDanoCoringa = -9999;
    this.raioColetaItem = 78;
    this.alcanceAcertoBatarangue = 76;
    this.alcanceAssistenciaBatarangue = 620;
    this.memoriaAtual = 0;
    Phaser.Math.RND.sow([`${Date.now()}-${Math.random()}`]);

    criarCenarioGotham(this);
    this.criarTexturasGeradas();
    this.criarAtmosferaHeroica();

    this.tituloFaseText = this.add
      .text(this.largura / 2, 34, "Fase 1: Enfrentando o Medo", {
        fontSize: "40px",
        color: "#ffffff",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#050713",
        strokeThickness: 6,
        shadow: { offsetX: 0, offsetY: 4, color: "#000000", blur: 8, fill: true },
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.objetivoFaseText = this.add
      .text(
        this.largura / 2,
        84,
        "Colete os simbolos de coragem. Depois, prepare o batarangue para o que vem.",
        {
          fontSize: "21px",
          color: "#e6ecff",
          fontFamily: "Trebuchet MS",
          stroke: "#050713",
          strokeThickness: 4,
          shadow: { offsetX: 0, offsetY: 3, color: "#000000", blur: 6, fill: true },
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
    this.prepararTrilhaGotham();

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
      .text(34, 34, "Simbolos: 0/5", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Trebuchet MS",
        stroke: "#050713",
        strokeThickness: 4,
      })
      .setDepth(100);

    this.vidasText = this.add
      .text(34, 66, this.formatarVidas(), {
        fontSize: "22px",
        color: "#ff6f91",
        fontFamily: "Trebuchet MS",
        stroke: "#050713",
        strokeThickness: 4,
      })
      .setDepth(100);

    this.bossVidaText = this.add
      .text(this.largura - 34, 34, "Coringa: 5/5", {
        fontSize: "22px",
        color: "#ffd166",
        fontFamily: "Trebuchet MS",
        stroke: "#050713",
        strokeThickness: 4,
      })
      .setOrigin(1, 0)
      .setDepth(100);

    this.bossBarBg = this.add
      .rectangle(this.largura - 34, 70, 180, 10, 0xffffff, 0.16)
      .setOrigin(1, 0)
      .setDepth(100);

    this.bossBarFill = this.add
      .rectangle(this.largura - 34, 70, 180, 10, 0xff5d8f, 0.92)
      .setOrigin(1, 0)
      .setDepth(101);

    this.bossVidaText.setVisible(false);
    this.bossBarBg.setVisible(false);
    this.bossBarFill.setVisible(false);

    this.feedbackBox = this.add
      .rectangle(this.largura / 2, 126, 760, 44, 0x050713, 0.72)
      .setStrokeStyle(1, 0xf5c542, 0.35)
      .setVisible(false)
      .setDepth(99);

    this.feedbackText = this.add
      .text(this.largura / 2, 126, "", {
        fontSize: "20px",
        color: "#f5c542",
        fontFamily: "Trebuchet MS",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.mensagem = this.add
      .text(this.largura / 2, this.altura / 2, "", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Trebuchet MS",
        stroke: "#050713",
        strokeThickness: 5,
        align: "center",
        wordWrap: { width: Math.min(950, this.largura - 160) },
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.itemCardBox = this.add
      .rectangle(this.largura / 2, this.altura - 102, 760, 126, 0x050713, 0.84)
      .setStrokeStyle(1, 0xf5c542, 0.46)
      .setVisible(false)
      .setDepth(104);

    this.itemCardPhotoFrame = this.add
      .rectangle(this.largura / 2 - 350, this.altura - 102, 152, 100, 0xf7f1df, 0.96)
      .setStrokeStyle(2, 0xf5c542, 0.6)
      .setVisible(false)
      .setDepth(105);

    this.itemCardPhoto = this.add
      .image(this.largura / 2 - 350, this.altura - 102, RECOMPENSAS_BATMAN[0].key)
      .setDisplaySize(138, 86)
      .setVisible(false)
      .setDepth(106);

    this.itemCardKicker = this.add
      .text(this.largura / 2, this.altura - 136, "", {
        fontSize: "13px",
        color: "#f5c542",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(106);

    this.itemCardTitle = this.add
      .text(this.largura / 2, this.altura - 108, "", {
        fontSize: "22px",
        color: "#ffe08a",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(105);

    this.itemCardText = this.add
      .text(this.largura / 2, this.altura - 76, "", {
        fontSize: "18px",
        color: "#edf0ff",
        fontFamily: "Trebuchet MS",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5)
      .setDepth(105);

    this.physics.add.collider(this.player, this.plataformas);
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
    this.atualizarAtmosferaHeroica(time);
    this.atualizarBatarangues();
    this.atualizarAcertosBatarangues();
    this.atualizarColetaAssistida();
    this.atualizarSpriteAtaque();
    this.atualizarMedos(time);
    this.atualizarCoringa(time);

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

    this.criarAnimacaoSeNaoExistir({
      key: "joker-idle-v2",
      frames: this.anims.generateFrameNumbers("jokerBoss", {
        start: 0,
        end: 3,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "joker-walk-v2",
      frames: this.anims.generateFrameNumbers("jokerBoss", {
        start: 4,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  criarAnimacaoSeNaoExistir(config) {
    if (!this.anims.exists(config.key)) {
      this.anims.create(config);
    }
  }

  criarTexturasGeradas() {
    if (this.textures.exists("jokerBoss")) {
      return;
    }

    const grafico = this.make.graphics({ x: 0, y: 0, add: false });

    grafico.fillStyle(0x18111f, 1);
    grafico.fillRect(38, 68, 52, 44);
    grafico.fillStyle(0x582b7f, 1);
    grafico.fillRect(30, 70, 22, 46);
    grafico.fillRect(76, 70, 22, 46);
    grafico.fillStyle(0xf2f2f2, 1);
    grafico.fillCircle(64, 48, 26);
    grafico.fillStyle(0x24b56a, 1);
    grafico.fillTriangle(36, 42, 52, 12, 62, 38);
    grafico.fillTriangle(52, 36, 70, 8, 78, 39);
    grafico.fillTriangle(72, 38, 96, 18, 88, 48);
    grafico.fillStyle(0x111111, 1);
    grafico.fillCircle(54, 45, 4);
    grafico.fillCircle(74, 45, 4);
    grafico.fillStyle(0xe93f74, 1);
    grafico.fillRect(52, 59, 24, 5);
    grafico.fillStyle(0xffd166, 1);
    grafico.fillRect(58, 76, 12, 20);
    grafico.generateTexture("jokerBoss", 128, 128);
    grafico.destroy();
  }

  criarAtmosferaHeroica() {
    this.luzesGotham = [];

    const feixe = this.add
      .triangle(
        this.largura * 0.2,
        142,
        -42,
        150,
        268,
        -84,
        350,
        88,
        0xf5c542,
        0.065
      )
      .setDepth(-22)
      .setBlendMode(Phaser.BlendModes.ADD);

    const sinal = this.add
      .circle(this.largura * 0.22, 110, 46, 0xf5c542, 0.1)
      .setStrokeStyle(2, 0xf5c542, 0.24)
      .setDepth(-21)
      .setBlendMode(Phaser.BlendModes.ADD);

    const letra = this.add
      .text(this.largura * 0.22, 110, "L", {
        fontSize: "34px",
        color: "#ffe08a",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#050713",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(-20);

    this.sinalHeroico = [feixe, sinal, letra];

    for (let i = 0; i < 26; i++) {
      const janela = this.add
        .rectangle(
          Phaser.Math.Between(40, this.largura - 40),
          Phaser.Math.Between(220, this.altura - 160),
          Phaser.Math.Between(8, 18),
          Phaser.Math.Between(10, 28),
          Phaser.Utils.Array.GetRandom([0xf5c542, 0xa8c7ff, 0xff6f91]),
          Phaser.Math.FloatBetween(0.08, 0.18)
        )
        .setDepth(-24);

      janela.baseAlpha = janela.alpha;
      janela.offset = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.luzesGotham.push(janela);
    }
  }

  atualizarAtmosferaHeroica(time) {
    if (this.sinalHeroico) {
      const pulso = 1 + Math.sin(time * 0.0012) * 0.025;
      this.sinalHeroico.forEach((item, index) => {
        item.setScale(index === 0 ? 1 : pulso);
      });
    }

    if (this.luzesGotham) {
      this.luzesGotham.forEach((janela) => {
        janela.setAlpha(
          janela.baseAlpha + Math.sin(time * 0.001 + janela.offset) * 0.035
        );
      });
    }

    if (this.memoriasMural) {
      this.memoriasMural.forEach((memoria, index) => {
        memoria.container.y =
          memoria.baseY + Math.sin(time * 0.0012 + index * 0.7) * 3;
      });
    }
  }

  criarMuralDeMemorias() {
    const posicoes = [
      { x: this.largura * 0.17, y: 188 },
      { x: this.largura * 0.34, y: 132 },
      { x: this.largura * 0.52, y: 184 },
      { x: this.largura * 0.7, y: 126 },
      { x: this.largura * 0.87, y: 180 },
    ];

    this.memoriasMural = RECOMPENSAS_BATMAN.map((recompensa, index) => {
      const pos = posicoes[index];
      const container = this.add.container(pos.x, pos.y).setDepth(7);
      const sombra = this.add.rectangle(8, 8, 142, 98, 0x000000, 0.28);
      const moldura = this.add
        .rectangle(0, 0, 142, 98, 0xf7f1df, 0.92)
        .setStrokeStyle(2, 0xf5c542, 0.24);
      const foto = this.add
        .image(0, -3, recompensa.key)
        .setDisplaySize(126, 78)
        .setAlpha(0.22)
        .setTint(0x293654);
      const cadeado = this.add.text(0, 0, "?", {
        fontSize: "34px",
        color: "#ffe08a",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#050713",
        strokeThickness: 5,
      }).setOrigin(0.5);
      const legenda = this.add
        .text(0, 54, recompensa.titulo, {
          fontSize: "12px",
          color: "#ffffff",
          fontFamily: "Trebuchet MS",
          stroke: "#050713",
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      container.add([sombra, moldura, foto, cadeado, legenda]);

      return {
        id: recompensa.id,
        recompensa,
        container,
        foto,
        cadeado,
        moldura,
        baseY: pos.y,
        desbloqueada: false,
      };
    });
  }

  desbloquearMemoria(recompensa) {
    const memoria = this.memoriasMural?.find((item) => item.id === recompensa.id);

    if (!memoria || memoria.desbloqueada) {
      return;
    }

    memoria.desbloqueada = true;
    memoria.foto.clearTint();

    this.tweens.add({
      targets: memoria.foto,
      alpha: 0.96,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 420,
      yoyo: true,
    });

    this.tweens.add({
      targets: memoria.cadeado,
      alpha: 0,
      y: "-=18",
      duration: 280,
    });

    memoria.moldura.setStrokeStyle(3, 0xf5c542, 0.72);
  }

  prepararTrilhaGotham() {
    this.trilhaAtivada = false;

    const ativar = () => this.iniciarTrilhaGotham();

    this.input.keyboard.once("keydown", ativar);
    this.input.once("pointerdown", ativar);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.pararTrilhaGotham());
  }

  iniciarTrilhaGotham() {
    if (this.trilhaAtivada || !this.sound?.context) {
      return;
    }

    const contexto = this.sound.context;
    this.trilhaAtivada = true;

    if (contexto.state === "suspended") {
      contexto.resume();
    }

    this.trilhaMaster = contexto.createGain();
    this.trilhaMaster.gain.value = 0.0001;
    this.trilhaMaster.connect(contexto.destination);

    this.tweens.addCounter({
      from: 0.0001,
      to: 0.12,
      duration: 1400,
      onUpdate: (tween) => {
        if (this.trilhaMaster) {
          this.trilhaMaster.gain.value = tween.getValue();
        }
      },
    });

    this.tocarCompassoGotham();
    this.trilhaTimer = this.time.addEvent({
      delay: 3600,
      loop: true,
      callback: () => this.tocarCompassoGotham(),
    });
  }

  tocarCompassoGotham() {
    if (!this.trilhaMaster || !this.sound?.context) {
      return;
    }

    const contexto = this.sound.context;
    const inicio = contexto.currentTime + 0.02;
    const notas = [146.83, 174.61, 220, 196, 174.61, 246.94];

    notas.forEach((freq, index) => {
      this.tocarNotaGotham(freq, inicio + index * 0.42, 0.34, "sine", 0.045);
      if (index % 2 === 0) {
        this.tocarNotaGotham(freq / 2, inicio + index * 0.42, 0.62, "triangle", 0.035);
      }
    });

    this.tocarNotaGotham(73.42, inicio, 1.6, "sine", 0.05);
    this.tocarNotaGotham(98, inicio + 1.8, 1.2, "sine", 0.04);
  }

  tocarNotaGotham(freq, inicio, duracao, tipo, volume) {
    const contexto = this.sound.context;
    const osc = contexto.createOscillator();
    const ganho = contexto.createGain();

    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, inicio);
    ganho.gain.setValueAtTime(0.0001, inicio);
    ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.04);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

    osc.connect(ganho);
    ganho.connect(this.trilhaMaster);
    osc.start(inicio);
    osc.stop(inicio + duracao + 0.05);
  }

  tocarAcordeRecompensa() {
    if (!this.sound?.context) {
      return;
    }

    if (!this.trilhaAtivada) {
      this.iniciarTrilhaGotham();
    }

    if (!this.trilhaMaster) {
      return;
    }

    const contexto = this.sound.context;
    const inicio = contexto.currentTime + 0.03;

    [261.63, 329.63, 392, 523.25].forEach((freq, index) => {
      this.tocarNotaGotham(freq, inicio + index * 0.045, 0.58, "sine", 0.045);
    });
  }

  pararTrilhaGotham() {
    if (this.trilhaTimer) {
      this.trilhaTimer.remove(false);
      this.trilhaTimer = null;
    }

    if (this.trilhaMaster) {
      this.trilhaMaster.disconnect();
      this.trilhaMaster = null;
    }
  }

  formatarVidas() {
    const coracoes = Array.from({ length: this.maxVidas }, (_, index) =>
      index < this.vidas ? "\u2665" : "\u2661"
    ).join(" ");

    return `Vidas: ${coracoes}`;
  }

  atualizarVidasText() {
    if (this.vidasText) {
      this.vidasText.setText(this.formatarVidas());
    }
  }

  atualizarVidaCoringa() {
    if (!this.chefeCoringa || !this.bossVidaText || !this.bossBarFill) {
      return;
    }

    const vida = Math.max(0, this.chefeCoringa.vida);
    const vidaMaxima = this.chefeCoringa.vidaMaxima;
    const proporcao = vida / vidaMaxima;

    this.bossVidaText.setText(
      vida > 0 ? `Coringa: ${vida}/${vidaMaxima}` : "Coringa derrotado"
    );

    this.bossBarFill.setDisplaySize(Math.max(0, 180 * proporcao), 10);
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

    batarangue.setDisplaySize(42, 42);
    batarangue.setFlipX(direcao === -1);
    batarangue.setDepth(50);

    batarangue.body.setAllowGravity(false);
    batarangue.body.setSize(48, 48);
    batarangue.body.setOffset(8, 8);
    batarangue.body.setVelocity(direcao * 740, 0);
    batarangue.jaAcertou = false;

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

      const alvo = this.encontrarAlvoBatarangue(batarangue);
      const velocidadeY = alvo
        ? Phaser.Math.Clamp((alvo.y - batarangue.y) * 2.2, -210, 210)
        : 0;

      batarangue.body.setAllowGravity(false);
      batarangue.body.setVelocity(batarangue.direcao * 760, velocidadeY);

      if (batarangue.x < -120 || batarangue.x > this.largura + 120) {
        batarangue.destroy();
      }
    });
  }

  encontrarAlvoBatarangue(batarangue) {
    const candidatos = [];

    if (this.faseDoBoss && this.chefeCoringa?.active) {
      candidatos.push(this.chefeCoringa);
    }

    if (this.sombras) {
      candidatos.push(
        ...this.sombras.getChildren().filter((sombra) => sombra?.active)
      );
    }

    return candidatos
      .filter((alvo) => {
        const distanciaFrontal = (alvo.x - batarangue.x) * batarangue.direcao;

        return (
          distanciaFrontal > 0 &&
          distanciaFrontal < this.alcanceAssistenciaBatarangue &&
          Math.abs(alvo.y - batarangue.y) < 230
        );
      })
      .sort((a, b) => Math.abs(a.x - batarangue.x) - Math.abs(b.x - batarangue.x))[0];
  }

  atualizarAcertosBatarangues() {
    if (!this.batarangues) {
      return;
    }

    this.batarangues.getChildren().forEach((batarangue) => {
      if (
        !batarangue ||
        !batarangue.active ||
        batarangue.jaAcertou ||
        !batarangue.body
      ) {
        return;
      }

      if (
        this.faseDoBoss &&
        this.chefeCoringa?.active &&
        this.batarangueTocaAlvo(batarangue, this.chefeCoringa, 94)
      ) {
        this.acertarCoringa(batarangue, this.chefeCoringa);
        return;
      }

      if (!this.sombras) {
        return;
      }

      const alvo = this.sombras
        .getChildren()
        .find(
          (sombra) =>
            sombra?.active && this.batarangueTocaAlvo(batarangue, sombra, 82)
        );

      if (alvo) {
        this.acertarMedo(batarangue, alvo);
      }
    });
  }

  batarangueTocaAlvo(batarangue, alvo, alcance) {
    const dx = Math.abs(batarangue.x - alvo.x);
    const dy = Math.abs(batarangue.y - alvo.y);

    return dx < alcance && dy < alcance * 0.82;
  }

  acertarMedo(batarangue, sombra) {
    if (!sombra || !sombra.active) {
      return;
    }

    if (batarangue?.jaAcertou) {
      return;
    }

    if (batarangue && batarangue.active) {
      batarangue.jaAcertou = true;
      batarangue.destroy();
    }

    sombra.vida -= 1;
    this.mostrarTextoFlutuante(sombra.x, sombra.y - 36, "DANO", "#ffe08a");

    if (sombra.vida > 0) {
      this.mostrarFeedback("O batarangue deu dano no medo.", "#f5c542");
      return;
    }

    if (sombra.partes) {
      sombra.partes.forEach((parte) => parte.destroy());
    }

    sombra.destroy();

    if (sombra.tipo === "agulha") {
      this.mostrarFeedback(
        "Agulha vencida. Ela sente medo, respira fundo e enfrenta mesmo assim.",
        "#ffd166"
      );
      this.mostrarTextoFlutuante(sombra.x, sombra.y - 64, "CORAGEM", "#ffd166");
    } else {
      this.mostrarFeedback("O batarangue venceu um medo.", "#f5c542");
    }

    this.time.delayedCall(900, () => {
      if (!this.faseConcluida) {
        this.esconderFeedback();
      }
    });
  }

  acertarCoringa(batarangue, coringa) {
    if (
      !this.faseDoBoss ||
      !this.chefeCoringa ||
      !this.chefeCoringa.active ||
      this.bossDerrotado
    ) {
      return;
    }

    const agora = this.time.now;

    if (agora - this.ultimoDanoCoringa < 180) {
      return;
    }

    if (batarangue?.jaAcertou) {
      return;
    }

    if (batarangue && batarangue.active) {
      batarangue.jaAcertou = true;
      batarangue.destroy();
    }

    this.ultimoDanoCoringa = agora;
    coringa = this.chefeCoringa;
    coringa.vida = Math.max(0, coringa.vida - 1);
    this.atualizarVidaCoringa();
    this.cameras.main.shake(90, 0.003);
    this.mostrarTextoFlutuante(coringa.x, coringa.y - 74, "-1", "#ffe08a");

    coringa.setTint(0xffffff);
    this.time.delayedCall(120, () => {
      if (coringa.active) {
        coringa.clearTint();
      }
    });

    if (coringa.vida <= 0) {
      this.derrotarCoringa();
      return;
    }

    this.mostrarFeedback("Batarangue acertou o Coringa!", "#ffd166");
  }

  mostrarTextoFlutuante(x, y, texto, cor) {
    const label = this.add
      .text(x, y, texto, {
        fontSize: "22px",
        color: cor,
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#050713",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.tweens.add({
      targets: label,
      y: y - 34,
      alpha: 0,
      duration: 620,
      onComplete: () => label.destroy(),
    });
  }

  derrotarCoringa() {
    this.bossDerrotado = true;

    if (this.chefeCoringa?.body) {
      this.chefeCoringa.body.setVelocity(0);
      this.chefeCoringa.body.enable = false;
    }

    if (this.coringaAura) {
      this.tweens.add({
        targets: this.coringaAura,
        alpha: 0,
        scaleX: 1.8,
        scaleY: 1.8,
        duration: 420,
        onComplete: () => this.coringaAura?.destroy(),
      });
    }

    if (this.coringaLabel) {
      this.coringaLabel.setText("Boss vencido");
    }

    this.tweens.add({
      targets: this.chefeCoringa,
      alpha: 0,
      y: "-=28",
      duration: 520,
      onComplete: () => this.chefeCoringa?.destroy(),
    });

    this.mostrarFeedback("Coringa derrotado. A saida abriu!", "#ffd166");
    this.tocarAcordeRecompensa();
    this.time.delayedCall(360, () => {
      this.mostrarCardItem({
        titulo: "Surpresa liberada",
        descricao:
          "A recompensa ficou guardada. Atravesse a saida para abrir o mural.",
      });
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
        nome: "Forca",
        chave: "itemForca",
        mensagem: "Forca encontrada: uma memoria acendeu em Gotham.",
        titulo: "Forca para seguir",
        descricao:
          "Ela aprende, aparece, participa, constrói trajetoria. A cidade fica menor que a vontade dela.",
        recompensa: RECOMPENSAS_BATMAN[0],
      },
      {
        nome: "Calma",
        chave: "itemCalma",
        mensagem: "Calma recuperada: uma memoria acendeu em Gotham.",
        titulo: "Calma na hora dificil",
        descricao:
          "No TCC, no frio na barriga, no olhar concentrado: ela respira e continua.",
        recompensa: RECOMPENSAS_BATMAN[1],
      },
      {
        nome: "Confianca",
        chave: "itemConfianca",
        mensagem: "Confianca ativada: uma memoria acendeu em Gotham.",
        titulo: "Confianca no caminho",
        descricao:
          "A faculdade tambem tem seus chefes. Ela enfrenta todos com esse olhar de quem esta construindo futuro.",
        recompensa: RECOMPENSAS_BATMAN[2],
      },
      {
        nome: "Amor",
        chave: "itemAmor",
        mensagem: "Amor coletado: uma memoria acendeu em Gotham.",
        titulo: "Nosso comeco",
        descricao:
          "O amor nao apaga o medo, mas lembra que existe um lugar para voltar.",
        recompensa: RECOMPENSAS_BATMAN[3],
      },
      {
        nome: "Coragem",
        chave: "itemCoragem",
        mensagem: "Coragem reunida: uma memoria acendeu em Gotham.",
        titulo: "O carinho que protege",
        descricao:
          "Percy entra como lembrete secreto: ate herois precisam de cuidado.",
        recompensa: RECOMPENSAS_BATMAN[4],
      },
    ];

    const posicoesBase = [
      { x: this.largura * 0.16, y: this.chaoY - 72 },
      { x: this.largura * 0.22, y: this.chaoY - 168 },
      { x: this.largura * 0.34, y: this.chaoY - 168 },
      { x: this.largura * 0.45, y: this.chaoY - 262 },
      { x: this.largura * 0.56, y: this.chaoY - 262 },
      { x: this.largura * 0.66, y: this.chaoY - 162 },
      { x: this.largura * 0.75, y: this.chaoY - 162 },
      { x: this.largura * 0.84, y: this.chaoY - 292 },
      { x: this.largura * 0.92, y: this.chaoY - 78 },
      { x: this.largura * 0.96, y: this.chaoY - 292 },
    ];

    const posicoes = Phaser.Utils.Array.Shuffle(posicoesBase)
      .slice(0, simbolos.length)
      .map((pos) => ({
        x: Phaser.Math.Clamp(
          pos.x + Phaser.Math.Between(-36, 36),
          86,
          this.largura - 70
        ),
        y: Phaser.Math.Clamp(
          pos.y + Phaser.Math.Between(-18, 18),
          124,
          this.chaoY - 70
        ),
      }));

    simbolos.forEach(({ nome, chave, mensagem, titulo, descricao, recompensa }, index) => {
      const { x, y } = posicoes[index];

      const brilho = this.add.circle(x, y, 38, 0xf5c542, 0.12).setDepth(23);
      const aro = this.add
        .circle(x, y, this.raioColetaItem, 0xffffff, 0)
        .setStrokeStyle(2, 0xf5c542, 0.16)
        .setDepth(22);

      const item = this.physics.add.sprite(x, y, chave);

      item.setDisplaySize(54, 54);
      item.setDepth(25);

      item.body.setAllowGravity(false);
      item.body.setImmovable(true);
      item.body.setSize(96, 96, true);

      item.nome = nome;
      item.mensagem = mensagem;
      item.titulo = titulo;
      item.descricao = descricao;
      item.recompensa = recompensa;
      item.raioColeta = this.raioColetaItem;
      item.coletado = false;
      item.partes = [brilho, aro];

      item.tweenFlutuacao = this.tweens.add({
        targets: [brilho, aro, item],
        y: "-=8",
        duration: 950,
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: [brilho, aro],
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
      tipo: "medo",
      alcance: 70,
      tamanho: 72,
    });

    this.criarMedo({
      x: this.largura * 0.56,
      y: this.chaoY - 258,
      chave: "enemyAgulha",
      tipo: "agulha",
      alcance: 90,
      tamanho: 76,
    });

    this.criarMedo({
      x: this.largura * 0.78,
      y: this.chaoY - 154,
      chave: "enemyReceio",
      tipo: "receio",
      alcance: 80,
      tamanho: 72,
    });
  }

  criarCoringa() {
    const x = this.largura * 0.9;
    const y = this.chaoY - 78;

    if (this.chefeCoringa?.active) {
      return;
    }

    this.chefeCoringa = this.physics.add.sprite(x, y, "jokerBoss");

    this.chefeCoringa.setDisplaySize(118, 118);
    this.chefeCoringa.setDepth(28);
    this.chefeCoringa.anims.play("joker-idle-v2", true);

    this.chefeCoringa.body.setAllowGravity(false);
    this.chefeCoringa.body.setImmovable(true);
    this.chefeCoringa.body.setSize(58, 78, true);

    this.chefeCoringa.baseX = x;
    this.chefeCoringa.alcance = 88;
    this.chefeCoringa.direcao = -1;
    this.chefeCoringa.velocidade = 118;
    this.chefeCoringa.vidaMaxima = 5;
    this.chefeCoringa.vida = this.chefeCoringa.vidaMaxima;

    this.coringaAura = this.add
      .circle(x, y, 58, 0xff2f7d, 0.1)
      .setDepth(18);

    this.coringaLabel = this.add
      .text(x, y - 72, "Coringa", {
        fontSize: "18px",
        color: "#ffd166",
        fontFamily: "Trebuchet MS",
      })
      .setOrigin(0.5)
      .setDepth(45);

    this.tweens.add({
      targets: this.coringaAura,
      scaleX: 1.18,
      scaleY: 1.18,
      alpha: 0.04,
      duration: 720,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.chefeCoringa,
      angle: 4,
      duration: 860,
      yoyo: true,
      repeat: -1,
    });

    this.physics.add.overlap(
      this.player,
      this.chefeCoringa,
      this.tocarMedo,
      null,
      this
    );

    this.physics.add.overlap(
      this.batarangues,
      this.chefeCoringa,
      this.acertarCoringa,
      null,
      this
    );

    this.atualizarVidaCoringa();
  }

  iniciarFaseCoringa() {
    if (this.faseDoBoss || this.bossDerrotado) {
      return;
    }

    this.faseDoBoss = true;
    this.ultimoDanoCoringa = -9999;

    this.limparMedosDaFase();

    this.player.setPosition(90, this.chaoY - 70);
    this.player.body.setVelocity(0);
    this.player.setVisible(true);
    this.tocarAnimacao("batman-idle");

    this.tituloFaseText.setText("Fase 1.2: O Boss da Coragem");
    this.objetivoFaseText.setText(
      "Sem itens agora: desvie do Coringa, mantenha distancia e acerte batarangues."
    );

    this.bossVidaText.setVisible(true);
    this.bossBarBg.setVisible(true);
    this.bossBarFill.setVisible(true);

    this.criarCoringa();
    this.mostrarFeedback(
      "Os simbolos abriram a arena. Agora o Coringa vai atras de voce!",
      "#ffd166"
    );
  }

  limparMedosDaFase() {
    if (!this.sombras) {
      return;
    }

    this.sombras.getChildren().forEach((sombra) => {
      if (sombra?.partes) {
        sombra.partes.forEach((parte) => parte.destroy());
      }

      if (sombra?.active) {
        sombra.destroy();
      }
    });

    this.sombras.clear(true, true);
  }

  criarMedo({ x, y, chave, alcance, tamanho, tipo = "medo" }) {
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
    sombra.vida = 1;
    sombra.tipo = tipo;

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

  atualizarCoringa() {
    const coringa = this.chefeCoringa;

    if (
      !this.faseDoBoss ||
      !coringa ||
      !coringa.active ||
      !coringa.body ||
      this.bossDerrotado
    ) {
      return;
    }

    const dx = this.player.x - coringa.x;
    const dy = this.player.y - coringa.y;
    const distancia = Math.max(1, Math.hypot(dx, dy));
    const vidaPerdida = coringa.vidaMaxima - coringa.vida;
    const velocidade = coringa.velocidade + vidaPerdida * 12;

    coringa.body.setVelocity(
      (dx / distancia) * velocidade,
      (dy / distancia) * velocidade * 0.72
    );

    coringa.setFlipX(dx > 0);
    coringa.anims.play(Math.abs(dx) > 18 ? "joker-walk-v2" : "joker-idle-v2", true);
    coringa.y = Phaser.Math.Clamp(coringa.y, 116, this.chaoY - 66);

    if (this.coringaAura) {
      this.coringaAura.setPosition(coringa.x, coringa.y);
    }

    if (this.coringaLabel) {
      this.coringaLabel.setPosition(coringa.x, coringa.y - 72);
    }
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
    this.criarBotaoControle(100, this.altura - 92, "<", "left");
    this.criarBotaoControle(180, this.altura - 92, ">", "right");
    this.criarBotaoControle(this.largura - 180, this.altura - 92, "X", "attack");
    this.criarBotaoControle(this.largura - 100, this.altura - 92, "^", "jump");

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
        fontFamily: "Trebuchet MS",
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

  atualizarColetaAssistida() {
    if (!this.items || this.faseConcluida || this.faseDoBoss) {
      return;
    }

    this.items.getChildren().forEach((item) => {
      if (!item?.active || item.coletado) {
        return;
      }

      const distancia = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        item.x,
        item.y
      );

      if (distancia <= item.raioColeta) {
        this.coletarItem(this.player, item);
      }
    });
  }

  coletarItem(player, item) {
    if (!item?.active || item.coletado) {
      return;
    }

    item.coletado = true;
    const nomeSimbolo = item.nome;

    if (item.tweenFlutuacao) {
      item.tweenFlutuacao.stop();
    }

    if (item.partes) {
      item.partes.forEach((parte) => parte.destroy());
    }

    this.criarEfeitoColeta(item.x, item.y);
    item.destroy();

    this.simbolosColetados.push(nomeSimbolo);

    this.coragem += 1;
    this.coragemText.setText(`Simbolos: ${this.coragem}/${this.totalCoragem}`);

    this.mostrarFeedback(
      `${nomeSimbolo} guardada: um pedaco da surpresa ficou no cofre.`,
      "#f5c542"
    );
    if (item.recompensa) {
      this.tocarAcordeRecompensa();
    }
    this.mostrarCardItem(item);

    if (this.coragem === this.totalCoragem) {
      this.time.delayedCall(650, () => {
        this.iniciarFaseCoringa();
      });
    }
  }

  mostrarCardItem(item) {
    if (this.itemCardTimer) {
      this.itemCardTimer.remove(false);
    }

    this.itemCardBox.setVisible(true);
    this.itemCardPhotoFrame.setVisible(false);
    this.itemCardPhoto.setVisible(false);
    this.itemCardKicker.setText(item.nome ? "PISTA GUARDADA" : "RECOMPENSA");

    this.itemCardTitle.setText(
      item.nome ? `${item.nome} no cofre` : item.titulo || "Surpresa guardada"
    );
    this.itemCardText.setText(
      item.nome
        ? "A fase nao mostra tudo agora. Continue ate o fim para abrir a recompensa de verdade."
        : item.descricao || item.mensagem
    );

    this.itemCardBox.setAlpha(0);
    this.itemCardPhotoFrame.setAlpha(0);
    this.itemCardPhoto.setAlpha(0);
    this.itemCardKicker.setAlpha(0);
    this.itemCardTitle.setAlpha(0);
    this.itemCardText.setAlpha(0);

    this.tweens.add({
      targets: [
        this.itemCardBox,
        this.itemCardKicker,
        this.itemCardTitle,
        this.itemCardText,
      ],
      alpha: 1,
      duration: 180,
    });

    this.itemCardTimer = this.time.delayedCall(3400, () => {
      this.tweens.add({
        targets: [
          this.itemCardBox,
          this.itemCardKicker,
          this.itemCardTitle,
          this.itemCardText,
        ],
        alpha: 0,
        duration: 220,
        onComplete: () => {
          this.itemCardBox.setVisible(false);
          this.itemCardPhotoFrame.setVisible(false);
          this.itemCardPhoto.setVisible(false);
          this.itemCardKicker.setText("");
          this.itemCardTitle.setText("");
          this.itemCardText.setText("");
        },
      });
    });
  }

  criarEfeitoColeta(x, y) {
    for (let i = 0; i < 10; i++) {
      const brilho = this.add
        .circle(x, y, Phaser.Math.Between(3, 6), 0xf5c542, 0.9)
        .setDepth(90);

      this.tweens.add({
        targets: brilho,
        x: x + Phaser.Math.Between(-56, 56),
        y: y + Phaser.Math.Between(-54, 30),
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(420, 680),
        onComplete: () => brilho.destroy(),
      });
    }
  }

  tocarMedo(player, perigo) {
    if (this.faseConcluida) {
      return;
    }

    const agora = this.time.now;

    if (agora - this.ultimoToqueMedo < 700) {
      return;
    }

    this.ultimoToqueMedo = agora;
    this.vidas = Math.max(0, this.vidas - 1);
    this.atualizarVidasText();

    if (this.estaAtacando) {
      this.finalizarAtaqueVisual();
    }

    this.estaMachucado = true;
    this.player.setVisible(true);

    this.cameras.main.shake(120, 0.006);
    this.tocarAnimacao("batman-hurt");
    this.player.body.setVelocityY(-260);
    this.player.body.setVelocityX(perigo?.x < this.player.x ? 260 : -260);

    const mensagensDano =
      perigo?.tipo === "agulha"
        ? [
            "A agulha assusta, mas ela continua. Respira, Livia. Voce sempre atravessa.",
            "Esse medo nao manda nela. Ela sente, encara e segue.",
          ]
        : [
            "Continua. Ela ja passou por dias dificeis e seguiu mesmo assim.",
            "Respira e levanta. A coragem dela aparece justamente agora.",
            "Ela nao precisa estar sem medo para continuar. Ela continua com medo mesmo.",
          ];

    this.mostrarFeedback(Phaser.Utils.Array.GetRandom(mensagensDano), "#c7d2ff");

    if (this.vidas <= 0) {
      this.recomecarComResiliencia();
      return;
    }

    this.time.delayedCall(500, () => {
      this.estaMachucado = false;
    });
  }

  recomecarComResiliencia() {
    this.mostrarFeedback(
      "Coracoes restaurados. A coragem dela sempre encontra um jeito de continuar.",
      "#ffd166"
    );

    this.player.body.setVelocity(0);

    this.time.delayedCall(950, () => {
      if (this.faseConcluida) {
        return;
      }

      this.vidas = this.maxVidas;
      this.atualizarVidasText();
      this.estaMachucado = false;
      this.ultimoToqueMedo = this.time.now;
      this.player.setVisible(true);
      this.player.setPosition(90, this.chaoY - 70);
      this.tocarAnimacao("batman-idle");
    });
  }

  tentarFinalizarFase() {
    if (this.faseConcluida) {
      return;
    }

    if (this.coragem < this.totalCoragem) {
      this.mostrarFeedback("Reuna todos os simbolos antes de sair.", "#f5c542");
      return;
    }

    if (!this.bossDerrotado) {
      this.mostrarFeedback(
        "Use o batarangue para derrotar o Coringa antes de sair.",
        "#ffd166"
      );
      return;
    }

    this.faseConcluida = true;
    this.player.body.setVelocity(0);
    this.player.setVisible(true);
    this.tocarAnimacao("batman-idle");

    this.esconderFeedback();

    this.mensagem.setText(
      "Voce atravessou a escuridao.\nReuniu forca, calma, confianca, amor e coragem.\n\nMesmo quando sente medo, voce continua.\nE isso me ensina muito."
    );

    this.time.delayedCall(3800, () => {
      this.game.events.emit("batman-complete");
    });
  }
}

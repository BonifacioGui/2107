import Phaser from "phaser";

const HOUSE_WIDTH = 3200;
const BACKYARD_START_X = HOUSE_WIDTH;
const BACKYARD_WIDTH = 1200;
const WORLD_WIDTH = HOUSE_WIDTH + BACKYARD_WIDTH;
const WORLD_HEIGHT = 720;
const WALL_TOP = 92;
const WALL_HEIGHT = 500;
const FLOOR_Y = 592;
const FLOOR_HEIGHT = WORLD_HEIGHT - FLOOR_Y;
const WALK_Y = 556;
const WALK_MIN_Y = 532;
const WALK_MAX_Y = 574;
const PERCY_SIZE = 68;
const PERCY_DRAW_OFFSET_Y = 4;

const POSES_DEBUG_PERCY = [
  { frame: 0, label: "F0 parado" },
  { frame: 1, label: "F1 parado" },
  { frame: 2, label: "F2 andar" },
  { frame: 3, label: "F3 andar" },
  { frame: 4, label: "F4 andar" },
  { frame: 5, label: "F5 andar" },
  { frame: 6, label: "F6 sentado" },
  { frame: 7, label: "F7 sono" },
  { frame: 8, label: "F8 lingua" },
  { frame: 9, label: "F9 rosto" },
];

const MOMENTOS_PERCY = [
  {
    id: "carne",
    x: 320,
    y: 510,
    estado: "carne",
    titulo: "A carne que a mae da",
    texto:
      "Percy espera em silencio porque sabe: ela sempre lembra dele e sempre separa um carinho no pratinho.",
  },
  {
    id: "sofa",
    x: 760,
    y: 540,
    estado: "sofa",
    titulo: "Dono do sofa",
    texto:
      "Ele se ajeita devagar, fecha os olhos e transforma o sofa no centro do mundo.",
  },
  {
    id: "pai",
    x: 1240,
    y: 526,
    estado: "pai",
    titulo: "Soneca com o pai dela",
    texto:
      "No sofa, Percy se encaixa no colo do pai dela e transforma sono em protecao.",
  },
  {
    id: "cama",
    x: 2290,
    y: 536,
    estado: "cama",
    titulo: "O pulo para a cama",
    texto:
      "Ele calcula a distancia, pula com coragem e escolhe ficar pertinho dela.",
  },
  {
    id: "carinho",
    x: 1880,
    y: 536,
    estado: "carinho",
    titulo: "Linguinha para fora",
    texto:
      "Quando ela faz carinho, Percy esquece a pose e deixa escapar a linguinha.",
  },
  {
    id: "gatinhos",
    x: 2080,
    y: 532,
    estado: "gatinhos",
    titulo: "Os outros gatinhos",
    texto:
      "A casa tem mais patinhas, mais jeitos de pedir colo e uma pequena turma dividindo o mesmo aconchego.",
  },
  {
    id: "notebook",
    x: 2600,
    y: 528,
    estado: "notebook",
    titulo: "Assistindo juntinhos",
    texto:
      "Quando a tela acende, Percy nao quer entender o video. Ele quer ficar ali, dividindo o mesmo silencio com ela.",
  },
  {
    id: "familia",
    x: 3820,
    y: 528,
    estado: "familia",
    titulo: "A familia do quintal",
    texto:
      "Do outro lado da casa, Percy reencontra sua turma. Cada focinho conhecido lembra que amor tambem e ter para onde voltar.",
  },
];

const PRINCESS_X = 4260;
const PRINCESS_Y = 488;

export default class CatScene extends Phaser.Scene {
  constructor() {
    super("CatScene");
  }

  preload() {
    this.load.spritesheet(
      "percySpriteFixedV3",
      "/assets/characters/percy-spritesheet-fixed-v3.png",
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );

    this.load.spritesheet(
      "livinhaSprite",
      "/assets/characters/livinha-spritesheet.png",
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );

    this.load.spritesheet(
      "maeSprite",
      "/assets/characters/mae-spritesheet.png",
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );

    this.load.image("paiSleep", "/assets/characters/pai-sleep.png");
    this.load.image(
      "livinhaPrincesa",
      "/assets/characters/livinha-princesa-waiting.png"
    );
    this.load.image(
      "livinhaFinalCats",
      "/assets/characters/livinha-final-cats-hearts.png"
    );
    this.load.image(
      "livinhaPercyClose",
      "/assets/characters/livinha-percy-close.png"
    );
    this.load.image(
      "contemplativeHouse",
      "/assets/backgrounds/contemplative-house.png"
    );
    this.load.image(
      "percyBackyard",
      "/assets/backgrounds/percy-backyard.png"
    );

    const objetos = {
      wallBlue: "/assets/backgrounds/wall-blue.png",
      wallFloral: "/assets/backgrounds/wall-floral.png",
      wallYellow: "/assets/backgrounds/wall-yellow.png",
      floorPlank: "/assets/backgrounds/floor-plank.png",
      floorHerringbone: "/assets/backgrounds/floor-herringbone.png",
      windowCurtains: "/assets/objects/window-curtains.png",
      windowOpen: "/assets/objects/window-open.png",
      plantRoom: "/assets/objects/plant-room.png",
      bookshelfRoom: "/assets/objects/bookshelf-room.png",
      curtainRoom: "/assets/objects/curtain-room.png",
      coffeeTable: "/assets/objects/coffee-table.png",
      notebookPaused: "/assets/objects/notebook-livia-percy-6.png",
      paiPercySideSleep: "/assets/objects/pai-percy-side-sleep.png",
      tvRetro: "/assets/objects/tv-retro.png",
      sofaGray: "/assets/objects/sofa-gray.png",
      sofaRed: "/assets/objects/sofa-red.png",
      armchairRed: "/assets/objects/armchair-red.png",
      bedRedDouble: "/assets/objects/bed-red-double.png",
      bedRedSingle: "/assets/objects/bed-red-single.png",
      pinkRug: "/assets/objects/pink-rug.png",
      bedWood: "/assets/objects/bed-wood.png",
      meatPlate: "/assets/objects/meat-plate.png",
      meatBowl: "/assets/objects/meat-bowl.png",
      catEatingMeat: "/assets/objects/cat-eating-meat.png",
      percyEatingMeat: "/assets/objects/percy-eating-meat.png",
      floorLamp: "/assets/objects/floor-lamp.png",
      rugSmall: "/assets/objects/rug-small.png",
      catPicture: "/assets/objects/cat-picture.png",
      plantFofo: "/assets/objects/plant-fofo.png",
      catBlackWhiteCuddle: "/assets/cats/blackwhite-cuddle.png",
      catSiameseSit: "/assets/cats/siamese-sit-big.png",
    };

    Object.entries(objetos).forEach(([chave, caminho]) => {
      this.load.image(chave, caminho);
    });
  }

  create() {
    this.largura = this.scale.width;
    this.altura = this.scale.height;
    this.worldWidth = WORLD_WIDTH;
    this.worldHeight = WORLD_HEIGHT;
    this.faseConcluida = false;
    this.interacaoTravada = false;
    this.estadoGatinho = "idle";
    this.momentosVistos = new Set();
    this.momentoAtual = null;
    this.ultimoAvisoPrincesa = 0;
    this.percyPulando = false;
    this.percyJumpStart = 0;
    this.percyJumpDuration = 540;
    this.percyJumpHeight = 42;
    this.ultimoPuloPercy = -9999;

    this.cameras.main.setBackgroundColor("#1e1727");
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this.criarAnimacoesPersonagens();
    this.criarAmbienteContemplativo();
    this.criarPrincesaLivinha();
    this.criarPercy();
    this.criarMomentos();
    this.criarNarrativa();
    this.criarInteracoesPercy();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.poseToggleKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.poseDebugAtivo =
      new URLSearchParams(window.location.search).get("poses") === "1";

    if (this.poseDebugAtivo) {
      this.criarPainelPosesPercy();
    }

    this.prepararTrilhaCasa();

    this.cameras.main.startFollow(this.player, true, 0.045, 0.045);
    this.cameras.main.setDeadzone(300, 170);

    this.physics.add.overlap(
      this.player,
      this.momentos,
      this.entrarNoMomento,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.princessZone,
      this.tentarFinalizarPercy,
      null,
      this
    );

    this.mostrarNarrativa(
      "Percy, a casa e o quintal",
      "Passeie sem pressa pelos cantinhos. Depois da casa, o quintal guarda um reencontro muito especial."
    );
  }

  update(time) {
    this.atualizarParallax(time);
    this.atualizarPainelDebug();
    this.atualizarDicasMomentos();

    if (this.faseConcluida) {
      this.player.body.setVelocity(0);
      this.atualizarVisualPercy(time);
      return;
    }

    if (this.interacaoTravada) {
      this.player.body.setVelocity(0);
      this.atualizarVisualPercy(time);
      return;
    }

    const velocidade = 132;
    const velocidadeVertical = 54;

    this.player.body.setVelocity(0);

    const esquerda = this.cursors.left.isDown || this.keys.left.isDown;
    const direita = this.cursors.right.isDown || this.keys.right.isDown;
    const cima = this.cursors.up.isDown || this.keys.up.isDown;
    const baixo = this.cursors.down.isDown || this.keys.down.isDown;
    const pulo = Phaser.Input.Keyboard.JustDown(this.keys.jump);

    if (pulo) {
      this.pularPercy();
    }

    if (esquerda) {
      this.player.body.setVelocityX(-velocidade);
      this.ultimaDirecao = -1;
    } else if (direita) {
      this.player.body.setVelocityX(velocidade);
      this.ultimaDirecao = 1;
    }

    if (cima) {
      this.player.body.setVelocityY(-velocidadeVertical);
    } else if (baixo) {
      this.player.body.setVelocityY(velocidadeVertical);
    }

    this.player.y = Phaser.Math.Clamp(this.player.y, WALK_MIN_Y, WALK_MAX_Y);

    const andando =
      Math.abs(this.player.body.velocity.x) > 4 ||
      Math.abs(this.player.body.velocity.y) > 4;

    if (!this.momentoAtual) {
      this.estadoGatinho = andando ? "walk" : "idle";
    }

    this.atualizarVisualPercy(time);
  }

  criarAmbienteContemplativo() {
    this.add
      .rectangle(WORLD_WIDTH / 2, 360, WORLD_WIDTH, WORLD_HEIGHT, 0x121020)
      .setDepth(-60);
    this.windowGlows = [];
    this.criarCasaIlustrada();
    this.criarQuintal();
    this.criarLuzesAmbiente();
    this.criarCenasCasaIlustrada();
    this.criarPoeira();
  }

  criarCasaIlustrada() {
    const recortes = {
      cozinha: { x: 0, width: 620 },
      sala: { x: 620, width: 660 },
      quarto: { x: 1280, width: 590 },
    };
    const secoes = [
      { x: 0, width: 560, tipo: "cozinha" },
      { x: 560, width: 520, tipo: "sala" },
      { x: 1080, width: 560, tipo: "sala" },
      { x: 1640, width: 760, tipo: "quarto" },
      { x: 2400, width: 420, tipo: "sala" },
      { x: 2820, width: 380, tipo: "quarto" },
    ];
    const cropY = 76;
    const cropHeight = 680;
    const alturaCena = WORLD_HEIGHT - WALL_TOP;
    const sourceWidth = 1870;

    secoes.forEach((secao) => {
      const recorte = recortes[secao.tipo];
      const scaleX = secao.width / recorte.width;
      const scaleY = alturaCena / cropHeight;
      const imageX = secao.x - (recorte.x - sourceWidth / 2) * scaleX;
      const imagem = this.add
        .image(imageX, WALL_TOP + alturaCena / 2, "contemplativeHouse")
        .setCrop(recorte.x, cropY, recorte.width, cropHeight)
        .setScale(scaleX, scaleY)
        .setDepth(-50);

      imagem.tipoComodo = secao.tipo;
    });

    [560, 1080, 1640, 2400, 2820].forEach((x) => {
      this.add.rectangle(x, 360, 16, 536, 0x301c1a, 0.76).setDepth(-42);
      this.add.rectangle(x, FLOOR_Y - 4, 36, 18, 0x2a1817, 0.82).setDepth(-41);
    });

    this.add
      .rectangle(HOUSE_WIDTH / 2, WALL_TOP - 4, HOUSE_WIDTH, 12, 0x211313, 0.96)
      .setDepth(-40);
  }

  criarQuintal() {
    const centerX = BACKYARD_START_X + BACKYARD_WIDTH / 2;
    const backyard = this.add
      .image(centerX, 382, "percyBackyard")
      .setDisplaySize(BACKYARD_WIDTH, 675)
      .setDepth(-50);

    this.add
      .rectangle(BACKYARD_START_X + 8, 360, 18, 536, 0x2b1a18, 0.88)
      .setDepth(-39);
    this.add
      .rectangle(BACKYARD_START_X + 8, FLOOR_Y - 4, 42, 18, 0x241512, 0.9)
      .setDepth(-38);

    this.add
      .text(BACKYARD_START_X + 86, 126, "O quintal", {
        fontSize: "19px",
        color: "#fff3c4",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#162035",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.familyGlow = this.add
      .ellipse(3820, 566, 250, 76, 0xffe39a, 0.025)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(9);

    this.tweens.add({
      targets: this.familyGlow,
      alpha: 0.085,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 2100,
      yoyo: true,
      repeat: -1,
    });

    backyard.setData("area", "quintal");
  }

  criarComodo({ x, width, tint, floorTint }) {
    const centerX = x + width / 2;

    this.add
      .rectangle(centerX, WALL_TOP + WALL_HEIGHT / 2, width, WALL_HEIGHT, tint, 0.94)
      .setDepth(-34);
    this.add
      .rectangle(centerX, WALL_TOP + 74, width, 118, 0xffffff, 0.06)
      .setDepth(-33);
    this.add
      .rectangle(centerX, FLOOR_Y - 126, width, 8, 0x5b3d48, 0.32)
      .setDepth(-30);
    this.criarPadraoParede(x, width);
    this.criarPiso(x, width, floorTint);

    this.add.rectangle(centerX, WALL_TOP - 8, width, 16, 0x1a1224, 0.95).setDepth(-18);
    this.add.rectangle(centerX, FLOOR_Y - 10, width, 18, 0x6f4d5e, 0.96).setDepth(-17);
    this.add.rectangle(centerX, FLOOR_Y + 4, width, 4, 0xffe0a1, 0.2).setDepth(-16);
    this.add.rectangle(centerX, WORLD_HEIGHT - 8, width, 16, 0x1b1324, 0.88).setDepth(-16);

  }

  criarPadraoParede(x, width) {
    for (let px = x + 42; px < x + width - 20; px += 74) {
      for (let py = WALL_TOP + 60; py < FLOOR_Y - 80; py += 84) {
        this.add.circle(px, py, 5, 0x3d2c3a, 0.08).setDepth(-31);
        this.add.circle(px + 12, py + 10, 3, 0xffffff, 0.05).setDepth(-31);
        this.add.rectangle(px - 12, py + 18, 22, 3, 0x3d2c3a, 0.06).setDepth(-31);
      }
    }
  }

  criarPiso(x, width, floorTint) {
    const centerX = x + width / 2;

    this.add
      .rectangle(centerX, FLOOR_Y + FLOOR_HEIGHT / 2, width, FLOOR_HEIGHT, floorTint, 0.94)
      .setDepth(-28);

    for (let y = FLOOR_Y + 18; y < WORLD_HEIGHT - 10; y += 28) {
      this.add.rectangle(centerX, y, width, 3, 0x4b2f27, 0.22).setDepth(-27);
    }

    for (let px = x + 28; px < x + width; px += 68) {
      this.add.rectangle(px, FLOOR_Y + FLOOR_HEIGHT / 2, 3, FLOOR_HEIGHT - 18, 0x4b2f27, 0.16).setDepth(-27);
    }
  }

  criarDivisoriasCasa() {
    const divisoes = [560, 1080, 1640, 2400, 2820];

    divisoes.forEach((x) => {
      this.add.rectangle(x, 342, 18, 500, 0x211827, 0.88).setDepth(-14);
      this.add.rectangle(x, 342, 5, 430, 0x775e72, 0.5).setDepth(-13);
      this.add.rectangle(x, FLOOR_Y - 8, 46, 18, 0x211827, 0.86).setDepth(-12);
      this.add.rectangle(x, FLOOR_Y - 30, 28, 54, 0x211827, 0.42).setDepth(-12);
    });
  }

  criarDetalhesDeCasa() {
    this.criarJanela(246, 228, "cozinha");
    this.criarJanela(786, 210, "sala");
    this.criarJanela(1378, 214, "quarto");
    this.add.image(2078, 214, "curtainRoom").setDisplaySize(142, 132).setDepth(-8);
    this.criarJanela(2586, 214, "filme");
    this.criarPorta(2890, 386);

    this.criarQuadroGato(676, 328, 0.92);
    this.criarQuadroGato(1890, 322, 0.96);
    this.criarQuadroGato(3024, 326, 0.88);

    this.add.image(326, 538, "coffeeTable").setDisplaySize(210, 112).setDepth(-5);
    this.add.image(236, 526, "bookshelfRoom").setDisplaySize(76, 104).setDepth(-5);
    this.add.image(426, 538, "tvRetro").setDisplaySize(70, 70).setDepth(-4);

    this.add.image(986, 444, "bookshelfRoom").setDisplaySize(104, 138).setDepth(-5);
    this.add.image(1738, 428, "bookshelfRoom").setDisplaySize(92, 126).setDepth(-5);
    this.add.image(2704, 448, "plantRoom").setDisplaySize(82, 110).setDepth(-5);
  }

  criarPorta(x, y) {
    const porta = this.add.container(x, y).setDepth(-7);
    const folha = this.add
      .rectangle(0, 16, 82, 146, 0x7b4935, 0.98)
      .setStrokeStyle(4, 0x2f2023, 0.92);
    const painelSuperior = this.add.rectangle(0, -22, 46, 50, 0x8fc0d7, 0.7);
    const painelInferior = this.add
      .rectangle(0, 42, 48, 54, 0x91583d, 0.96)
      .setStrokeStyle(2, 0x5f382d, 0.7);
    const brilho = this.add.rectangle(-10, -30, 8, 42, 0xffffff, 0.25);
    const macaneta = this.add.circle(26, 18, 4, 0xf2c66d, 0.96);
    const soleira = this.add.rectangle(0, 92, 102, 10, 0x4a3033, 0.92);

    porta.add([folha, painelSuperior, painelInferior, brilho, macaneta, soleira]);
  }

  criarQuadroGato(x, y, scale = 1) {
    const quadro = this.add.container(x, y).setDepth(-6).setScale(scale);
    const moldura = this.add
      .rectangle(0, 0, 70, 56, 0x7b5a66, 0.96)
      .setStrokeStyle(3, 0x2d2028, 0.88);
    const fundo = this.add.rectangle(0, 0, 54, 40, 0xf0b7c9, 0.95);
    const cabeca = this.add.circle(0, 3, 13, 0xf6c98e, 1);
    const orelhaA = this.add.triangle(-10, -8, 0, 10, 7, -8, 14, 10, 0xf6c98e);
    const orelhaB = this.add.triangle(10, -8, 0, 10, -7, -8, -14, 10, 0xf6c98e);
    const olhoA = this.add.circle(-5, 3, 2, 0x2a1c25, 1);
    const olhoB = this.add.circle(5, 3, 2, 0x2a1c25, 1);
    const focinho = this.add.rectangle(0, 9, 8, 2, 0x2a1c25, 0.7);

    quadro.add([moldura, fundo, orelhaA, orelhaB, cabeca, olhoA, olhoB, focinho]);
  }

  criarJanela(x, y) {
    const glow = this.add
      .circle(x, y, 66, 0xffefbc, 0.014)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(-11);
    glow.baseAlpha = 0.014;
    glow.offset = Phaser.Math.FloatBetween(0, Math.PI * 2);
    this.windowGlows.push(glow);

    this.add.rectangle(x, y, 170, 116, 0x14263b, 0.95).setDepth(-10);
    this.add.rectangle(x, y, 132, 78, 0x46708c, 0.86).setDepth(-9);
    this.add.rectangle(x, y, 7, 116, 0x1c1523, 0.95).setDepth(-8);
    this.add.rectangle(x, y, 170, 7, 0x1c1523, 0.95).setDepth(-8);
    this.add.rectangle(x, y + 62, 190, 14, 0x5d3e46, 0.98).setDepth(-7);
  }

  criarLuzesAmbiente() {
    const luzes = [
      { x: 340, y: 260, r: 118, c: 0xffd28c, a: 0.014 },
      { x: 880, y: 248, r: 124, c: 0xd7ecff, a: 0.012 },
      { x: 1710, y: 252, r: 118, c: 0xffc5dc, a: 0.014 },
      { x: 2260, y: 252, r: 116, c: 0xffe6a3, a: 0.012 },
      { x: 3000, y: 250, r: 112, c: 0xffd1f3, a: 0.014 },
    ];

    this.luzes = luzes.map((luz) =>
      this.add
        .circle(luz.x, luz.y, luz.r, luz.c, luz.a)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(-9)
    );
  }

  criarAnimacoesPersonagens() {
    this.criarAnimacaoSeNaoExistir({
      key: "percy-idle",
      frames: this.anims.generateFrameNumbers("percySpriteFixedV3", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "percy-walk",
      frames: this.anims.generateFrameNumbers("percySpriteFixedV3", {
        start: 2,
        end: 5,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "percy-jump",
      frames: this.anims.generateFrameNumbers("percySpriteFixedV3", {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "livinha-idle",
      frames: this.anims.generateFrameNumbers("livinhaSprite", {
        start: 0,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.criarAnimacaoSeNaoExistir({
      key: "livinha-heart",
      frames: this.anims.generateFrameNumbers("livinhaSprite", {
        start: 7,
        end: 8,
      }),
      frameRate: 2,
      repeat: -1,
    });

  }

  criarAnimacaoSeNaoExistir(config) {
    if (!this.anims.exists(config.key)) {
      this.anims.create(config);
    }
  }

  criarCenasCasaIlustrada() {
    this.meatGlow = this.add
      .circle(326, 516, 56, 0xffd166, 0.032)
      .setDepth(2);
    this.add.image(190, 558, "meatPlate").setDisplaySize(82, 82).setDepth(5);
    this.add.image(482, 560, "meatBowl").setDisplaySize(74, 74).setDepth(5);
    this.maeSprite = this.add
      .sprite(346, WALK_Y - 60, "maeSprite", 0)
      .setDisplaySize(156, 188)
      .setDepth(8);
    this.tweens.add({
      targets: this.meatGlow,
      alpha: 0.065,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    this.add
      .image(1240, 520, "paiPercySideSleep")
      .setCrop(8, 40, 138, 126)
      .setDisplaySize(144, 132)
      .setDepth(7);

    this.livinhaCarinho = this.add
      .sprite(1838, WALK_Y - 34, "livinhaSprite", 8)
      .setDisplaySize(92, 116)
      .setDepth(7);
    this.livinhaCarinho.anims.play("livinha-heart", true);

    this.gatinhosCasa = [
      this.add.image(2078, 570, "catBlackWhiteCuddle").setDisplaySize(98, 84),
      this.add.image(2160, 566, "catSiameseSit").setDisplaySize(78, 88),
    ].map((gatinho) => gatinho.setDepth(8));

    this.notebookScene = this.add
      .image(2606, 524, "notebookPaused")
      .setCrop(8, 0, 252, 132)
      .setDisplaySize(246, 130)
      .setDepth(8);
  }

  criarMoveis() {
    this.add.ellipse(330, 584, 326, 48, 0x120c1f, 0.22).setDepth(1);
    this.meatGlow = this.add
      .circle(326, 508, 56, 0xffd166, 0.032)
      .setDepth(2);
    this.add.image(188, 558, "meatPlate").setDisplaySize(90, 90).setDepth(5);
    this.add.image(486, 562, "meatBowl").setDisplaySize(82, 82).setDepth(5);
    this.maeSprite = this.add
      .sprite(346, WALK_Y - 60, "maeSprite", 0)
      .setDisplaySize(156, 188)
      .setDepth(8);
    this.tweens.add({
      targets: this.meatGlow,
      alpha: 0.065,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    this.add.image(752, 574, "pinkRug").setDisplaySize(330, 118).setTint(0xf0d7d8).setDepth(2);
    this.add.ellipse(760, 588, 420, 48, 0x120c1f, 0.2).setDepth(1);
    this.add.image(622, 486, "plantRoom").setDisplaySize(88, 118).setDepth(3);
    this.add.image(760, 532, "sofaGray").setDisplaySize(322, 194).setDepth(4);
    this.add.image(760, 574, "coffeeTable").setDisplaySize(118, 64).setDepth(7);

    this.add.ellipse(1240, 588, 322, 46, 0x120c1f, 0.2).setDepth(1);
    this.add.image(1240, 540, "sofaGray").setDisplaySize(286, 170).setDepth(4);
    this.add
      .image(1248, 528, "paiPercySideSleep")
      .setCrop(8, 40, 138, 126)
      .setDisplaySize(150, 138)
      .setDepth(7);
    this.add.image(1396, 548, "floorLamp").setDisplaySize(72, 110).setDepth(6);

    this.add.ellipse(1768, 588, 190, 38, 0x120c1f, 0.16).setDepth(1);
    this.add.image(1768, 566, "armchairRed").setDisplaySize(78, 82).setDepth(4);

    this.add.image(1880, 574, "rugSmall").setDisplaySize(172, 102).setDepth(3);
    this.livinhaCarinho = this.add
      .sprite(1838, WALK_Y - 34, "livinhaSprite", 8)
      .setDisplaySize(92, 116)
      .setDepth(7);
    this.livinhaCarinho.anims.play("livinha-heart", true);
    this.add.image(1988, 516, "plantFofo").setDisplaySize(78, 100).setDepth(4);
    this.add.circle(1880, 514, 18, 0xffd1df, 0.38).setDepth(8);
    this.add.circle(1904, 494, 10, 0xffd1df, 0.28).setDepth(8);
    this.add.circle(1854, 494, 8, 0xffd1df, 0.22).setDepth(8);
    this.add.image(1810, 350, "catPicture").setDisplaySize(86, 72).setDepth(-5);

    this.add.image(1954, 448, "bookshelfRoom").setDisplaySize(116, 148).setDepth(3);
    this.gatinhosCasa = [
      this.add.image(2078, 570, "catBlackWhiteCuddle").setDisplaySize(98, 84),
      this.add.image(2160, 566, "catSiameseSit").setDisplaySize(78, 88),
    ].map((gatinho) => gatinho.setDepth(8));

    this.add.image(2290, 556, "bedRedSingle").setDisplaySize(170, 124).setDepth(4);
    this.add.image(2230, 570, "rugSmall").setDisplaySize(112, 76).setTint(0xdfe8f2).setDepth(3);

    this.add.ellipse(2600, 590, 344, 44, 0x120c1f, 0.2).setDepth(1);
    this.add.image(2510, 538, "sofaRed").setDisplaySize(172, 126).setDepth(3);
    this.add.image(2612, 556, "pinkRug").setDisplaySize(190, 106).setDepth(2);
    this.notebookScene = this.add
      .image(2606, 524, "notebookPaused")
      .setCrop(8, 0, 252, 132)
      .setDisplaySize(246, 130)
      .setDepth(8);
    this.add.image(2762, 548, "plantRoom").setDisplaySize(62, 84).setDepth(4);

    this.add.ellipse(PRINCESS_X, 590, 244, 38, 0x120c1f, 0.18).setDepth(1);
    this.add.image(PRINCESS_X, 568, "pinkRug").setDisplaySize(216, 94).setTint(0xffe0ef).setDepth(2);
    this.add.image(2898, 570, "floorLamp").setDisplaySize(78, 118).setDepth(6);
    this.add.image(3118, 552, "armchairRed").setDisplaySize(74, 80).setDepth(4);
  }

  criarPoeira() {
    this.poeiras = [];

    for (let i = 0; i < 42; i++) {
      const poeira = this.add
        .circle(
          Phaser.Math.Between(30, WORLD_WIDTH - 30),
          Phaser.Math.Between(120, 620),
          Phaser.Math.Between(1, 3),
          0xfff3d1,
          0.22
        )
        .setDepth(20);

      poeira.baseY = poeira.y;
      poeira.speed = Phaser.Math.FloatBetween(0.0005, 0.0012);
      poeira.offset = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.poeiras.push(poeira);
    }
  }

  criarPrincesaLivinha() {
    this.princesaGlow = this.add
      .circle(PRINCESS_X, PRINCESS_Y + 10, 82, 0xffd166, 0.025)
      .setDepth(18);

    this.livinha = this.add.container(PRINCESS_X, PRINCESS_Y).setDepth(35);

    this.livinhaPrincesaSprite = this.add
      .image(0, 0, "livinhaPrincesa")
      .setCrop(0, 8, 72, 99)
      .setDisplaySize(106, 146);
    this.livinhaFinalSprite = this.add
      .image(0, 0, "livinhaFinalCats")
      .setDisplaySize(210, 190)
      .setAlpha(0);

    this.livinha.add([this.livinhaPrincesaSprite, this.livinhaFinalSprite]);

    this.princessZone = this.add.zone(PRINCESS_X, 532, 230, 170);
    this.physics.add.existing(this.princessZone);
    this.princessZone.body.setAllowGravity(false);
    this.princessZone.body.setImmovable(true);
  }

  criarPercy() {
    this.player = this.add.rectangle(118, WALK_Y, 42, 34, 0xffffff, 0);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(42, 34);
    this.player.body.setOffset(0, 0);

    this.ultimaDirecao = 1;
    this.percyShadow = this.add
      .ellipse(118, WALK_Y + 28, 48, 12, 0x120c1f, 0.34)
      .setDepth(54);
    this.percySprite = this.add
      .sprite(118, WALK_Y + PERCY_DRAW_OFFSET_Y, "percySpriteFixedV3", 0)
      .setDisplaySize(PERCY_SIZE, PERCY_SIZE)
      .setDepth(60);
    this.percySprite.anims.play("percy-idle", true);
    this.catZzz = this.add.text(34, -54, "zzz", {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "Trebuchet MS",
      stroke: "#120c1f",
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.catZzz.setVisible(false);
  }

  criarMomentos() {
    this.momentos = this.physics.add.group();

    MOMENTOS_PERCY.forEach((momento) => {
      const zona = this.add.zone(momento.x, momento.y, 170, 118);
      this.physics.add.existing(zona);
      zona.body.setAllowGravity(false);
      zona.body.setImmovable(true);

      zona.momento = momento;
      zona.visitado = false;

      zona.glow = this.add
        .circle(momento.x, momento.y + 28, 30, 0xffd166, 0.02)
        .setStrokeStyle(1, 0xffd166, 0.1)
        .setDepth(12);
      zona.label = this.add
        .text(momento.x, momento.y - 74, "aproxime-se", {
          fontSize: "12px",
          color: "#fff3c4",
          fontFamily: "Trebuchet MS",
          stroke: "#120c1f",
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(30);

      this.tweens.add({
        targets: [zona.glow],
        scaleX: 1.08,
        scaleY: 1.08,
        alpha: 0.045,
        duration: 1800,
        yoyo: true,
        repeat: -1,
      });

      this.momentos.add(zona);
    });
  }

  criarNarrativa() {
    this.progressoText = this.add
      .text(this.largura - 28, 28, `memorias 0/${MOMENTOS_PERCY.length}`, {
        fontSize: "16px",
        color: "#fff3c4",
        fontFamily: "Trebuchet MS",
        stroke: "#120c1f",
        strokeThickness: 3,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(200);

    this.narrativaBox = this.add
      .rectangle(this.largura / 2, 54, 880, 74, 0x120c1f, 0.86)
      .setStrokeStyle(1, 0xffd166, 0.32)
      .setScrollFactor(0)
      .setDepth(180);
    this.narrativaTitulo = this.add
      .text(this.largura / 2, 34, "", {
        fontSize: "20px",
        color: "#ffe08a",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(181);
    this.narrativaTexto = this.add
      .text(this.largura / 2, 65, "", {
        fontSize: "15px",
        color: "#fff0fb",
        fontFamily: "Trebuchet MS",
        align: "center",
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(181);
  }

  criarInteracoesPercy() {
    this.percyInteractionUi = this.add
      .container(18, this.altura - 76)
      .setScrollFactor(0)
      .setDepth(230);

    const fundo = this.add
      .rectangle(0, 0, 344, 58, 0x120c1f, 0.72)
      .setOrigin(0)
      .setStrokeStyle(1, 0xffd166, 0.26);

    const titulo = this.add.text(14, 12, "Percy", {
      fontSize: "15px",
      color: "#ffe08a",
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
    });

    const botoes = [
      {
        x: 102,
        label: "Linguinha",
        onClick: () => this.mostrarPercyGrande("lingua"),
      },
      {
        x: 202,
        label: "Pular",
        onClick: () => this.pularPercy({ altura: 62, duracao: 620, forcar: true }),
      },
      {
        x: 292,
        label: "Soneca",
        onClick: () => this.mostrarPercyGrande("sono"),
      },
    ];

    this.percyInteractionUi.add([fundo, titulo]);

    botoes.forEach((botao) => {
      this.percyInteractionUi.add(
        this.criarBotaoInteracaoPercy(botao.x, 29, botao.label, botao.onClick)
      );
    });
  }

  criarBotaoInteracaoPercy(x, y, label, onClick) {
    const container = this.add.container(x, y);
    const fundo = this.add
      .rectangle(0, 0, label === "Linguinha" ? 92 : 76, 30, 0xffd166, 0.2)
      .setStrokeStyle(1, 0xffd166, 0.48)
      .setInteractive({ useHandCursor: true });
    const texto = this.add
      .text(0, 0, label, {
        fontSize: "13px",
        color: "#fff7dd",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    fundo.on("pointerover", () => {
      fundo.setFillStyle(0xffd166, 0.32);
    });
    fundo.on("pointerout", () => {
      fundo.setFillStyle(0xffd166, 0.2);
    });
    fundo.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      onClick();
    });

    container.add([fundo, texto]);
    return container;
  }

  criarOverlayPercyGrande() {
    this.percyPreviewOverlay = this.add
      .container(this.largura / 2, this.altura / 2)
      .setScrollFactor(0)
      .setDepth(360)
      .setVisible(false);

    const bloqueio = this.add
      .rectangle(0, 0, this.largura, this.altura, 0x050713, 0.64)
      .setInteractive({ useHandCursor: true });
    const painel = this.add
      .rectangle(0, 0, 430, 420, 0x120c1f, 0.94)
      .setStrokeStyle(2, 0xffd166, 0.4);
    const brilho = this.add
      .circle(0, -42, 120, 0xffd166, 0.07)
      .setBlendMode(Phaser.BlendModes.ADD);
    const sombra = this.add.ellipse(0, 102, 174, 32, 0x000000, 0.34);

    this.percyPreviewSprite = this.add
      .sprite(0, -24, "percySpriteFixedV3", 8)
      .setDisplaySize(286, 286);
    this.percyPreviewTitulo = this.add
      .text(0, -180, "", {
        fontSize: "25px",
        color: "#ffe08a",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.percyPreviewTexto = this.add
      .text(0, 164, "", {
        fontSize: "15px",
        color: "#fff0fb",
        fontFamily: "Trebuchet MS",
        align: "center",
        wordWrap: { width: 340 },
      })
      .setOrigin(0.5);

    const fecharFundo = this.add
      .circle(184, -184, 17, 0xfff8ec, 1)
      .setStrokeStyle(1, 0xffd166, 0.56)
      .setInteractive({ useHandCursor: true });
    const fecharTexto = this.add
      .text(184, -184, "X", {
        fontSize: "14px",
        color: "#20172b",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    bloqueio.on("pointerdown", () => this.esconderPercyGrande());
    fecharFundo.on("pointerdown", (pointer, localX, localY, event) => {
      event?.stopPropagation();
      this.esconderPercyGrande();
    });

    this.percyPreviewOverlay.add([
      bloqueio,
      painel,
      brilho,
      sombra,
      this.percyPreviewSprite,
      this.percyPreviewTitulo,
      this.percyPreviewTexto,
      fecharFundo,
      fecharTexto,
    ]);
  }

  mostrarPercyGrande(tipo = "lingua") {
    if (!this.percyPreviewOverlay) {
      this.criarOverlayPercyGrande();
    }

    const estados = {
      lingua: {
        frame: 8,
        titulo: "Linguinha do Percy",
        texto: "Quando ela faz carinho, Percy entrega o segredo: ele esta feliz.",
      },
      sono: {
        frame: 7,
        titulo: "Soneca do Percy",
        texto: "Ele dorme como quem sabe que esta seguro e muito amado.",
      },
      normal: {
        frame: 0,
        titulo: "Percy",
        texto: "Pequeno guardiao da casa, sempre por perto.",
      },
    };
    const estado = estados[tipo] ?? estados.normal;

    this.percyPreviewSprite.anims.stop();
    this.percyPreviewSprite.setFrame(estado.frame);
    this.percyPreviewSprite.setFlipX(false);
    this.percyPreviewTitulo.setText(estado.titulo);
    this.percyPreviewTexto.setText(estado.texto);
    this.percyPreviewOverlay.setVisible(true).setAlpha(0);

    this.tweens.add({
      targets: this.percyPreviewOverlay,
      alpha: 1,
      duration: 180,
      ease: "Sine.easeOut",
    });
  }

  esconderPercyGrande() {
    if (!this.percyPreviewOverlay) {
      return;
    }

    this.tweens.add({
      targets: this.percyPreviewOverlay,
      alpha: 0,
      duration: 150,
      ease: "Sine.easeIn",
      onComplete: () => this.percyPreviewOverlay.setVisible(false),
    });
  }

  criarPainelPosesPercy() {
    this.posePercySelecionada = POSES_DEBUG_PERCY[0];
    this.posePercyFlip = false;
    this.posePercyBotoes = [];

    this.posePercyPanel = this.add
      .container(24, 104)
      .setScrollFactor(0)
      .setDepth(320);

    const fundo = this.add
      .rectangle(0, 0, 420, 262, 0x120c1f, 0.9)
      .setOrigin(0)
      .setStrokeStyle(1, 0xffd166, 0.36);
    const titulo = this.add.text(18, 14, "Poses do Percy", {
      fontSize: "18px",
      color: "#ffe08a",
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
    });
    const ajuda = this.add.text(18, 40, "Use para printar o frame com erro.", {
      fontSize: "13px",
      color: "#fff0fb",
      fontFamily: "Trebuchet MS",
    });
    const palco = this.add
      .rectangle(316, 126, 170, 170, 0xffffff, 0.08)
      .setStrokeStyle(1, 0xffffff, 0.14);
    const sombra = this.add.ellipse(316, 188, 104, 24, 0x000000, 0.25);

    this.posePercyPreview = this.add
      .sprite(316, 124, "percySpriteFixedV3", 0)
      .setDisplaySize(146, 146);

    this.posePercyTexto = this.add
      .text(316, 218, "F0 parado | normal", {
        fontSize: "14px",
        color: "#ffffff",
        fontFamily: "Trebuchet MS",
        stroke: "#120c1f",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.posePercyPanel.add([
      fundo,
      titulo,
      ajuda,
      palco,
      sombra,
      this.posePercyPreview,
      this.posePercyTexto,
    ]);

    POSES_DEBUG_PERCY.forEach((pose, index) => {
      const x = 18 + (index % 2) * 92;
      const y = 76 + Math.floor(index / 2) * 30;

      this.posePercyPanel.add(this.criarBotaoPosePercy(x, y, pose));
    });

    this.posePercyPanel.add(
      this.criarBotaoControlePosePercy(18, 226, "Virar", () => {
        this.posePercyFlip = !this.posePercyFlip;
        this.atualizarPreviewPosePercy();
      })
    );

    this.posePercyPanel.add(
      this.criarBotaoControlePosePercy(112, 226, "Andar", () => {
        this.posePercySelecionada = {
          frame: 2,
          label: "Anim andar",
          animacao: "percy-walk",
        };
        this.atualizarPreviewPosePercy();
        this.atualizarBotoesPosePercy();
      })
    );

    this.atualizarBotoesPosePercy();
  }

  criarBotaoPosePercy(x, y, pose) {
    const container = this.add.container(x, y);
    const fundo = this.add
      .rectangle(0, 0, 82, 24, 0xffffff, 0.1)
      .setOrigin(0)
      .setStrokeStyle(1, 0xffffff, 0.22)
      .setInteractive({ useHandCursor: true });
    const texto = this.add
      .text(41, 12, `F${pose.frame}`, {
        fontSize: "13px",
        color: "#ffffff",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    fundo.on("pointerdown", () => {
      this.posePercySelecionada = pose;
      this.atualizarPreviewPosePercy();
      this.atualizarBotoesPosePercy();
    });

    container.add([fundo, texto]);
    container.pose = pose;
    container.fundo = fundo;
    this.posePercyBotoes.push(container);

    return container;
  }

  criarBotaoControlePosePercy(x, y, label, onClick) {
    const container = this.add.container(x, y);
    const fundo = this.add
      .rectangle(0, 0, 82, 26, 0xffd166, 0.2)
      .setOrigin(0)
      .setStrokeStyle(1, 0xffd166, 0.46)
      .setInteractive({ useHandCursor: true });
    const texto = this.add
      .text(41, 13, label, {
        fontSize: "13px",
        color: "#fff7dd",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    fundo.on("pointerdown", onClick);
    container.add([fundo, texto]);

    return container;
  }

  atualizarPreviewPosePercy() {
    if (this.posePercySelecionada.animacao) {
      this.posePercyPreview.anims.play(this.posePercySelecionada.animacao, true);
    } else {
      this.posePercyPreview.anims.stop();
      this.posePercyPreview.setFrame(this.posePercySelecionada.frame);
    }

    this.posePercyPreview.setFlipX(this.posePercyFlip);
    this.posePercyTexto.setText(
      `${this.posePercySelecionada.label} | ${
        this.posePercyFlip ? "virado" : "normal"
      }`
    );
  }

  atualizarBotoesPosePercy() {
    this.posePercyBotoes.forEach((botao) => {
      const selecionado =
        botao.pose.frame === this.posePercySelecionada.frame &&
        !this.posePercySelecionada.animacao;

      botao.fundo.setFillStyle(selecionado ? 0xffd166 : 0xffffff, selecionado ? 0.24 : 0.1);
      botao.fundo.setStrokeStyle(
        1,
        selecionado ? 0xffd166 : 0xffffff,
        selecionado ? 0.62 : 0.22
      );
    });
  }

  atualizarPainelDebug() {
    if (!this.poseToggleKey || !Phaser.Input.Keyboard.JustDown(this.poseToggleKey)) {
      return;
    }

    if (!this.posePercyPanel) {
      this.criarPainelPosesPercy();
      this.poseDebugAtivo = true;
      return;
    }

    this.poseDebugAtivo = !this.poseDebugAtivo;
    this.posePercyPanel.setVisible(this.poseDebugAtivo);
  }

  atualizarDicasMomentos() {
    if (!this.momentos || !this.player) {
      return;
    }

    this.momentos.getChildren().forEach((zona) => {
      if (!zona?.label || zona.visitado) {
        return;
      }

      const distancia = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        zona.x,
        zona.y
      );
      const alvo = distancia < 145 ? 0.46 : 0;

      zona.label.setAlpha(Phaser.Math.Linear(zona.label.alpha, alvo, 0.12));
    });
  }

  atualizarParallax(time) {
    if (this.windowGlows) {
      this.windowGlows.forEach((glow) => {
        glow.setAlpha(glow.baseAlpha + Math.sin(time * 0.00045 + glow.offset) * 0.008);
      });
    }

    this.luzes.forEach((luz, index) => {
      luz.x += Math.sin(time * 0.00025 + index) * 0.02;
    });

    this.poeiras.forEach((poeira) => {
      poeira.y = poeira.baseY + Math.sin(time * poeira.speed + poeira.offset) * 8;
      poeira.x += 0.03;

      if (poeira.x > WORLD_WIDTH + 20) {
        poeira.x = -20;
      }
    });
  }

  atualizarVisualPercy(time) {
    const x = this.player.x;
    const y = this.player.y;
    const dormindo = this.estadoGatinho === "sofa" || this.estadoGatinho === "pai";
    const andando = this.estadoGatinho === "walk";
    let puloT = 0;
    let jumpOffset = 0;

    if (this.percyPulando) {
      puloT = Phaser.Math.Clamp(
        (time - this.percyJumpStart) / this.percyJumpDuration,
        0,
        1
      );
      jumpOffset = -Math.sin(puloT * Math.PI) * this.percyJumpHeight;

      if (puloT >= 1) {
        this.percyPulando = false;
        this.percySprite.setAngle(0);
      }
    }

    const bob = andando ? Math.sin(time * 0.012) * 3 : Math.sin(time * 0.002) * 1.2;
    const shadowScale = this.percyPulando ? 1 - Math.sin(puloT * Math.PI) * 0.34 : 1;

    this.percyShadow.setPosition(x, y + 28);
    this.percyShadow.setScale(shadowScale, 1);
    this.percyShadow.setAlpha(this.percyPulando ? 0.22 : 0.34);
    this.percySprite.setPosition(x, y + bob + jumpOffset + PERCY_DRAW_OFFSET_Y);

    this.catZzz.setPosition(x + 28 * this.ultimaDirecao, y - 54 + bob);
    this.catZzz.setVisible(dormindo);

    if (this.percyPulando) {
      this.percySprite.setFlipX(this.ultimaDirecao < 0);
      this.percySprite.setAngle(Math.sin(puloT * Math.PI) * 4 * this.ultimaDirecao);
      this.tocarAnimacaoPercy("percy-jump");
      return;
    }

    if (andando) {
      this.percySprite.setAngle(0);
      this.percySprite.setFlipX(this.ultimaDirecao < 0);
      this.tocarAnimacaoPercy("percy-walk");
      return;
    }

    if (!this.momentoAtual && this.estadoGatinho === "idle") {
      this.percySprite.setAngle(0);
      this.percySprite.setFlipX(this.ultimaDirecao < 0);
      this.tocarAnimacaoPercy("percy-idle");
      return;
    }

    const estadosFrontais = new Set([
      "carne",
      "sofa",
      "pai",
      "carinho",
      "gatinhos",
      "notebook",
      "familia",
    ]);
    const framePorEstado = {
      carne: 6,
      sofa: 7,
      pai: 7,
      cama: 2,
      carinho: 6,
      gatinhos: 0,
      notebook: 0,
      familia: 0,
      idle: 0,
    };

    this.percySprite.anims.stop();
    this.percySprite.setAngle(0);
    this.percySprite.setFlipX(
      !estadosFrontais.has(this.estadoGatinho) && this.ultimaDirecao < 0
    );
    this.percySprite.setFrame(framePorEstado[this.estadoGatinho] ?? 0);
  }

  tocarAnimacaoPercy(nomeAnimacao) {
    if (this.percySprite.anims.currentAnim?.key === nomeAnimacao) {
      return;
    }

    this.percySprite.anims.play(nomeAnimacao, true);
  }

  pularPercy({ altura = 42, duracao = 540, forcar = false } = {}) {
    const agora = this.time.now;

    if (!forcar && agora - this.ultimoPuloPercy < 620) {
      return;
    }

    this.percyPulando = true;
    this.percyJumpStart = agora;
    this.percyJumpDuration = duracao;
    this.percyJumpHeight = altura;
    this.ultimoPuloPercy = agora;
    this.tocarSinoCasa();
    this.criarPoeiraPuloPercy();
  }

  criarPoeiraPuloPercy() {
    for (let i = 0; i < 5; i++) {
      const poeira = this.add
        .circle(
          this.player.x + Phaser.Math.Between(-18, 18),
          this.player.y + 28,
          Phaser.Math.Between(2, 4),
          0xffe7b0,
          0.34
        )
        .setDepth(52);

      this.tweens.add({
        targets: poeira,
        x: poeira.x + Phaser.Math.Between(-22, 22),
        y: poeira.y + Phaser.Math.Between(8, 22),
        alpha: 0,
        scale: 0.3,
        duration: 420,
        onComplete: () => poeira.destroy(),
      });
    }
  }

  prepararTrilhaCasa() {
    this.trilhaCasaAtivada = false;

    const ativar = () => this.iniciarTrilhaCasa();

    this.input.keyboard.once("keydown", ativar);
    this.input.once("pointerdown", ativar);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.pararTrilhaCasa());
  }

  iniciarTrilhaCasa() {
    if (this.trilhaCasaAtivada || !this.sound?.context) {
      return;
    }

    const contexto = this.sound.context;
    this.trilhaCasaAtivada = true;

    if (contexto.state === "suspended") {
      contexto.resume();
    }

    this.trilhaCasaMaster = contexto.createGain();
    this.trilhaCasaMaster.gain.value = 0.0001;
    this.trilhaCasaMaster.connect(contexto.destination);

    this.tweens.addCounter({
      from: 0.0001,
      to: 0.095,
      duration: 1600,
      onUpdate: (tween) => {
        if (this.trilhaCasaMaster) {
          this.trilhaCasaMaster.gain.value = tween.getValue();
        }
      },
    });

    this.tocarCompassoCasa();
    this.trilhaCasaTimer = this.time.addEvent({
      delay: 4200,
      loop: true,
      callback: () => this.tocarCompassoCasa(),
    });
  }

  tocarCompassoCasa() {
    if (!this.trilhaCasaMaster || !this.sound?.context) {
      return;
    }

    const contexto = this.sound.context;
    const inicio = contexto.currentTime + 0.02;
    const notas = [261.63, 329.63, 392, 329.63, 293.66, 349.23];

    notas.forEach((nota, index) => {
      this.tocarNotaCasa(nota, inicio + index * 0.52, 0.42, "sine", 0.032);
    });

    this.tocarNotaCasa(130.81, inicio, 2.3, "triangle", 0.018);
    this.tocarNotaCasa(196, inicio + 2.1, 1.8, "triangle", 0.014);
  }

  tocarNotaCasa(freq, inicio, duracao, tipo = "sine", volume = 0.03) {
    const contexto = this.sound?.context;

    if (!contexto || !this.trilhaCasaMaster) {
      return;
    }

    const oscilador = contexto.createOscillator();
    const ganho = contexto.createGain();

    oscilador.type = tipo;
    oscilador.frequency.setValueAtTime(freq, inicio);
    ganho.gain.setValueAtTime(0.0001, inicio);
    ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.08);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

    oscilador.connect(ganho);
    ganho.connect(this.trilhaCasaMaster);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracao + 0.04);
  }

  tocarSinoCasa() {
    if (!this.trilhaCasaAtivada || !this.sound?.context) {
      return;
    }

    const agora = this.sound.context.currentTime + 0.01;
    this.tocarNotaCasa(783.99, agora, 0.24, "triangle", 0.035);
    this.tocarNotaCasa(1046.5, agora + 0.08, 0.26, "sine", 0.018);
  }

  pararTrilhaCasa() {
    if (this.trilhaCasaTimer) {
      this.trilhaCasaTimer.remove(false);
      this.trilhaCasaTimer = null;
    }

    if (this.trilhaCasaMaster) {
      this.trilhaCasaMaster.disconnect();
      this.trilhaCasaMaster = null;
    }
  }

  entrarNoMomento(player, zona) {
    if (this.interacaoTravada || this.faseConcluida || zona.visitado) {
      return;
    }

    zona.visitado = true;
    zona.glow.setVisible(false);
    zona.label.setText("");
    zona.label.setColor("#bff5e8");

    const momento = zona.momento;
    this.momentoAtual = momento;
    this.estadoGatinho = momento.estado;
    this.momentosVistos.add(momento.id);
    this.progressoText.setText(
      `memorias ${this.momentosVistos.size}/${MOMENTOS_PERCY.length}`
    );
    this.interacaoTravada = true;
    this.player.body.setVelocity(0);

    this.mostrarNarrativa(momento.titulo, momento.texto);
    this.animarMomento(momento);

    this.time.delayedCall(1850, () => {
      this.momentoAtual = null;
      this.interacaoTravada = false;
      this.player.y = Phaser.Math.Clamp(this.player.y, WALK_MIN_Y, WALK_MAX_Y);

      if (this.momentosVistos.size === MOMENTOS_PERCY.length) {
        this.liberarPrincesa();
      }
    });
  }

  animarMomento(momento) {
    if (momento.estado === "carne") {
      this.tweens.add({
        targets: this.meatGlow,
        scaleX: 1.18,
        scaleY: 1.18,
        alpha: 0.075,
        duration: 520,
        yoyo: true,
      });

      this.tweens.add({
        targets: this.maeSprite,
        y: "-=8",
        duration: 420,
        yoyo: true,
      });
    }

    if (momento.estado === "cama") {
      this.pularPercy({ altura: 54, duracao: 680, forcar: true });
    }

    if (momento.estado === "carinho") {
      this.tweens.add({
        targets: this.livinhaCarinho,
        y: "-=8",
        duration: 520,
        yoyo: true,
      });

      this.tweens.add({
        targets: [this.percySprite],
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 420,
        yoyo: true,
      });
    }

    if (momento.estado === "gatinhos") {
      this.tweens.add({
        targets: this.gatinhosCasa,
        y: "-=8",
        duration: 420,
        yoyo: true,
        stagger: 80,
      });
    }

    if (momento.estado === "notebook") {
      this.tweens.add({
        targets: this.notebookScene,
        scaleX: 1.04,
        scaleY: 1.04,
        duration: 520,
        yoyo: true,
      });
    }

    if (momento.estado === "familia") {
      this.tweens.add({
        targets: this.familyGlow,
        alpha: 0.16,
        scaleX: 1.18,
        scaleY: 1.18,
        duration: 620,
        yoyo: true,
      });
      this.cameras.main.shake(180, 0.0007);
      this.tocarSinoCasa();
    }
  }

  liberarPrincesa() {
    this.princesaPronta = true;
    this.princesaGlow.setFillStyle(0xffd166, 0.14);
    this.mostrarNarrativa(
      "Casa e quintal viraram uma so lembranca",
      "Percy reencontrou sua familia de gatinhos. Agora Livinha espera por ele no fim do quintal."
    );
  }

  tentarFinalizarPercy() {
    if (this.faseConcluida) {
      return;
    }

    if (!this.princesaPronta) {
      const agora = this.time.now;

      if (agora - this.ultimoAvisoPrincesa > 1100) {
        this.ultimoAvisoPrincesa = agora;
        this.mostrarNarrativa(
          "Ainda tem caminho",
          "Percy quer chegar nela, mas antes precisa visitar a casa e encontrar sua familia no quintal."
        );
      }

      return;
    }

    this.faseConcluida = true;
    this.estadoGatinho = "carinho";
    this.player.body.setVelocity(0);
    this.atualizarVisualPercy(this.time.now);

    this.cameras.main.pan(PRINCESS_X, PRINCESS_Y, 1200, "Sine.easeInOut");
    this.tweens.add({
      targets: this.livinhaPrincesaSprite,
      alpha: 0,
      duration: 520,
    });
    this.tweens.add({
      targets: this.livinhaFinalSprite,
      alpha: 1,
      duration: 720,
      delay: 120,
    });
    this.tweens.add({
      targets: this.livinha,
      y: "-=12",
      duration: 650,
      yoyo: true,
      repeat: 2,
    });

    this.mostrarNarrativa(
      "Percy encontrou Livinha",
      "Sem pressa, sem susto. So carinho, cama quentinha e um lugar seguro para ficar."
    );

    this.time.delayedCall(4200, () => {
      this.game.events.emit("cat-complete");
    });
  }

  mostrarNarrativa(titulo, texto) {
    if (this.narrativaTimer) {
      this.narrativaTimer.remove(false);
    }

    this.narrativaBox.setAlpha(0);
    this.narrativaTitulo.setAlpha(0);
    this.narrativaTexto.setAlpha(0);

    this.narrativaTitulo.setText(titulo);
    this.narrativaTexto.setText(texto);

    this.tweens.add({
      targets: [this.narrativaBox, this.narrativaTitulo, this.narrativaTexto],
      alpha: 1,
      duration: 260,
    });

    this.narrativaTimer = this.time.delayedCall(4600, () => {
      if (this.faseConcluida) {
        return;
      }

      this.tweens.add({
        targets: [this.narrativaBox, this.narrativaTitulo, this.narrativaTexto],
        alpha: 0.82,
        duration: 360,
      });
    });
  }

}

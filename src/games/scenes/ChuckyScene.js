import Phaser from "phaser";

const WORLD_WIDTH = 4800;
const WORLD_HEIGHT = 720;
const FLOOR_Y = 612;
const BACKGROUND_SOURCE_HEIGHT = 841;

const MEMORIES = [
  {
    id: "foto",
    texture: "chuckyMemoryPhoto",
    x: 560,
    y: 505,
    size: 82,
    title: "Retrato antigo",
    text: "Nem todo susto precisa ficar grande. Alguns viram historia para rir depois.",
  },
  {
    id: "carta",
    texture: "chuckyMemoryLetter",
    x: 1290,
    y: 388,
    size: 88,
    title: "Carta guardada",
    text: "Mesmo quando treme um pouco, ela continua. Isso tambem e coragem.",
  },
  {
    id: "coracao",
    texture: "chuckyMemoryHeart",
    x: 2100,
    y: 515,
    size: 78,
    title: "Coracao aceso",
    text: "A luz dela nao apaga so porque o quarto ficou escuro.",
  },
  {
    id: "urso",
    texture: "chuckyMemoryBear",
    x: 3040,
    y: 382,
    size: 92,
    title: "Lugar seguro",
    text: "No meio do medo, sempre existe um cantinho para respirar.",
  },
  {
    id: "chave",
    texture: "chuckyMemoryKey",
    x: 3940,
    y: 512,
    size: 84,
    title: "Chave brilhando",
    text: "A saida aparece para quem insiste mais um pouquinho.",
  },
];

const SAFE_ZONES = [
  {
    x: 780,
    y: FLOOR_Y - 88,
    radius: 150,
    texture: "chuckySafeTent",
    glow: "chuckySafeGlow",
    width: 260,
    height: 180,
    name: "Cabana de luz",
  },
  {
    x: 2380,
    y: FLOOR_Y - 62,
    radius: 140,
    texture: "chuckySafePillows",
    glow: "chuckySafeGlow",
    width: 230,
    height: 104,
    name: "Almofadas seguras",
  },
  {
    x: 3550,
    y: FLOOR_Y - 72,
    radius: 128,
    texture: "chuckySafeSign",
    glow: "chuckySafeGlow",
    width: 210,
    height: 96,
    name: "Ponto seguro",
  },
];

const PLATFORM_SPECS = [
  {
    x: 520,
    y: 482,
    width: 360,
    height: 78,
    texture: "chuckyPlatformCrates",
    bodyWidth: 318,
    bodyHeight: 24,
  },
  {
    x: 1180,
    y: 408,
    width: 310,
    height: 108,
    texture: "chuckyPlatformTable",
    bodyWidth: 270,
    bodyHeight: 22,
  },
  {
    x: 1780,
    y: 525,
    width: 430,
    height: 78,
    texture: "chuckyPlatformShelf",
    bodyWidth: 378,
    bodyHeight: 24,
  },
  {
    x: 2350,
    y: 454,
    width: 360,
    height: 78,
    texture: "chuckyPlatformSmall",
    bodyWidth: 314,
    bodyHeight: 22,
  },
  {
    x: 2940,
    y: 392,
    width: 330,
    height: 98,
    texture: "chuckyPlatformRailing",
    bodyWidth: 288,
    bodyHeight: 22,
  },
  {
    x: 3510,
    y: 528,
    width: 460,
    height: 78,
    texture: "chuckyPlatformShelf",
    bodyWidth: 400,
    bodyHeight: 24,
  },
  {
    x: 4100,
    y: 450,
    width: 360,
    height: 82,
    texture: "chuckyPlatformCrates",
    bodyWidth: 318,
    bodyHeight: 24,
  },
];

const DECOR = [
  { texture: "chuckyDecorShelfTall", x: 250, y: FLOOR_Y - 105, w: 92, h: 160, depth: -4 },
  { texture: "chuckyDecorWindowMoon", x: 470, y: 160, w: 150, h: 205, depth: -12 },
  { texture: "chuckyDecorBoxes", x: 980, y: FLOOR_Y - 54, w: 130, h: 110, depth: -2 },
  { texture: "chuckyDecorTrain", x: 1480, y: FLOOR_Y - 32, w: 150, h: 54, depth: -2 },
  { texture: "chuckyDecorShelfWall", x: 1720, y: 245, w: 150, h: 92, depth: -8 },
  { texture: "chuckyDecorPictures", x: 2530, y: 195, w: 210, h: 118, depth: -8 },
  { texture: "chuckyDecorHorse", x: 2840, y: FLOOR_Y - 42, w: 110, h: 86, depth: -2 },
  { texture: "chuckyDecorJackbox", x: 3230, y: FLOOR_Y - 46, w: 88, h: 88, depth: -2 },
  { texture: "chuckyDecorWindowTree", x: 3860, y: 160, w: 92, h: 210, depth: -12 },
  { texture: "chuckyDecorDoor", x: 4460, y: FLOOR_Y - 118, w: 108, h: 205, depth: -2 },
];

const CAUGHT_MESSAGES = [
  "Foi so um susto. Respira e tenta de novo.",
  "O medo apareceu, mas nao venceu.",
  "Ela sempre continua, mesmo quando assusta.",
  "Respira. Um passo de cada vez.",
];

const GUI_RESCUE_X = WORLD_WIDTH - 430;
const GUI_RESCUE_Y = FLOOR_Y - 76;

export default class ChuckyScene extends Phaser.Scene {
  constructor() {
    super("ChuckyScene");
  }

  preload() {
    this.load.spritesheet(
      "livinhaSprite",
      "/assets/chucky/livia-rock-spritesheet.png",
      {
        frameWidth: 96,
        frameHeight: 96,
      }
    );

    this.load.spritesheet(
      "chuckySprite",
      "/assets/chucky/chucky-spritesheet.png",
      {
        frameWidth: 160,
        frameHeight: 140,
      }
    );

    this.load.spritesheet(
      "guiScaredSprite",
      "/assets/chucky/gui-scared-spritesheet.png",
      {
        frameWidth: 112,
        frameHeight: 112,
      }
    );

    this.load.image("chuckyBackground", "/assets/chucky/background.png");
    this.load.image("chuckyPlatformLong", "/assets/chucky/platform-long.png");
    this.load.image("chuckyPlatformRailing", "/assets/chucky/platform-railing.png");
    this.load.image("chuckyPlatformShelf", "/assets/chucky/platform-shelf.png");
    this.load.image("chuckyPlatformCrates", "/assets/chucky/platform-crates.png");
    this.load.image("chuckyPlatformTable", "/assets/chucky/platform-table.png");
    this.load.image("chuckyPlatformSmall", "/assets/chucky/platform-small.png");
    this.load.image("chuckyRugRunner", "/assets/chucky/rug-runner.png");
    this.load.image("chuckyDoorClosed", "/assets/chucky/door-closed.png");
    this.load.image("chuckyDoorOpen", "/assets/chucky/door-open.png");
    this.load.image("chuckyMemoryPhoto", "/assets/chucky/memory-photo.png");
    this.load.image("chuckyMemoryLetter", "/assets/chucky/memory-letter.png");
    this.load.image("chuckyMemoryHeart", "/assets/chucky/memory-heart.png");
    this.load.image("chuckyMemoryBear", "/assets/chucky/memory-bear.png");
    this.load.image("chuckyMemoryKey", "/assets/chucky/memory-key.png");
    this.load.image("chuckyLanternOn", "/assets/chucky/lantern-on.png");
    this.load.image("chuckyLanternSmall", "/assets/chucky/lantern-small.png");
    this.load.image("chuckyLightGlow", "/assets/chucky/light-glow.png");
    this.load.image("chuckySafeGlow", "/assets/chucky/safe-glow.png");
    this.load.image("chuckySafeTent", "/assets/chucky/safe-tent.png");
    this.load.image("chuckySafePillows", "/assets/chucky/safe-pillows.png");
    this.load.image("chuckySafeSign", "/assets/chucky/safe-sign.png");
    this.load.image("coupleHug", "/assets/chucky/couple-hug.png");
    this.load.image("coupleRescue", "/assets/chucky/couple-rescue.png");

    [
      ["chuckyDecorShelfTall", "decor-shelf-tall.png"],
      ["chuckyDecorShelfWall", "decor-shelf-wall.png"],
      ["chuckyDecorBoxes", "decor-boxes.png"],
      ["chuckyDecorDoor", "decor-door.png"],
      ["chuckyDecorWindowMoon", "decor-window-moon.png"],
      ["chuckyDecorWindowTree", "decor-window-tree.png"],
      ["chuckyDecorPictures", "decor-pictures.png"],
      ["chuckyDecorJackbox", "decor-jackbox.png"],
      ["chuckyDecorTrain", "decor-train.png"],
      ["chuckyDecorHorse", "decor-horse.png"],
    ].forEach(([key, file]) => {
      this.load.image(key, `/assets/chucky/${file}`);
    });
  }

  create() {
    this.largura = this.scale.width;
    this.altura = this.scale.height;
    this.worldWidth = WORLD_WIDTH;
    this.memoriesCollected = 0;
    this.totalMemories = MEMORIES.length;
    this.lives = 3;
    this.playerDirection = 1;
    this.flashlightCharge = 100;
    this.flashlightActive = false;
    this.flashlightCooldown = 0;
    this.checkpoint = { x: 110, y: FLOOR_Y - 78 };
    this.lastCaughtAt = -9999;
    this.levelComplete = false;
    this.guiSaved = false;
    this.rescueReady = false;
    this.lastGuiPromptAt = -9999;
    this.chuckyHunting = false;
    this.chuckyStunnedUntil = 0;
    this.chuckyHideAt = 0;
    this.nextScareAt = 3600;

    this.cameras.main.setBackgroundColor("#05030a");
    this.cameras.main.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);

    this.criarAnimacoes();
    this.criarCenario();
    this.criarPlataformas();
    this.criarZonasSeguras();
    this.criarLembrancas();
    this.criarPortaFinal();
    this.criarGuiAssustado();
    this.criarPersonagem();
    this.criarChucky();
    this.criarHud();
    this.criarControles();
    this.criarColisoes();
    this.prepararTrilhaChucky();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(290, 150);

    this.mostrarFeedback(
      "Luz baixa, brinquedos quietos e um susto tentando parecer maior do que e.",
      "#ffe8a3"
    );

    this.events.once("shutdown", this.desligarTrilhaChucky, this);
  }

  update(time, delta) {
    if (this.levelComplete) {
      return;
    }

    this.atualizarJogadora();
    this.atualizarLanterna(delta);
    this.atualizarChucky(time);
    this.atualizarZonasSeguras();
    this.atualizarSustosLeves(time);
    this.atualizarHud();
  }

  criarAnimacoes() {
    this.criarAnimacao({
      key: "chucky-idle",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "chucky-walk",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 2, end: 9 }),
      frameRate: 9,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "chucky-scare",
      frames: this.anims.generateFrameNumbers("chuckySprite", { frames: [10, 11] }),
      frameRate: 5,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "chucky-stun",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 12, end: 13 }),
      frameRate: 3,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-idle",
      frames: this.anims.generateFrameNumbers("livinhaSprite", { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-run",
      frames: this.anims.generateFrameNumbers("livinhaSprite", { start: 15, end: 19 }),
      frameRate: 10,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-flashlight",
      frames: this.anims.generateFrameNumbers("livinhaSprite", { start: 30, end: 34 }),
      frameRate: 7,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "gui-scared",
      frames: this.anims.generateFrameNumbers("guiScaredSprite", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
  }

  criarAnimacao(config) {
    if (!this.anims.exists(config.key)) {
      this.anims.create(config);
    }
  }

  criarCenario() {
    const scale = WORLD_HEIGHT / BACKGROUND_SOURCE_HEIGHT;
    this.background = this.add
      .tileSprite(0, 0, this.worldWidth, WORLD_HEIGHT, "chuckyBackground")
      .setOrigin(0)
      .setTileScale(scale)
      .setDepth(-60);

    this.add
      .tileSprite(0, FLOOR_Y + 10, this.worldWidth, 72, "chuckyPlatformLong")
      .setOrigin(0, 0.5)
      .setTileScale(0.72)
      .setDepth(2);

    for (let x = 170; x < this.worldWidth; x += 780) {
      this.add
        .image(x, FLOOR_Y + 8, "chuckyRugRunner")
        .setDisplaySize(280, 48)
        .setDepth(1)
        .setAlpha(0.78);
    }

    DECOR.forEach((item) => {
      this.add
        .image(item.x, item.y, item.texture)
        .setDisplaySize(item.w, item.h)
        .setDepth(item.depth);
    });

    this.flashlightBeam = this.add.graphics().setDepth(32);
    this.darkPulse = this.add
      .rectangle(0, 0, this.largura, this.altura, 0x000000, 0.15)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(58)
      .setVisible(false);

    this.chuckyPeek = this.add
      .sprite(0, 0, "chuckySprite", 10)
      .setDisplaySize(142, 124)
      .setDepth(25)
      .setVisible(false);
  }

  criarPlataformas() {
    this.platforms = this.physics.add.staticGroup();
    this.criarPlataforma(this.worldWidth / 2, FLOOR_Y + 36, this.worldWidth, 84);

    PLATFORM_SPECS.forEach((platform) => this.criarPlataformaVisual(platform));
  }

  criarPlataforma(x, y, width, height) {
    const body = this.add.zone(x, y, width, height);
    this.physics.add.existing(body, true);
    this.platforms.add(body);
    return body;
  }

  criarPlataformaVisual(platform) {
    const image = this.add
      .image(platform.x, platform.y, platform.texture)
      .setDisplaySize(platform.width, platform.height)
      .setDepth(5);
    const bodyY = platform.y - platform.height / 2 + 15;
    const body = this.add.zone(
      platform.x,
      bodyY,
      platform.bodyWidth,
      platform.bodyHeight
    );
    this.physics.add.existing(body, true);
    this.platforms.add(body);
    body.visual = image;
  }

  criarZonasSeguras() {
    this.safeZoneVisuals = SAFE_ZONES.map((zone) => {
      const glow = this.add
        .image(zone.x, FLOOR_Y - 22, zone.glow)
        .setDisplaySize(zone.radius * 1.9, zone.radius * 0.88)
        .setAlpha(0.48)
        .setDepth(6)
        .setBlendMode(Phaser.BlendModes.ADD);
      const asset = this.add
        .image(zone.x, zone.y, zone.texture)
        .setDisplaySize(zone.width, zone.height)
        .setDepth(11);

      this.tweens.add({
        targets: glow,
        alpha: 0.72,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 1180,
        yoyo: true,
        repeat: -1,
      });

      return { ...zone, glow, asset, activated: false };
    });
  }

  criarLembrancas() {
    this.memories = this.physics.add.staticGroup();

    MEMORIES.forEach((memory) => {
      const item = this.memories.create(memory.x, memory.y, memory.texture);
      item.setDisplaySize(memory.size, memory.size);
      item.setDepth(18);
      item.memory = memory;
      item.baseY = memory.y;
      item.refreshBody();

      this.add
        .image(memory.x, memory.y, "chuckyLightGlow")
        .setDisplaySize(memory.size * 1.65, memory.size * 1.05)
        .setAlpha(0.2)
        .setDepth(14)
        .setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
        targets: item,
        y: memory.y - 10,
        duration: 920,
        yoyo: true,
        repeat: -1,
      });
    });
  }

  criarPortaFinal() {
    this.exitDoor = this.physics.add.sprite(
      this.worldWidth - 156,
      FLOOR_Y - 130,
      "chuckyDoorClosed"
    );
    this.exitDoor.setDisplaySize(136, 240).setDepth(14);
    this.exitDoor.body.setAllowGravity(false);
    this.exitDoor.body.setImmovable(true);
    this.exitDoor.body.setSize(72, 202, true);
    this.exitDoor.open = false;

    this.exitGlow = this.add
      .image(this.exitDoor.x, this.exitDoor.y + 34, "chuckyLightGlow")
      .setDisplaySize(150, 190)
      .setDepth(12)
      .setAlpha(0.03)
      .setBlendMode(Phaser.BlendModes.ADD);
  }

  criarGuiAssustado() {
    this.guiAura = this.add
      .image(GUI_RESCUE_X, GUI_RESCUE_Y + 34, "chuckyLightGlow")
      .setDisplaySize(190, 150)
      .setAlpha(0.1)
      .setDepth(13)
      .setTint(0x8b5cf6)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.guiShadow = this.add
      .ellipse(GUI_RESCUE_X, FLOOR_Y + 3, 132, 30, 0x05030a, 0.62)
      .setDepth(12);

    this.guiRescue = this.physics.add.sprite(
      GUI_RESCUE_X,
      GUI_RESCUE_Y,
      "guiScaredSprite",
      0
    );
    this.guiRescue.setDisplaySize(118, 118).setDepth(22);
    this.guiRescue.body.setAllowGravity(false);
    this.guiRescue.body.setImmovable(true);
    this.guiRescue.body.setSize(54, 74);
    this.guiRescue.body.setOffset(29, 30);
    this.guiRescue.anims.play("gui-scared", true);

    this.guiPrompt = this.add
      .text(GUI_RESCUE_X, GUI_RESCUE_Y - 82, "muito assustado", {
        fontSize: "16px",
        color: "#ffcfdf",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(32);

    this.tweens.add({
      targets: [this.guiRescue, this.guiPrompt],
      y: "-=7",
      duration: 560,
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: this.guiAura,
      alpha: 0.22,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });
  }

  criarPersonagem() {
    this.player = this.physics.add.sprite(130, FLOOR_Y - 82, "livinhaSprite", 0);
    this.player.setDisplaySize(104, 104).setDepth(24);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(34, 58);
    this.player.body.setOffset(31, 30);
    this.player.anims.play("livinha-chucky-idle", true);
  }

  criarChucky() {
    this.chucky = this.physics.add.sprite(640, FLOOR_Y - 58, "chuckySprite", 0);
    this.chucky.setDisplaySize(136, 120).setDepth(23);
    this.chucky.body.setAllowGravity(false);
    this.chucky.body.setSize(56, 76);
    this.chucky.body.setOffset(52, 46);
    this.chucky.setVisible(false);
    this.chucky.body.enable = false;
  }

  criarHud() {
    this.hudShade = this.add
      .rectangle(0, 0, this.largura, 92, 0x05030a, 0.62)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(78);

    this.hudTitle = this.add
      .text(this.largura / 2, 28, "Capitulo: O Susto que Vira Risada", {
        fontSize: "28px",
        color: "#fff8e7",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(80);

    this.objectiveText = this.add
      .text(this.largura / 2, 64, "Pegue as lembrancas. Segure X ou F para acender a lanterna.", {
        fontSize: "17px",
        color: "#f5e7c8",
        fontFamily: "Trebuchet MS",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(80);

    this.counterText = this.add
      .text(28, 28, "", {
        fontSize: "18px",
        color: "#ffe8a3",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(80);

    this.lifeText = this.add
      .text(28, 56, "", {
        fontSize: "18px",
        color: "#ff8fab",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(80);

    this.chargeBack = this.add
      .rectangle(this.largura - 224, 42, 176, 14, 0xffffff, 0.14)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(80);
    this.chargeFill = this.add
      .rectangle(this.largura - 224, 42, 176, 14, 0xffe8a3, 0.9)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(81);
    this.chargeLabel = this.add
      .text(this.largura - 224, 62, "Lanterna", {
        fontSize: "13px",
        color: "#f5e7c8",
        fontFamily: "Trebuchet MS",
        stroke: "#05030a",
        strokeThickness: 3,
      })
      .setScrollFactor(0)
      .setDepth(80);

    this.feedbackBox = this.add
      .rectangle(this.largura / 2, this.altura - 76, 820, 76, 0x080613, 0.84)
      .setStrokeStyle(1, 0xffe8a3, 0.28)
      .setScrollFactor(0)
      .setDepth(78)
      .setVisible(false);
    this.feedbackText = this.add
      .text(this.largura / 2, this.altura - 76, "", {
        fontSize: "19px",
        color: "#fff8e7",
        fontFamily: "Trebuchet MS",
        align: "center",
        wordWrap: { width: 740 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(79);

    this.atualizarHud();
  }

  criarControles() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      flashlight: Phaser.Input.Keyboard.KeyCodes.X,
      flashlightAlt: Phaser.Input.Keyboard.KeyCodes.F,
    });
  }

  criarColisoes() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.memories, this.coletarLembranca, null, this);
    this.physics.add.overlap(this.player, this.exitDoor, this.tentarSair, null, this);
    this.physics.add.overlap(this.player, this.guiRescue, this.tentarSalvarGui, null, this);
    this.physics.add.overlap(this.player, this.chucky, this.serPegaPorChucky, null, this);
  }

  atualizarJogadora() {
    const speed = 300;
    const jump = -580;
    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.jump);

    this.player.body.setVelocityX(0);

    if (left) {
      this.player.body.setVelocityX(-speed);
      this.playerDirection = -1;
    } else if (right) {
      this.player.body.setVelocityX(speed);
      this.playerDirection = 1;
    }

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(jump);
    }

    const moving = Math.abs(this.player.body.velocity.x) > 5;
    const usingFlashlightPose =
      (this.keys.flashlight.isDown || this.keys.flashlightAlt.isDown) &&
      this.flashlightCharge > 2 &&
      this.time.now > this.flashlightCooldown;

    if (usingFlashlightPose) {
      this.player.setFlipX(this.playerDirection < 0);
      this.player.anims.play("livinha-chucky-flashlight", true);
      return;
    }

    this.player.setFlipX(this.playerDirection > 0);
    this.player.anims.play(moving ? "livinha-chucky-run" : "livinha-chucky-idle", true);
  }

  atualizarLanterna(delta) {
    const wantsLight = this.keys.flashlight.isDown || this.keys.flashlightAlt.isDown;
    const canLight = this.flashlightCharge > 2 && this.time.now > this.flashlightCooldown;
    this.flashlightActive = wantsLight && canLight;

    if (this.flashlightActive) {
      this.flashlightCharge = Math.max(0, this.flashlightCharge - delta * 0.045);
    } else {
      this.flashlightCharge = Math.min(100, this.flashlightCharge + delta * 0.018);
    }

    if (this.flashlightCharge <= 1) {
      this.flashlightCooldown = this.time.now + 620;
    }

    this.flashlightBeam.clear();
    if (!this.flashlightActive) {
      return;
    }

    const dir = this.playerDirection;
    const startX = this.player.x + dir * 28;
    const startY = this.player.y - 8;
    const endX = startX + dir * 430;

    this.flashlightBeam.fillStyle(0xffe8a3, 0.16);
    this.flashlightBeam.fillTriangle(startX, startY - 26, startX, startY + 26, endX, startY);
    this.flashlightBeam.fillStyle(0xfff3bf, 0.1);
    this.flashlightBeam.fillCircle(endX, startY, 88);
    this.flashlightBeam.lineStyle(2, 0xffe8a3, 0.2);
    this.flashlightBeam.strokeTriangle(startX, startY - 26, startX, startY + 26, endX, startY);

    this.tentarAfastarChuckyComLanterna();
  }

  tentarAfastarChuckyComLanterna() {
    if (!this.chuckyHunting || !this.chucky.visible || this.time.now < this.chuckyStunnedUntil) {
      return;
    }

    const dir = this.playerDirection;
    const ahead = dir > 0 ? this.chucky.x - this.player.x : this.player.x - this.chucky.x;
    const vertical = Math.abs(this.chucky.y - this.player.y);

    if (ahead > 0 && ahead < 470 && vertical < 125) {
      this.chuckyStunnedUntil = this.time.now + 2400;
      this.chucky.body.setVelocityX(0);
      this.chucky.anims.play("chucky-stun", true);
      this.mostrarTextoFlutuante(this.chucky.x, this.chucky.y - 58, "luz!", "#fff3bf");
      this.mostrarFeedback("A lanterna segurou o susto. Aproveita para respirar.", "#fff3bf");
    }
  }

  atualizarChucky(time) {
    if (!this.chuckyHunting || !this.chucky.visible) {
      return;
    }

    this.chucky.y = FLOOR_Y - 58;

    if (time >= this.chuckyHideAt) {
      this.esconderChucky("Ele sumiu... por enquanto.");
      return;
    }

    if (time < this.chuckyStunnedUntil) {
      this.chucky.body.setVelocityX(0);
      this.chucky.anims.play("chucky-stun", true);
      return;
    }

    if (this.jogadoraEmZonaSegura()) {
      this.chucky.body.setVelocityX(0);
      this.chucky.anims.play("chucky-idle", true);
      this.chucky.setAlpha(0.56);
      return;
    }

    this.chucky.setAlpha(1);
    const dx = this.player.x - this.chucky.x;
    const dir = Math.sign(dx) || 1;
    const speed = 92 + this.memoriesCollected * 18;
    this.chucky.body.setVelocityX(dir * speed);
    this.chucky.setFlipX(dir < 0);
    this.chucky.anims.play(Math.abs(dx) < 220 ? "chucky-scare" : "chucky-walk", true);
  }

  atualizarZonasSeguras() {
    const activeZone = this.safeZoneVisuals.find(
      (zone) => Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, FLOOR_Y - 42) < zone.radius
    );

    if (!activeZone) {
      this.lastSafeZone = null;
      return;
    }

    this.checkpoint = { x: activeZone.x, y: FLOOR_Y - 78 };
    this.lastSafeZone = activeZone;

    if (!activeZone.activated) {
      activeZone.activated = true;
      activeZone.glow.setAlpha(0.82);
      this.mostrarFeedback(`${activeZone.name}. Aqui o medo fica menor.`, "#ffe8a3");
    }
  }

  atualizarSustosLeves(time) {
    if (time < this.nextScareAt || this.levelComplete) {
      return;
    }

    this.nextScareAt = time + Phaser.Math.Between(5600, 8800);
    const cameraX = this.cameras.main.scrollX;
    const x = Phaser.Math.Clamp(
      cameraX + Phaser.Math.Between(420, 1260),
      240,
      this.worldWidth - 320
    );
    const y = Phaser.Math.Between(190, 280);

    this.chuckyPeek.setPosition(x, y).setVisible(true).setAlpha(0);
    this.chuckyPeek.setFrame(Phaser.Utils.Array.GetRandom([0, 1, 10, 11]));
    this.darkPulse.setVisible(true).setAlpha(0.2);

    this.tweens.add({
      targets: this.chuckyPeek,
      alpha: 0.95,
      y: y - 10,
      duration: 150,
      yoyo: true,
      hold: 360,
      onComplete: () => this.chuckyPeek.setVisible(false),
    });
    this.tweens.add({
      targets: this.darkPulse,
      alpha: 0,
      duration: 420,
      onComplete: () => this.darkPulse.setVisible(false),
    });
  }

  coletarLembranca(player, item) {
    if (!item.active) {
      return;
    }

    const memory = item.memory;
    item.disableBody(true, true);
    this.memoriesCollected += 1;
    this.criarEfeitoColeta(item.x, item.y, 0xffe8a3);
    this.mostrarFeedback(`${memory.title}. ${memory.text}`, "#fff3bf");

    if (this.memoriesCollected >= this.totalMemories) {
      this.abrirPortaFinal();
    } else {
      this.invocarChuckyPorSusto();
    }
  }

  invocarChuckyPorSusto() {
    const side = this.playerDirection >= 0 ? -1 : 1;
    const x = Phaser.Math.Clamp(
      this.player.x + side * Phaser.Math.Between(380, 560),
      180,
      this.worldWidth - 300
    );

    this.chucky.enableBody(false, x, FLOOR_Y - 58, true, true);
    this.chucky.body.enable = true;
    this.chucky.setVisible(true).setAlpha(1);
    this.chuckyHunting = true;
    this.chuckyHideAt = this.time.now + 6600 + this.memoriesCollected * 720;
    this.chuckyStunnedUntil = 0;
    this.chucky.anims.play("chucky-scare", true);
    this.mostrarFeedback("Corre, acende a lanterna ou acha uma luz segura.", "#ffcfdf");
  }

  esconderChucky(message) {
    this.chuckyHunting = false;
    this.chucky.body.setVelocity(0, 0);
    this.chucky.body.enable = false;
    this.tweens.add({
      targets: this.chucky,
      alpha: 0,
      duration: 240,
      onComplete: () => {
        this.chucky.setVisible(false).setAlpha(1);
      },
    });
    if (message) {
      this.mostrarFeedback(message, "#d8f3ff");
    }
  }

  serPegaPorChucky() {
    if (!this.chuckyHunting || this.time.now - this.lastCaughtAt < 1200) {
      return;
    }

    this.lastCaughtAt = this.time.now;
    this.lives -= 1;
    this.esconderChucky();
    this.cameras.main.shake(260, 0.006);
    this.criarEfeitoColeta(this.player.x, this.player.y, 0xff5d8f);

    if (this.lives <= 0) {
      this.lives = 3;
      this.mostrarFeedback("O susto foi grande... mas ela levanta e continua.", "#ffcfdf");
    } else {
      this.mostrarFeedback(Phaser.Utils.Array.GetRandom(CAUGHT_MESSAGES), "#ffcfdf");
    }

    this.player.setPosition(this.checkpoint.x, this.checkpoint.y);
    this.player.body.setVelocity(0, 0);
  }

  abrirPortaFinal() {
    this.rescueReady = true;
    this.exitDoor.open = true;
    this.exitDoor.setTexture("chuckyDoorOpen");
    this.exitGlow.setAlpha(0.34);
    this.guiAura.setTint(0xffe8a3).setAlpha(0.46);
    this.guiPrompt.setText("ela precisa te salvar");
    this.objectiveText.setText("A porta abriu, mas ele ainda esta assustado. Encontre-o.");
    this.mostrarFeedback("As lembrancas acenderam o caminho. Agora ela precisa te buscar no escuro.", "#fff3bf");
    this.esconderChucky();

    this.tweens.add({
      targets: this.exitGlow,
      alpha: 0.58,
      scaleX: 1.18,
      scaleY: 1.18,
      duration: 920,
      yoyo: true,
      repeat: -1,
    });
  }

  tentarSair() {
    if (this.levelComplete) {
      return;
    }

    if (!this.exitDoor.open) {
      this.mostrarFeedback("A porta ainda esta trancada. Faltam lembrancas.", "#ffd6a5");
      return;
    }

    if (!this.guiSaved) {
      this.mostrarFeedback("A saida abriu, mas ela nao vai embora sem te tirar do susto primeiro.", "#ffcfdf");
      return;
    }
  }

  tentarSalvarGui() {
    if (this.levelComplete || this.guiSaved) {
      return;
    }

    if (!this.rescueReady) {
      if (this.time.now - this.lastGuiPromptAt > 1400) {
        this.lastGuiPromptAt = this.time.now;
        this.mostrarFeedback(
          "Voce esta assustado demais. Ela precisa juntar as lembrancas para iluminar o caminho.",
          "#ffcfdf"
        );
      }
      return;
    }

    this.finalizarResgateGui();
  }

  finalizarResgateGui() {
    this.levelComplete = true;
    this.guiSaved = true;
    this.player.body.setVelocity(0, 0);
    this.esconderChucky();

    this.player.setVisible(false);
    this.guiRescue.setVisible(false);
    this.guiShadow.setVisible(false);
    this.guiPrompt.setVisible(false);
    this.guiAura.setAlpha(0.74).setTint(0xffe8a3);

    this.cameras.main.stopFollow();
    this.cameras.main.pan(GUI_RESCUE_X, FLOOR_Y - 118, 850, "Sine.easeInOut");
    this.cameras.main.zoomTo(1.08, 850);

    this.finalOverlay = this.add
      .rectangle(0, 0, this.largura, this.altura, 0x05030a, 0.54)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(86);

    this.finalHug = this.add
      .image(this.largura / 2, this.altura / 2 - 72, "coupleHug")
      .setDisplaySize(245, 268)
      .setScrollFactor(0)
      .setDepth(88)
      .setAlpha(0);

    this.finalMessage = this.add
      .text(
        this.largura / 2,
        this.altura / 2 + 136,
        "Ela me fez e me faz vencer medos, ate o medo de filmes de terror. Foi meu farol na fase mais sombria da minha vida, e segue sendo ate hoje.",
        {
          fontSize: "24px",
          color: "#fff8e7",
          fontFamily: "Trebuchet MS",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 880 },
          stroke: "#05030a",
          strokeThickness: 5,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(89)
      .setAlpha(0);

    this.tweens.add({
      targets: [this.finalHug, this.finalMessage],
      alpha: 1,
      y: "-=10",
      duration: 900,
      ease: "Sine.easeOut",
    });

    this.time.delayedCall(5600, () => {
      this.game.events.emit("chucky-complete");
    });
  }

  jogadoraEmZonaSegura() {
    return this.safeZoneVisuals.some(
      (zone) => Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, FLOOR_Y - 42) < zone.radius
    );
  }

  atualizarHud() {
    this.counterText.setText(`Lembrancas: ${this.memoriesCollected}/${this.totalMemories}`);
    this.lifeText.setText(`Coragem: ${"<3 ".repeat(this.lives).trim()}`);
    this.chargeFill.setDisplaySize(Math.max(0, 176 * (this.flashlightCharge / 100)), 14);
    this.chargeFill.setFillStyle(this.flashlightActive ? 0xfff3bf : 0xffe8a3, 0.9);
  }

  mostrarFeedback(text, color = "#fff8e7") {
    if (this.feedbackTween) {
      this.feedbackTween.stop();
    }

    this.feedbackBox.setVisible(true).setAlpha(0.88);
    this.feedbackText.setText(text).setColor(color).setAlpha(1);

    this.feedbackTween = this.tweens.add({
      targets: [this.feedbackBox, this.feedbackText],
      alpha: 0,
      delay: 2850,
      duration: 480,
      onComplete: () => this.feedbackBox.setVisible(false),
    });
  }

  mostrarTextoFlutuante(x, y, text, color) {
    const label = this.add
      .text(x, y, text, {
        fontSize: "17px",
        color,
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(70);

    this.tweens.add({
      targets: label,
      y: y - 42,
      alpha: 0,
      duration: 900,
      onComplete: () => label.destroy(),
    });
  }

  criarEfeitoColeta(x, y, color) {
    for (let i = 0; i < 16; i += 1) {
      const spark = this.add
        .circle(x, y, Phaser.Math.Between(3, 7), color, 0.78)
        .setDepth(60)
        .setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-76, 76),
        y: y + Phaser.Math.Between(-68, 38),
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(520, 880),
        onComplete: () => spark.destroy(),
      });
    }
  }

  prepararTrilhaChucky() {
    this.trilhaChuckyAtivada = false;
    this.input.keyboard.once("keydown", () => this.ativarTrilhaChucky());
    this.input.once("pointerdown", () => this.ativarTrilhaChucky());
  }

  ativarTrilhaChucky() {
    if (this.trilhaChuckyAtivada || !this.sound?.context) {
      return;
    }

    const contexto = this.sound.context;
    this.trilhaChuckyAtivada = true;
    this.trilhaChuckyMaster = contexto.createGain();
    this.trilhaChuckyMaster.gain.value = 0.0001;
    this.trilhaChuckyMaster.connect(contexto.destination);

    this.tweens.addCounter({
      from: 0.0001,
      to: 0.052,
      duration: 1300,
      onUpdate: (tween) => {
        if (this.trilhaChuckyMaster) {
          this.trilhaChuckyMaster.gain.value = tween.getValue();
        }
      },
    });

    this.trilhaChuckyTimer = this.time.addEvent({
      delay: 660,
      loop: true,
      callback: () => this.tocarPulsoChucky(),
    });
  }

  tocarPulsoChucky() {
    if (!this.trilhaChuckyMaster || !this.sound?.context) {
      return;
    }

    const contexto = this.sound.context;
    const agora = contexto.currentTime + 0.02;
    const notas = [123.47, 130.81, 146.83, 155.56, 196.0, 220.0];
    const nota = Phaser.Utils.Array.GetRandom(notas);

    this.tocarOscilador(agora, nota, 0.34, "triangle", 0.105);

    if (Phaser.Math.Between(0, 100) > 64) {
      this.tocarOscilador(agora + 0.18, nota * 1.5, 0.18, "sine", 0.048);
    }
  }

  tocarOscilador(start, frequency, duration, type, volume) {
    const contexto = this.sound.context;
    const osc = contexto.createOscillator();
    const ganho = contexto.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    ganho.gain.setValueAtTime(0.0001, start);
    ganho.gain.linearRampToValueAtTime(volume, start + 0.04);
    ganho.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(ganho);
    ganho.connect(this.trilhaChuckyMaster);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  desligarTrilhaChucky() {
    if (this.trilhaChuckyTimer) {
      this.trilhaChuckyTimer.remove(false);
      this.trilhaChuckyTimer = null;
    }

    if (this.trilhaChuckyMaster) {
      this.trilhaChuckyMaster.disconnect();
      this.trilhaChuckyMaster = null;
    }
  }
}

import Phaser from "phaser";

const WORLD_WIDTH = 6200;
const WORLD_HEIGHT = 720;
const FLOOR_Y = 612;
const BACKGROUND_SOURCE_HEIGHT = 841;
const RESCUE_COUNTDOWN_MS = 76000;
const GHOSTFACE_MAX_HEALTH = 3;

const MEMORIES = [
  {
    id: "foto",
    texture: "chuckyMemoryPhoto",
    x: 560,
    y: 505,
    size: 82,
    photoTexture: "memoryFirstPhoto",
    photoUrl: "/assets/chucky/memories/primeira-foto.png",
    title: "Nossa primeira foto",
    text: "Estávamos aqui no nosso cantinho de sempre...",
  },
  {
    id: "carta",
    texture: "chuckyMemoryLetter",
    x: 1290,
    y: 388,
    size: 88,
    photoTexture: "memoryBeginning",
    photoUrl: "/assets/chucky/memories/nosso-comeco.jpg",
    title: "Nosso comeco",
    text: "Aqui a gente tava branco pra cassete viu. E você linda como sempre!",
  },
  {
    id: "coracao",
    texture: "chuckyMemoryHeart",
    x: 2100,
    y: 515,
    size: 78,
    photoTexture: "memoryFirstTrip",
    photoUrl: "/assets/chucky/memories/primeira-viagem.jpg",
    title: "Nossa primeira viagem",
    text: "Foi tudo muitio massa. Não vou esquecer de você revoltada por ter se molhado kkkk.",
  },
  {
    id: "urso",
    texture: "chuckyMemoryBear",
    x: 3040,
    y: 382,
    size: 92,
    photoTexture: "memoryNightTogether",
    photoUrl: "/assets/chucky/memories/noite-juntos.jpg",
    title: "Uma noite juntos",
    text: "Rolêzinho no parque...",
  },
  {
    id: "chave",
    texture: "chuckyMemoryKey",
    x: 3940,
    y: 512,
    size: 84,
    photoTexture: "memoryUsTogether",
    photoUrl: "/assets/chucky/memories/nos-dois.jpg",
    title: "Nos dois",
    text: "Nosso dia dos namorados mais recente. Conhecendo um novo lugar",
  },
  {
    id: "luz",
    texture: "chuckyMemoryHeart",
    x: 4760,
    y: 402,
    size: 76,
    photoTexture: "memoryBeachTrip",
    photoUrl: "/assets/chucky/memories/viagem-praia.jpg",
    title: "A gente viajando",
    text: "Fico muito feliz de ter vivido isso com você. E ainda vamos viver muito mais.",
  },
  {
    id: "farol",
    texture: "chuckyMemoryKey",
    x: 5480,
    y: 505,
    size: 84,
    photoTexture: "memoryFutureUs",
    photoUrl: "/assets/chucky/memories/um-dia-sera-a-gente.jpg",
    title: "Um dia sera a gente",
    text: "Uma lembranca do futuro: tudo o que ainda vamos viver, construir e celebrar juntos.",
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
  {
    x: 5080,
    y: FLOOR_Y - 62,
    radius: 118,
    texture: "chuckySafePillows",
    glow: "chuckySafeGlow",
    width: 210,
    height: 96,
    name: "Ultima luz",
  },
];

const PLATFORM_SPECS = [
  {
    x: 520,
    y: 478,
    width: 372,
    height: 94,
    texture: "chuckyPlatformRailing",
    bodyWidth: 318,
    bodyHeight: 22,
    highlight: true,
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
  {
    x: 4740,
    y: 402,
    width: 330,
    height: 98,
    texture: "chuckyPlatformTable",
    bodyWidth: 288,
    bodyHeight: 22,
  },
  {
    x: 5280,
    y: 526,
    width: 460,
    height: 78,
    texture: "chuckyPlatformShelf",
    bodyWidth: 400,
    bodyHeight: 24,
  },
  {
    x: 5780,
    y: 444,
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
  { texture: "chuckyDecorShelfWall", x: 4880, y: 238, w: 150, h: 92, depth: -8 },
  { texture: "chuckyDecorBoxes", x: 5220, y: FLOOR_Y - 54, w: 138, h: 112, depth: -2 },
  { texture: "chuckyDecorWindowMoon", x: 5520, y: 164, w: 145, h: 198, depth: -12 },
  { texture: "chuckyDecorPictures", x: 5880, y: 190, w: 210, h: 118, depth: -8 },
];

const CAUGHT_MESSAGES = [
  "Foi so um susto. Respira e tenta de novo.",
  "O medo apareceu, mas nao venceu.",
  "Você sempre continua, mesmo quando assusta.",
  "Respira. Um passo de cada vez.",
];

const GUI_RESCUE_X = WORLD_WIDTH - 430;
const GUI_RESCUE_Y = FLOOR_Y - 76;

export default class ChuckyScene extends Phaser.Scene {
  constructor() {
    super("ChuckyScene");
  }

  preload() {
    this.load.audio("chuckyTheme", "/assets/audio/chucky-theme-8bit.mp3");
    this.load.audio("runawayRescue", "/assets/audio/runaway.mp3");
    this.load.spritesheet(
      "liviaRockSprite",
      "/assets/chucky/livia-rock-spritesheet.png",
      {
        frameWidth: 96,
        frameHeight: 96,
      }
    );

    this.load.spritesheet(
      "liviaKnifeSprite",
      "/assets/chucky/livia-knife-spritesheet.png",
      {
        frameWidth: 96,
        frameHeight: 120,
      }
    );

    this.load.spritesheet(
      "liviaLanternSprite",
      "/assets/chucky/livia-lantern-spritesheet.png",
      {
        frameWidth: 160,
        frameHeight: 120,
      }
    );

    this.load.spritesheet(
      "ghostfaceSprite",
      "/assets/chucky/ghostface-spritesheet.png",
      {
        frameWidth: 128,
        frameHeight: 128,
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
    this.load.image("liviaKnifeProjectile", "/assets/chucky/livia-knife-projectile.png");
    this.load.image("chuckyLightGlow", "/assets/chucky/light-glow.png");
    this.load.image("chuckySafeGlow", "/assets/chucky/safe-glow.png");
    this.load.image("chuckySafeTent", "/assets/chucky/safe-tent.png");
    this.load.image("chuckySafePillows", "/assets/chucky/safe-pillows.png");
    this.load.image("chuckySafeSign", "/assets/chucky/safe-sign.png");
    this.load.image("coupleHug", "/assets/chucky/couple-hug.png");
    this.load.image("coupleRescue", "/assets/chucky/couple-rescue.png");
    this.load.image("memoryFirstPhoto", "/assets/chucky/memories/primeira-foto.png");
    this.load.image("memoryBeginning", "/assets/chucky/memories/nosso-comeco.jpg");
    this.load.image("memoryFirstTrip", "/assets/chucky/memories/primeira-viagem.jpg");
    this.load.image("memoryNightTogether", "/assets/chucky/memories/noite-juntos.jpg");
    this.load.image("memoryUsTogether", "/assets/chucky/memories/nos-dois.jpg");
    this.load.image("memoryBeachTrip", "/assets/chucky/memories/viagem-praia.jpg");
    this.load.image("memoryFutureUs", "/assets/chucky/memories/um-dia-sera-a-gente.jpg");

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
    this.knifeCooldown = 0;
    this.throwingUntil = 0;
    this.checkpoint = { x: 110, y: FLOOR_Y - 78 };
    this.lastCaughtAt = -9999;
    this.levelComplete = false;
    this.rescueFailed = false;
    this.finalAcknowledged = false;
    this.guiSaved = false;
    this.rescueReady = false;
    this.rescueDeadline = null;
    this.continuesUsed = 0;
    this.lastGuiPromptAt = -9999;
    this.chuckyHunting = false;
    this.chuckyStunnedUntil = 0;
    this.chuckyHideAt = 0;
    this.ghostfaceHealth = GHOSTFACE_MAX_HEALTH;
    this.ghostfaceMode = "alive";
    this.ghostfaceStunnedUntil = 0;
    this.lastGhostHitAt = -9999;
    this.nextScareAt = 3600;
    this.jumpGraceUntil = 0;
    this.memoryModalOpen = false;

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
    this.criarGhostface();
    this.criarFacas();
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
    if (this.levelComplete || this.rescueFailed) {
      return;
    }

    if (this.memoryModalOpen) {
      return;
    }

    this.atualizarJogadora();
    this.atualizarLanterna(delta);
    this.atualizarFacas(time);
    this.atualizarChucky(time);
    this.atualizarGhostface(time);
    this.atualizarZonasSeguras();
    this.atualizarSustosLeves(time);
    this.atualizarTimerResgate(time);
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
      frameRate: 13,
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
      frames: this.anims.generateFrameNumbers("liviaRockSprite", { start: 0, end: 4 }),
      frameRate: 4,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-run",
      frames: this.anims.generateFrameNumbers("liviaRockSprite", { start: 15, end: 19 }),
      frameRate: 14,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-jump",
      frames: this.anims.generateFrameNumbers("liviaRockSprite", { frames: [16, 17, 18] }),
      frameRate: 10,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-fall",
      frames: this.anims.generateFrameNumbers("liviaRockSprite", { frames: [19, 18] }),
      frameRate: 8,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-flashlight",
      frames: this.anims.generateFrameNumbers("liviaLanternSprite", { frames: [9, 13] }),
      frameRate: 4,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "livinha-chucky-throw",
      frames: this.anims.generateFrameNumbers("liviaKnifeSprite", { start: 18, end: 22 }),
      frameRate: 16,
      repeat: 0,
    });
    this.criarAnimacao({
      key: "gui-scared",
      frames: this.anims.generateFrameNumbers("guiScaredSprite", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "ghostface-idle",
      frames: this.anims.generateFrameNumbers("ghostfaceSprite", { start: 0, end: 4 }),
      frameRate: 4,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "ghostface-run",
      frames: this.anims.generateFrameNumbers("ghostfaceSprite", { start: 10, end: 14 }),
      frameRate: 13,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "ghostface-attack",
      frames: this.anims.generateFrameNumbers("ghostfaceSprite", { frames: [15, 16, 18, 19] }),
      frameRate: 9,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "ghostface-hurt",
      frames: this.anims.generateFrameNumbers("ghostfaceSprite", { start: 20, end: 24 }),
      frameRate: 7,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "ghostface-ghost",
      frames: this.anims.generateFrameNumbers("ghostfaceSprite", { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
    });
  }

  criarAnimacao(config) {
    try {
      if (this.anims.exists(config.key)) {
        this.anims.remove(config.key);
      }

      this.anims.create(config);
    } catch (error) {
      console.error(`Erro ao criar animacao ${config.key}`, error);
      throw error;
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

    this.flashlightBeam = this.add
      .graphics()
      .setDepth(23)
      .setBlendMode(Phaser.BlendModes.ADD);
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

    if (platform.highlight) {
      this.add
        .image(platform.x, platform.y + 8, "chuckyLightGlow")
        .setDisplaySize(platform.width * 0.96, platform.height * 0.62)
        .setAlpha(0.34)
        .setDepth(4)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.add
        .rectangle(platform.x, platform.y - platform.height / 2 + 26, platform.bodyWidth * 0.88, 4, 0xffe8a3, 0.62)
        .setDepth(7);
    }

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
      const checkpointLabel = this.add
        .text(zone.x, FLOOR_Y - 188, "PONTO DE RETORNO", {
          fontSize: "15px",
          color: "#fff2b8",
          fontFamily: "Trebuchet MS",
          fontStyle: "bold",
          stroke: "#160d21",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(20);

      this.tweens.add({
        targets: glow,
        alpha: 0.72,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 1180,
        yoyo: true,
        repeat: -1,
      });

      return { ...zone, glow, asset, checkpointLabel, activated: false };
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
    this.player = this.physics.add.sprite(130, FLOOR_Y - 82, "liviaRockSprite", 0);
    this.player.setAlpha(0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(34, 58);
    this.player.body.setOffset(31, 34);

    this.playerVisual = this.add
      .sprite(this.player.x, this.player.y, "liviaRockSprite", 0)
      .setDepth(24);
    this.playerVisualKey = null;
    this.playerVisualWidth = 0;
    this.playerVisualHeight = 0;
    this.aplicarVisualJogadora("liviaRockSprite", 98, 98);
    this.playerVisual.anims.play("livinha-chucky-idle", true);
  }

  aplicarVisualJogadora(textureKey, width, height) {
    if (this.playerVisualKey !== textureKey) {
      this.playerVisual.setTexture(textureKey);
      this.playerVisualKey = textureKey;
    }

    if (this.playerVisualWidth !== width || this.playerVisualHeight !== height) {
      this.playerVisual.setDisplaySize(width, height);
      this.playerVisualWidth = width;
      this.playerVisualHeight = height;
    }
  }

  criarChucky() {
    this.chucky = this.physics.add.sprite(720, FLOOR_Y - 78, "chuckySprite", 0);
    this.chucky.setDisplaySize(136, 120).setDepth(23);
    this.chucky.setCollideWorldBounds(true);
    this.chucky.body.setAllowGravity(true);
    this.chucky.body.setSize(56, 76);
    this.chucky.body.setOffset(52, 46);
    this.chucky.anims.play("chucky-walk", true);
    this.chuckyHunting = true;
    this.chuckyHideAt = Number.POSITIVE_INFINITY;
  }

  criarGhostface() {
    this.ghostface = this.physics.add.sprite(1580, FLOOR_Y - 82, "ghostfaceSprite", 0);
    this.ghostface.setDisplaySize(122, 122).setDepth(22);
    this.ghostface.setCollideWorldBounds(true);
    this.ghostface.body.setAllowGravity(true);
    this.ghostface.body.setSize(54, 74);
    this.ghostface.body.setOffset(37, 44);
    this.ghostface.anims.play("ghostface-run", true);

    this.ghostfaceAura = this.add
      .image(this.ghostface.x, this.ghostface.y + 24, "chuckyLightGlow")
      .setDisplaySize(120, 86)
      .setTint(0xa78bfa)
      .setAlpha(0.12)
      .setDepth(18)
      .setBlendMode(Phaser.BlendModes.ADD);
  }

  reconstruirGhostfaceSeNecessario() {
    if (this.ghostface?.anims && this.ghostface?.body) {
      return;
    }

    const previousX = Number.isFinite(this.ghostface?.x)
      ? this.ghostface.x
      : Phaser.Math.Clamp(this.player.x + 520, 260, this.worldWidth - 420);
    const previousY = Number.isFinite(this.ghostface?.y)
      ? this.ghostface.y
      : FLOOR_Y - 82;

    this.ghostfaceAura?.destroy();
    this.criarGhostface();
    this.ghostface.setPosition(previousX, previousY);

    this.physics.add.collider(
      this.ghostface,
      this.platforms,
      null,
      () => this.ghostfaceMode !== "ghost",
      this
    );
    this.physics.add.overlap(this.player, this.ghostface, this.serPegaPorGhostface, null, this);
    this.physics.add.overlap(this.knives, this.ghostface, this.acertarGhostface, null, this);

    if (this.ghostfaceMode === "ghost") {
      this.ghostface.body.setAllowGravity(false);
      this.ghostface.setAlpha(0.68).setTint(0xd8f3ff).setDepth(26);
      this.ghostfaceAura.setVisible(true).setTint(0xd8f3ff).setAlpha(0.38);
      this.ghostface.anims.play("ghostface-ghost", true);
    }
  }

  reativarInimigo(inimigo, x, y, tipo) {
    if (!inimigo.body) {
      this.physics.world.enable(inimigo);
    }

    inimigo.setActive(true).setVisible(true).setPosition(x, y);
    inimigo.body.enable = true;
    inimigo.body.reset(x, y);
    inimigo.body.setVelocity(0, 0);

    if (tipo === "chucky") {
      inimigo.body.setAllowGravity(true);
      inimigo.body.setSize(56, 76);
      inimigo.body.setOffset(52, 46);
      inimigo.setAlpha(1);
      return;
    }

    inimigo.body.setSize(54, 74);
    inimigo.body.setOffset(37, 44);
    inimigo.body.setAllowGravity(this.ghostfaceMode !== "ghost");
    inimigo.setAlpha(this.ghostfaceMode === "ghost" ? 0.68 : 1);
  }

  criarFacas() {
    this.knives = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
  }

  criarHud() {
    this.hudShade = this.add
      .rectangle(0, 0, this.largura, 118, 0x05030a, 0.62)
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
      .text(this.largura / 2, 64, "Pegue as lembrancas. X/F acende a lanterna. C joga faca no Ghostface.", {
        fontSize: "17px",
        color: "#f5e7c8",
        fontFamily: "Trebuchet MS",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(80);

    this.timerText = this.add
      .text(this.largura / 2, 92, "", {
        fontSize: "20px",
        color: "#ffcfdf",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(80)
      .setVisible(false);

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
      knife: Phaser.Input.Keyboard.KeyCodes.C,
    });
  }

  criarColisoes() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.chucky, this.platforms);
    this.physics.add.collider(
      this.ghostface,
      this.platforms,
      null,
      () => this.ghostfaceMode !== "ghost",
      this
    );
    this.physics.add.overlap(this.player, this.memories, this.coletarLembranca, null, this);
    this.physics.add.overlap(this.player, this.exitDoor, this.tentarSair, null, this);
    this.physics.add.overlap(this.player, this.guiRescue, this.tentarSalvarGui, null, this);
    this.physics.add.overlap(this.player, this.chucky, this.serPegaPorChucky, null, this);
    this.physics.add.overlap(this.player, this.ghostface, this.serPegaPorGhostface, null, this);
    this.physics.add.overlap(this.knives, this.ghostface, this.acertarGhostface, null, this);
  }

  atualizarJogadora() {
    const speed = 330;
    const jump = -650;
    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.jump);
    const knifePressed = Phaser.Input.Keyboard.JustDown(this.keys.knife);

    this.playerVisual.setPosition(this.player.x, this.player.y);

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
      this.jumpGraceUntil = this.time.now + 720;
    }

    if (knifePressed && this.time.now >= this.knifeCooldown) {
      this.lancarFaca();
    }

    const moving = Math.abs(this.player.body.velocity.x) > 5;
    const airborne = !this.player.body.blocked.down;
    const throwing = this.time.now < this.throwingUntil;
    const usingFlashlightPose =
      (this.keys.flashlight.isDown || this.keys.flashlightAlt.isDown) &&
      this.flashlightCharge > 2 &&
      this.time.now > this.flashlightCooldown;

    if (usingFlashlightPose) {
      this.aplicarVisualJogadora("liviaLanternSprite", 131, 98);
      this.playerVisual.setFlipX(this.playerDirection < 0);
      this.playerVisual.anims.play("livinha-chucky-flashlight", true);
      return;
    }

    if (throwing) {
      this.aplicarVisualJogadora("liviaKnifeSprite", 78, 98);
      this.playerVisual.setFlipX(this.playerDirection < 0);
      this.playerVisual.anims.play("livinha-chucky-throw", true);
      return;
    }

    this.aplicarVisualJogadora("liviaRockSprite", 98, 98);
    this.playerVisual.setFlipX(this.playerDirection > 0);

    if (airborne) {
      this.playerVisual.anims.play(
        this.player.body.velocity.y < 0 ? "livinha-chucky-jump" : "livinha-chucky-fall",
        true
      );
      return;
    }

    this.playerVisual.anims.play(moving ? "livinha-chucky-run" : "livinha-chucky-idle", true);
  }

  lancarFaca() {
    const dir = this.playerDirection;
    const x = this.player.x + dir * 42;
    const y = this.player.y - 10;
    const knife = this.knives.create(x, y, "liviaKnifeProjectile");
    knife.setDisplaySize(58, 26);
    knife.setDepth(34);
    knife.setFlipX(dir < 0);
    knife.body.setAllowGravity(false);
    knife.body.setSize(44, 14);
    knife.body.setVelocityX(dir * 720);
    knife.body.setVelocityY(-18);
    knife.bornAt = this.time.now;
    this.knifeCooldown = this.time.now + 520;
    this.throwingUntil = this.time.now + 360;
  }

  atualizarFacas(time) {
    if (!this.knives) {
      return;
    }

    const camera = this.cameras.main;
    this.knives.getChildren().forEach((knife) => {
      if (!knife?.active) {
        return;
      }

      if (
        time - knife.bornAt > 1600 ||
        knife.x < camera.scrollX - 120 ||
        knife.x > camera.scrollX + this.largura + 120
      ) {
        knife.destroy();
      }
    });
  }

  atualizarLanterna(delta) {
    const wantsLight = this.keys.flashlight.isDown || this.keys.flashlightAlt.isDown;
    const canLight = this.flashlightCharge > 2 && this.time.now > this.flashlightCooldown;
    this.flashlightActive = wantsLight && canLight;

    if (this.flashlightActive) {
      this.flashlightCharge = Math.max(0, this.flashlightCharge - delta * 0.055);
    } else {
      this.flashlightCharge = Math.min(100, this.flashlightCharge + delta * 0.016);
    }

    if (this.flashlightCharge <= 1) {
      this.flashlightCooldown = this.time.now + 620;
    }

    this.flashlightBeam.clear();
    if (!this.flashlightActive) {
      return;
    }

    const dir = this.playerDirection;
    const startX = this.player.x + dir * 40;
    const startY = this.player.y - 10;
    const endX = startX + dir * 430;
    const flicker = 0.94 + Math.sin(this.time.now / 72) * 0.05;

    const beamHeight = 64 * flicker;
    this.flashlightBeam.fillStyle(0xfff3bf, 0.15);
    this.flashlightBeam.fillTriangle(
      startX,
      startY,
      endX,
      startY - beamHeight,
      endX,
      startY + beamHeight
    );
    this.flashlightBeam.fillStyle(0xffffff, 0.09);
    this.flashlightBeam.fillTriangle(
      startX,
      startY,
      startX + dir * 300,
      startY - 26,
      startX + dir * 300,
      startY + 26
    );
    this.flashlightBeam.fillStyle(0xfff3bf, 0.08);
    this.flashlightBeam.fillCircle(endX, startY, 76);

    this.tentarAfastarChuckyComLanterna();
    this.tentarAfastarGhostfaceComLanterna();
  }

  tentarAfastarChuckyComLanterna() {
    if (!this.chuckyHunting || !this.chucky.visible || this.time.now < this.chuckyStunnedUntil) {
      return;
    }

    const dir = this.playerDirection;
    const ahead = dir > 0 ? this.chucky.x - this.player.x : this.player.x - this.chucky.x;
    const vertical = Math.abs(this.chucky.y - this.player.y);

    if (ahead > 0 && ahead < 390 && vertical < 118) {
      this.chuckyStunnedUntil = this.time.now + 1500;
      this.chucky.body.setVelocityX(0);
      this.chucky.anims.play("chucky-stun", true);
      this.mostrarTextoFlutuante(this.chucky.x, this.chucky.y - 58, "luz!", "#fff3bf");
      this.mostrarFeedback("A lanterna segurou o susto. Aproveita para respirar.", "#fff3bf");
    }
  }

  tentarAfastarGhostfaceComLanterna() {
    if (!this.ghostface?.visible || this.time.now < this.ghostfaceStunnedUntil) {
      return;
    }

    const dir = this.playerDirection;
    const ahead = dir > 0 ? this.ghostface.x - this.player.x : this.player.x - this.ghostface.x;
    const vertical = Math.abs(this.ghostface.y - this.player.y);

    if (ahead > 0 && ahead < 360 && vertical < 135) {
      this.ghostfaceStunnedUntil = this.time.now + (this.ghostfaceMode === "ghost" ? 760 : 1180);
      this.ghostface.body.setVelocityX(dir * 170);
      this.ghostface.anims.play("ghostface-hurt", true);
      this.mostrarTextoFlutuante(this.ghostface.x, this.ghostface.y - 58, "luz!", "#d8f3ff");
    }
  }

  inimigoSobLanterna(inimigo, range = 400, verticalRange = 135) {
    if (!this.flashlightActive || !inimigo?.visible) {
      return false;
    }

    const dir = this.playerDirection;
    const ahead = dir > 0 ? inimigo.x - this.player.x : this.player.x - inimigo.x;
    const vertical = Math.abs(inimigo.y - this.player.y);
    return ahead >= -28 && ahead < range && vertical < verticalRange;
  }

  atualizarChucky(time) {
    if (!this.chuckyHunting || !this.chucky.visible) {
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

    const chuckyInSafeZone = this.entidadeEmZonaSegura(this.chucky);
    this.chucky.setAlpha(chuckyInSafeZone ? 0.72 : 1);
    const dx = this.player.x - this.chucky.x;
    const dir = Math.sign(dx) || 1;
    const distance = Math.abs(dx);
    const speed =
      (168 + this.memoriesCollected * 28 + (distance > 460 ? 44 : 0)) *
      (chuckyInSafeZone ? 0.42 : 1);
    this.chucky.body.setVelocityX(dir * speed);

    const playerAbove = this.player.y < this.chucky.y - 64;
    const stuckOnSide = this.chucky.body.blocked.left || this.chucky.body.blocked.right;
    if (
      this.chucky.body.blocked.down &&
      ((playerAbove && distance > 175) || stuckOnSide) &&
      distance < 680
    ) {
      this.chucky.body.setVelocityY(-510);
    }

    this.chucky.setFlipX(dir < 0);
    this.chucky.anims.play(distance < 115 ? "chucky-scare" : "chucky-walk", true);
  }

  atualizarGhostface(time) {
    this.reconstruirGhostfaceSeNecessario();

    if (!this.ghostface?.visible) {
      return;
    }

    this.ghostfaceAura.setPosition(this.ghostface.x, this.ghostface.y + 30);

    if (this.jogadoraEmZonaSegura()) {
      this.ghostface.body.setVelocity(0, 0);
      this.ghostface.setAlpha(this.ghostfaceMode === "ghost" ? 0.5 : 0.58);
      this.ghostface.anims.play(this.ghostfaceMode === "ghost" ? "ghostface-ghost" : "ghostface-idle", true);
      return;
    }

    if (time < this.ghostfaceStunnedUntil) {
      this.ghostface.body.setVelocityX(0);
      this.ghostface.anims.play("ghostface-hurt", true);
      return;
    }

    const dx = this.player.x - this.ghostface.x;
    const dir = Math.sign(dx) || 1;
    const distance = Math.abs(dx);
    const ghostInSafeZone = this.entidadeEmZonaSegura(this.ghostface);
    this.ghostface.setFlipX(dir < 0);

    if (this.ghostfaceMode === "ghost") {
      this.ghostface.body.setAllowGravity(false);
      this.ghostface.setAlpha((ghostInSafeZone ? 0.5 : 0.68) + Math.sin(time / 140) * 0.08);
      this.ghostface.body.setVelocityX(
        dir * (110 + this.memoriesCollected * 9) * (ghostInSafeZone ? 0.45 : 1)
      );
      this.ghostface.y += (this.player.y - 20 - this.ghostface.y) * 0.026;
      this.ghostface.anims.play("ghostface-ghost", true);
      return;
    }

    this.ghostface.body.setAllowGravity(true);
    this.ghostface.setAlpha(ghostInSafeZone ? 0.72 : 1);
    this.ghostface.body.setVelocityX(
      dir *
        (136 + this.memoriesCollected * 16 + (distance > 520 ? 38 : 0)) *
        (ghostInSafeZone ? 0.48 : 1)
    );

    const playerAbove = this.player.y < this.ghostface.y - 70;
    const stuckOnSide = this.ghostface.body.blocked.left || this.ghostface.body.blocked.right;
    if (
      this.ghostface.body.blocked.down &&
      ((playerAbove && distance > 190) || stuckOnSide) &&
      distance < 620
    ) {
      this.ghostface.body.setVelocityY(-470);
    }

    this.ghostface.anims.play(distance < 190 ? "ghostface-attack" : "ghostface-run", true);
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
      activeZone.checkpointLabel.setText("RETORNO SALVO").setColor("#9fffd2");
      this.mostrarFeedback(`Ponto de retorno salvo. ${activeZone.name}. Aqui o medo fica menor.`, "#ffe8a3");
    }
  }

  atualizarSustosLeves(time) {
    if (time < this.nextScareAt || this.levelComplete) {
      return;
    }

    this.nextScareAt = time + Phaser.Math.Between(4200, 7000);
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
    this.mostrarFotoLembranca(memory, () => {
      if (!this.sys.isActive() || this.levelComplete) {
        return;
      }

      if (this.memoriesCollected >= this.totalMemories) {
        this.abrirPortaFinal();
      } else {
        this.invocarChuckyPorSusto();
      }
    });
  }

  mostrarFotoLembranca(memory, onClose) {
    this.memoryModalOpen = true;
    this.physics.world.pause();

    let closing = false;
    const close = () => {
      if (closing) {
        return;
      }

      closing = true;
      this.memoryModalOpen = false;
      this.physics.world.resume();
      onClose?.();
    };

    this.game.events.emit("chucky-memory-open", {
      id: memory.id,
      title: memory.title,
      text: memory.text,
      photoUrl: memory.photoUrl,
      close,
    });
  }

  invocarChuckyPorSusto() {
    const side = this.playerDirection >= 0 ? -1 : 1;
    const x = Phaser.Math.Clamp(
      this.player.x + side * Phaser.Math.Between(260, 420),
      180,
      this.worldWidth - 300
    );

    const chuckyX =
      Math.abs(this.chucky.x - this.player.x) > 980 ? x : this.chucky.x;
    this.reativarInimigo(this.chucky, chuckyX, FLOOR_Y - 90, "chucky");

    if (this.ghostfaceMode === "alive") {
      const ghostfaceX =
        Math.abs(this.ghostface.x - this.player.x) > 1200
          ? Phaser.Math.Clamp(this.player.x - side * 520, 220, this.worldWidth - 380)
          : this.ghostface.x;
      this.reativarInimigo(
        this.ghostface,
        ghostfaceX,
        FLOOR_Y - 90,
        "ghostface"
      );
    }

    this.chucky.setVisible(true).setAlpha(1);
    this.chuckyHunting = true;
    this.chuckyStunnedUntil = 0;
    this.chucky.anims.play("chucky-scare", true);
    this.mostrarFeedback("O barulho chamou os dois. Corre, usa a lanterna, a faca ou uma luz segura.", "#ffcfdf");
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

  acertarGhostface(objectA, objectB) {
    const ghostface = objectA === this.ghostface ? objectA : objectB;
    const knife = objectA === this.ghostface ? objectB : objectA;

    if (ghostface !== this.ghostface || !knife || knife === this.ghostface) {
      return;
    }

    if (!knife.active || this.time.now - this.lastGhostHitAt < 180) {
      return;
    }

    knife.destroy();

    if (this.ghostfaceMode === "ghost") {
      this.mostrarTextoFlutuante(ghostface.x, ghostface.y - 58, "atravessou", "#d8f3ff");
      return;
    }

    this.lastGhostHitAt = this.time.now;
    this.ghostfaceHealth -= 1;
    this.ghostfaceStunnedUntil = this.time.now + 980;
    this.criarEfeitoColeta(ghostface.x, ghostface.y, 0xd8f3ff);
    this.mostrarTextoFlutuante(ghostface.x, ghostface.y - 66, "-1", "#d8f3ff");

    if (this.ghostfaceHealth <= 0) {
      this.transformarGhostfaceEmFantasma();
      return;
    }

    this.mostrarFeedback("A faca acertou o Ghostface. Chucky nem liga para ela.", "#d8f3ff");
  }

  transformarGhostfaceEmFantasma() {
    this.ghostfaceMode = "ghost";
    this.ghostfaceHealth = 0;
    this.ghostfaceStunnedUntil = 0;
    this.ghostface.setActive(true).setVisible(true).setDepth(26);
    this.ghostface.body.setVelocity(0, 0);
    this.ghostface.body.setAllowGravity(false);
    this.ghostface.setAlpha(0.72).setTint(0xd8f3ff);
    this.ghostface.anims.play("ghostface-ghost", true);
    this.ghostfaceAura.setVisible(true).setTint(0xd8f3ff).setAlpha(0.38);
    this.mostrarFeedback("Ghostface caiu... mas voltou como fantasma. Agora so a luz segura segura ele.", "#d8f3ff");
  }

  jogadoraSaltandoPorCima(inimigo) {
    if (!inimigo?.body || this.player.body.blocked.down) {
      return false;
    }

    const horizontal = Math.abs(this.player.x - inimigo.x);
    const playerAbove = this.player.y < inimigo.y - 22;
    return horizontal < 92 && playerAbove && this.time.now < this.jumpGraceUntil;
  }

  serPegaPorChucky() {
    if (
      this.levelComplete ||
      this.guiSaved ||
      this.rescueFailed ||
      this.memoryModalOpen ||
      !this.chuckyHunting ||
      this.time.now < this.chuckyStunnedUntil ||
      this.inimigoSobLanterna(this.chucky, 410, 125) ||
      this.jogadoraSaltandoPorCima(this.chucky) ||
      this.jogadoraEmZonaSegura() ||
      this.entidadeEmZonaSegura(this.chucky) ||
      this.time.now - this.lastCaughtAt < 1200
    ) {
      return;
    }

    this.receberDano("chucky");
    this.chuckyStunnedUntil = this.time.now + 820;
  }

  serPegaPorGhostface() {
    if (
      this.levelComplete ||
      this.guiSaved ||
      this.rescueFailed ||
      this.memoryModalOpen ||
      this.time.now < this.ghostfaceStunnedUntil ||
      this.inimigoSobLanterna(this.ghostface, 380, 140) ||
      this.jogadoraSaltandoPorCima(this.ghostface) ||
      this.jogadoraEmZonaSegura() ||
      this.entidadeEmZonaSegura(this.ghostface) ||
      this.time.now - this.lastCaughtAt < 1200
    ) {
      return;
    }

    this.receberDano(this.ghostfaceMode === "ghost" ? "fantasma" : "ghostface");
    this.ghostfaceStunnedUntil = this.time.now + 780;
  }

  receberDano(source) {
    if (this.levelComplete || this.guiSaved || this.rescueFailed) {
      return;
    }

    this.lastCaughtAt = this.time.now;
    this.lives -= 1;
    this.cameras.main.shake(260, 0.006);
    this.criarEfeitoColeta(this.player.x, this.player.y, 0xff5d8f);
    this.player.setPosition(this.checkpoint.x, this.checkpoint.y);
    this.player.body.setVelocity(0, 0);
    this.playerVisual.setPosition(this.player.x, this.player.y);
    this.reposicionarInimigosDepoisDoDano();

    if (this.lives <= 0) {
      this.continuesUsed += 1;
      this.mostrarReinicioPorCoracoes();
      return;
    }

    const prefix =
      source === "fantasma"
        ? "O fantasma encostou perto demais."
        : source === "ghostface"
          ? "Ghostface chegou perto demais."
          : "Chucky chegou perto demais.";
    this.mostrarFeedback(`${prefix} ${Phaser.Utils.Array.GetRandom(CAUGHT_MESSAGES)}`, "#ffcfdf");
  }

  mostrarReinicioPorCoracoes() {
    if (this.rescueFailed || this.levelComplete || this.guiSaved) {
      return;
    }

    this.rescueFailed = true;
    this.player.body.setVelocity(0, 0);
    this.chucky.body?.setVelocity(0, 0);
    this.ghostface.body?.setVelocity(0, 0);
    this.timerText.setVisible(false);

    const overlay = this.add
      .rectangle(0, 0, this.largura, this.altura, 0x05030a, 0.8)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(100);
    const title = this.add
      .text(this.largura / 2, this.altura / 2 - 92, "A coragem se recompõe", {
        fontSize: "34px",
        color: "#fff3bf",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101);
    const message = this.add
      .text(
        this.largura / 2,
        this.altura / 2 - 18,
        "Os tres coracoes acabaram. Respira, volta ao inicio e tenta outra vez.",
        {
          fontSize: "22px",
          color: "#fff8e7",
          fontFamily: "Trebuchet MS",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 720 },
          stroke: "#05030a",
          strokeThickness: 5,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101);
    const button = this.add
      .rectangle(this.largura / 2, this.altura / 2 + 82, 236, 54, 0xffe8a3, 0.2)
      .setStrokeStyle(2, 0xfff3bf, 0.9)
      .setScrollFactor(0)
      .setDepth(101)
      .setInteractive({ useHandCursor: true });
    const label = this.add
      .text(this.largura / 2, this.altura / 2 + 82, "RECOMECAR", {
        fontSize: "22px",
        color: "#fff8e7",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(102)
      .setInteractive({ useHandCursor: true });

    const restart = () => this.scene.restart();
    button.on("pointerdown", restart);
    label.on("pointerdown", restart);
    button.on("pointerover", () => button.setFillStyle(0xffe8a3, 0.36));
    button.on("pointerout", () => button.setFillStyle(0xffe8a3, 0.2));

    this.heartFailureOverlayItems = [overlay, title, message, button, label];
  }

  reposicionarInimigosDepoisDoDano() {
    const side = this.playerDirection >= 0 ? -1 : 1;
    const chuckyX = Phaser.Math.Clamp(this.checkpoint.x + side * 520, 220, this.worldWidth - 360);
    const ghostX = Phaser.Math.Clamp(this.checkpoint.x - side * 620, 260, this.worldWidth - 420);

    this.reativarInimigo(this.chucky, chuckyX, FLOOR_Y - 92, "chucky");
    this.chuckyHunting = true;

    this.reativarInimigo(this.ghostface, ghostX, FLOOR_Y - 92, "ghostface");
  }

  abrirPortaFinal() {
    this.rescueReady = true;
    this.exitDoor.open = true;
    this.exitDoor.setTexture("chuckyDoorOpen");
    this.exitGlow.setAlpha(0.34);
    this.guiAura.setTint(0xffe8a3).setAlpha(0.46);
    this.guiPrompt.setText("ela precisa te salvar");
    this.objectiveText.setText("A porta abriu. Salve ele antes que Chucky e Ghostface cheguem.");
    this.iniciarContagemResgate();
    this.mostrarFeedback("As lembrancas acenderam o caminho. Agora ela precisa te buscar no escuro.", "#fff3bf");

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

  iniciarContagemResgate(duration = RESCUE_COUNTDOWN_MS) {
    this.rescueDeadline = this.time.now + duration;
    this.timerText.setVisible(true);
  }

  atualizarTimerResgate(time) {
    if (!this.rescueReady || this.guiSaved || !this.rescueDeadline) {
      if (this.timerText) {
        this.timerText.setVisible(false);
      }
      return;
    }

    const remaining = Math.max(0, this.rescueDeadline - time);
    const seconds = Math.ceil(remaining / 1000);
    this.timerText.setVisible(true).setText(`Resgate: ${seconds}s`);
    this.timerText.setColor(seconds <= 12 ? "#ff8fab" : "#ffcfdf");

    if (remaining <= 0) {
      this.mostrarFalhaResgate();
    }
  }

  mostrarFalhaResgate() {
    if (this.rescueFailed || this.guiSaved) {
      return;
    }

    this.rescueFailed = true;
    this.continuesUsed += 1;
    this.player.body.setVelocity(0, 0);
    this.chucky.body.setVelocity(0, 0);
    this.ghostface.body.setVelocity(0, 0);
    this.timerText.setVisible(false);

    const overlay = this.add
      .rectangle(0, 0, this.largura, this.altura, 0x05030a, 0.72)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(92);
    const gui = this.add
      .sprite(this.largura / 2, this.altura / 2 - 46, "guiScaredSprite", 0)
      .setDisplaySize(126, 126)
      .setScrollFactor(0)
      .setDepth(94);
    gui.anims.play("gui-scared", true);
    const chucky = this.add
      .sprite(this.largura / 2 - 155, this.altura / 2 - 30, "chuckySprite", 10)
      .setDisplaySize(128, 112)
      .setScrollFactor(0)
      .setDepth(94);
    const ghost = this.add
      .sprite(this.largura / 2 + 155, this.altura / 2 - 34, "ghostfaceSprite", 19)
      .setDisplaySize(132, 132)
      .setScrollFactor(0)
      .setDepth(94)
      .setAlpha(0.86);
    const message = this.add
      .text(
        this.largura / 2,
        this.altura / 2 + 102,
        "Chucky e Ghostface chegaram ate voce primeiro. Mas ainda existe continue: você respira, volta para a luz e tenta de novo.",
        {
          fontSize: "22px",
          color: "#fff8e7",
          fontFamily: "Trebuchet MS",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 780 },
          stroke: "#05030a",
          strokeThickness: 5,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(95);
    const button = this.add
      .rectangle(this.largura / 2, this.altura / 2 + 208, 214, 50, 0xffe8a3, 0.2)
      .setStrokeStyle(2, 0xfff3bf, 0.8)
      .setScrollFactor(0)
      .setDepth(95)
      .setInteractive({ useHandCursor: true });
    const label = this.add
      .text(this.largura / 2, this.altura / 2 + 208, "CONTINUE", {
        fontSize: "22px",
        color: "#fff8e7",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(96)
      .setInteractive({ useHandCursor: true });

    this.failureOverlayItems = [overlay, gui, chucky, ghost, message, button, label];
    const retry = () => this.continuarDepoisDaFalha();
    button.on("pointerdown", retry);
    label.on("pointerdown", retry);
    button.on("pointerover", () => button.setFillStyle(0xffe8a3, 0.34));
    button.on("pointerout", () => button.setFillStyle(0xffe8a3, 0.2));
  }

  continuarDepoisDaFalha() {
    if (!this.rescueFailed) {
      return;
    }

    this.failureOverlayItems?.forEach((item) => item.destroy());
    this.failureOverlayItems = [];
    this.rescueFailed = false;
    this.lives = 3;
    this.player.setPosition(this.checkpoint.x, this.checkpoint.y);
    this.player.body.setVelocity(0, 0);
    this.playerVisual.setPosition(this.player.x, this.player.y);
    this.reposicionarInimigosDepoisDoDano();
    this.iniciarContagemResgate(RESCUE_COUNTDOWN_MS + 14000);
    this.mostrarFeedback("Continue. Dessa vez ela ja sabe por onde a luz volta.", "#fff3bf");
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

    if (this.memoriesCollected < this.totalMemories || !this.rescueReady) {
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
    if (this.memoriesCollected < this.totalMemories || !this.rescueReady) {
      return;
    }

    this.levelComplete = true;
    this.guiSaved = true;
    this.rescueFailed = false;
    this.rescueDeadline = null;
    this.heartFailureOverlayItems?.forEach((item) => item.destroy());
    this.failureOverlayItems?.forEach((item) => item.destroy());
    this.heartFailureOverlayItems = [];
    this.failureOverlayItems = [];
    this.player.body.setVelocity(0, 0);
    this.chuckyHunting = false;
    this.physics.world.pause();
    this.tocarMusicaDoResgate();
    this.esconderChucky();
    this.ghostface.setVisible(false);
    this.ghostfaceAura.setVisible(false);
    this.timerText.setVisible(false);

    this.player.setVisible(false);
    this.playerVisual.setVisible(false);
    this.guiRescue.setVisible(false);
    this.guiShadow.setVisible(false);
    this.guiPrompt.setVisible(false);
    this.guiAura.setAlpha(0.74).setTint(0xffe8a3);

    [
      this.hudShade,
      this.hudTitle,
      this.objectiveText,
      this.timerText,
      this.counterText,
      this.lifeText,
      this.chargeBack,
      this.chargeFill,
      this.chargeLabel,
      this.feedbackBox,
      this.feedbackText,
    ].forEach((item) => item?.setVisible(false));

    this.cameras.main.stopFollow();
    this.cameras.main.pan(GUI_RESCUE_X, FLOOR_Y - 118, 850, "Sine.easeInOut");

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
        this.altura / 2 + 124,
        "Voce sempre acreditou em mim, mesmo quando eu duvidei, e isso me ajuda mais do que consigo dizer. Voce me fez e me faz vencer medos, ate o medo de filmes de terror. Foi meu farol na fase mais sombria da minha vida, e segue sendo ate hoje. Te amo.",
        {
          fontSize: "22px",
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

    const okY = Math.min(this.altura - 50, this.altura / 2 + 258);
    this.finalOkButton = this.add
      .rectangle(this.largura / 2, okY, 154, 48, 0xffe8a3, 0.2)
      .setStrokeStyle(2, 0xfff3bf, 0.8)
      .setScrollFactor(0)
      .setDepth(90)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    this.finalOkLabel = this.add
      .text(this.largura / 2, okY, "OK", {
        fontSize: "23px",
        color: "#fff8e7",
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        stroke: "#05030a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(91)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    const finish = () => this.concluirFinalChucky();
    this.finalOkButton.on("pointerdown", finish);
    this.finalOkLabel.on("pointerdown", finish);
    this.finalOkButton.on("pointerover", () => this.finalOkButton.setFillStyle(0xffe8a3, 0.34));
    this.finalOkButton.on("pointerout", () => this.finalOkButton.setFillStyle(0xffe8a3, 0.2));

    this.tweens.add({
      targets: [this.finalHug, this.finalMessage, this.finalOkButton, this.finalOkLabel],
      alpha: 1,
      y: "-=10",
      duration: 900,
      ease: "Sine.easeOut",
    });
  }

  concluirFinalChucky() {
    if (this.finalAcknowledged) {
      return;
    }

    this.finalAcknowledged = true;
    this.game.events.emit("chucky-complete", {
      rescueSongSeek: this.musicaResgate?.seek || 0,
    });
  }

  jogadoraEmZonaSegura() {
    return this.entidadeEmZonaSegura(this.player);
  }

  entidadeEmZonaSegura(entity) {
    if (!entity) {
      return false;
    }

    return this.safeZoneVisuals.some(
      (zone) => Phaser.Math.Distance.Between(entity.x, entity.y, zone.x, FLOOR_Y - 42) < zone.radius
    );
  }

  atualizarHud() {
    this.counterText.setText(`Lembrancas: ${this.memoriesCollected}/${this.totalMemories}`);
    this.lifeText.setText(`Coragem: ${"♥ ".repeat(this.lives).trim()}`);
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
    if (this.trilhaChuckyAtivada || !this.sound) {
      return;
    }

    this.trilhaChuckyAtivada = true;
    this.trilhaChucky = this.sound.add("chuckyTheme", {
      loop: true,
      volume: 0.27,
    });
    this.trilhaChucky.play();
  }

  tocarMusicaDoResgate() {
    this.trilhaChucky?.stop();

    if (!this.musicaResgate) {
      this.musicaResgate = this.sound.add("runawayRescue", {
        loop: false,
        volume: 0.4,
      });
    }

    if (!this.musicaResgate.isPlaying) {
      this.musicaResgate.play();
    }
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

    if (this.trilhaChucky) {
      this.trilhaChucky.stop();
      this.trilhaChucky.destroy();
      this.trilhaChucky = null;
    }

    if (this.musicaResgate) {
      this.musicaResgate.stop();
      this.musicaResgate.destroy();
      this.musicaResgate = null;
    }
  }
}

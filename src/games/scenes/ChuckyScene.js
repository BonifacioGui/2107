import Phaser from "phaser";

const WORLD_WIDTH = 4200;
const WORLD_HEIGHT = 720;
const FLOOR_Y = 622;

const MEMORIES = [
  {
    id: "risada",
    texture: "memoryLaugh",
    x: 520,
    y: 500,
    title: "Risada encontrada",
    text: "Esse susto ainda vai virar historia para rir depois.",
  },
  {
    id: "carinho",
    texture: "memoryHeart",
    x: 1090,
    y: 390,
    title: "Carinho no escuro",
    text: "Tem coisas que iluminam mais que qualquer lanterna.",
  },
  {
    id: "carta",
    texture: "memoryLetter",
    x: 1790,
    y: 500,
    title: "Bilhete guardado",
    text: "Mesmo assustada, ela continua. E isso e bonito demais.",
  },
  {
    id: "abraco",
    texture: "memoryBear",
    x: 2640,
    y: 345,
    title: "Abraco pequeno",
    text: "No meio do susto, sempre existe um lugar seguro.",
  },
  {
    id: "promessa",
    texture: "memoryStar",
    x: 3370,
    y: 494,
    title: "Promessa acesa",
    text: "Falta pouco. A saida ja esta chamando.",
  },
];

const SAFE_ZONES = [
  { x: 760, y: FLOOR_Y - 42, radius: 112, name: "Luz baixa" },
  { x: 2240, y: FLOOR_Y - 42, radius: 118, name: "Cantinho seguro" },
  { x: 3220, y: FLOOR_Y - 42, radius: 108, name: "Respira aqui" },
];

const CAUGHT_MESSAGES = [
  "Voce se assustou, mas ainda pode continuar.",
  "Foi so um susto. Respira e tenta de novo.",
  "O medo apareceu, mas nao venceu.",
  "Respira. A saida ainda esta ali.",
];

export default class ChuckyScene extends Phaser.Scene {
  constructor() {
    super("ChuckyScene");
  }

  preload() {
    this.load.spritesheet(
      "livinhaSprite",
      "/assets/characters/livinha-spritesheet.png",
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );

    this.load.spritesheet(
      "chuckySprite",
      "/assets/characters/chucky-spritesheet.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
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
    this.checkpoint = { x: 100, y: FLOOR_Y - 82 };
    this.lastCaughtAt = -9999;
    this.lastSafeZone = null;
    this.levelComplete = false;
    this.chuckyHunting = false;
    this.chuckyStunnedUntil = 0;
    this.chuckyHideAt = 0;
    this.nextScareAt = 4200;

    this.cameras.main.setBackgroundColor("#070512");
    this.cameras.main.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);

    this.criarTexturasGeradas();
    this.criarAnimacoes();
    this.criarLojaEscura();
    this.criarPlataformas();
    this.criarZonasSeguras();
    this.criarLembrancas();
    this.criarPortaFinal();
    this.criarPersonagem();
    this.criarChucky();
    this.criarHud();
    this.criarControles();
    this.criarColisoes();
    this.prepararTrilhaChucky();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(260, 150);

    this.mostrarFeedback(
      "Alguns sustos parecem grandes demais... mas ela nao esta sozinha.",
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

  criarTexturasGeradas() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x312a3f, 1);
    g.fillRect(0, 0, 192, 28);
    g.fillStyle(0x5a536d, 1);
    g.fillRect(0, 0, 192, 6);
    g.fillStyle(0xf3c85f, 1);
    for (let x = 10; x < 192; x += 28) {
      g.fillRect(x, 4, 12, 3);
    }
    g.generateTexture("toyPlatform", 192, 28);
    g.clear();

    g.fillStyle(0x2a2234, 1);
    g.fillRoundedRect(0, 0, 172, 124, 6);
    g.fillStyle(0x191321, 1);
    g.fillRect(12, 18, 148, 18);
    g.fillRect(12, 54, 148, 18);
    g.fillRect(12, 90, 148, 18);
    g.fillStyle(0xd65a7a, 1);
    g.fillRect(20, 20, 20, 14);
    g.fillStyle(0x72d6ff, 1);
    g.fillRect(58, 55, 26, 15);
    g.fillStyle(0xf5c542, 1);
    g.fillCircle(124, 28, 8);
    g.fillStyle(0x8ce99a, 1);
    g.fillCircle(126, 96, 10);
    g.generateTexture("toyShelf", 172, 124);
    g.clear();

    g.fillStyle(0x111827, 1);
    g.fillRoundedRect(0, 0, 86, 128, 5);
    g.fillStyle(0x432436, 1);
    g.fillRoundedRect(9, 8, 68, 112, 4);
    g.fillStyle(0xf5c542, 1);
    g.fillCircle(64, 66, 4);
    g.generateTexture("exitDoorClosed", 86, 128);
    g.clear();

    g.fillStyle(0x151d2f, 1);
    g.fillRoundedRect(0, 0, 86, 128, 5);
    g.fillStyle(0xffe8a3, 1);
    g.fillRoundedRect(12, 10, 62, 108, 4);
    g.fillStyle(0x4cc9f0, 0.55);
    g.fillRect(20, 18, 46, 92);
    g.generateTexture("exitDoorOpen", 86, 128);
    g.clear();

    this.criarTexturaFoto(g);
    this.criarTexturaCarta(g);
    this.criarTexturaCoracao(g);
    this.criarTexturaUrso(g);
    this.criarTexturaEstrela(g);
    this.criarTexturaRisada(g);
    this.criarTexturaLanterna(g);

    g.destroy();
  }

  criarTexturaFoto(g) {
    g.fillStyle(0xf9fafb, 1);
    g.fillRoundedRect(5, 3, 54, 46, 5);
    g.fillStyle(0x2f3b55, 1);
    g.fillRect(10, 9, 44, 28);
    g.fillStyle(0xf5c542, 1);
    g.fillCircle(43, 17, 5);
    g.fillStyle(0x7dd3fc, 1);
    g.fillTriangle(12, 37, 30, 20, 52, 37);
    g.fillStyle(0xff6f91, 1);
    g.fillRect(17, 42, 28, 3);
    g.generateTexture("memoryPhoto", 64, 54);
    g.clear();
  }

  criarTexturaCarta(g) {
    g.fillStyle(0xfff7df, 1);
    g.fillRoundedRect(6, 6, 52, 38, 4);
    g.lineStyle(3, 0xd6a85f, 1);
    g.strokeTriangle(8, 8, 32, 30, 56, 8);
    g.lineStyle(2, 0x9a6b3b, 1);
    g.lineBetween(16, 34, 48, 34);
    g.generateTexture("memoryLetter", 64, 54);
    g.clear();
  }

  criarTexturaCoracao(g) {
    g.fillStyle(0xff5d8f, 1);
    g.fillCircle(24, 22, 13);
    g.fillCircle(40, 22, 13);
    g.fillTriangle(13, 28, 51, 28, 32, 52);
    g.lineStyle(3, 0xffc2d1, 1);
    g.strokeCircle(24, 22, 13);
    g.strokeCircle(40, 22, 13);
    g.generateTexture("memoryHeart", 64, 58);
    g.clear();
  }

  criarTexturaUrso(g) {
    g.fillStyle(0xb87a4b, 1);
    g.fillCircle(20, 16, 8);
    g.fillCircle(44, 16, 8);
    g.fillCircle(32, 28, 20);
    g.fillStyle(0xf2c18a, 1);
    g.fillCircle(32, 33, 9);
    g.fillStyle(0x14101c, 1);
    g.fillCircle(25, 25, 3);
    g.fillCircle(39, 25, 3);
    g.fillCircle(32, 31, 3);
    g.generateTexture("memoryBear", 64, 58);
    g.clear();
  }

  criarTexturaEstrela(g) {
    g.fillStyle(0xf5c542, 1);
    g.fillPoints(
      [
        { x: 32, y: 4 },
        { x: 39, y: 24 },
        { x: 60, y: 24 },
        { x: 43, y: 36 },
        { x: 49, y: 56 },
        { x: 32, y: 44 },
        { x: 15, y: 56 },
        { x: 21, y: 36 },
        { x: 4, y: 24 },
        { x: 25, y: 24 },
      ],
      true
    );
    g.lineStyle(3, 0xfff3bf, 1);
    g.strokePoints(
      [
        { x: 32, y: 4 },
        { x: 39, y: 24 },
        { x: 60, y: 24 },
        { x: 43, y: 36 },
        { x: 49, y: 56 },
        { x: 32, y: 44 },
        { x: 15, y: 56 },
        { x: 21, y: 36 },
        { x: 4, y: 24 },
        { x: 25, y: 24 },
      ],
      true
    );
    g.generateTexture("memoryStar", 64, 60);
    g.clear();
  }

  criarTexturaRisada(g) {
    g.fillStyle(0xffe8a3, 1);
    g.fillCircle(32, 28, 21);
    g.fillStyle(0x14101c, 1);
    g.fillCircle(24, 24, 3);
    g.fillCircle(40, 24, 3);
    g.lineStyle(4, 0x14101c, 1);
    g.beginPath();
    g.arc(32, 30, 10, 0.15, Math.PI - 0.15, false);
    g.strokePath();
    g.fillStyle(0xff6f91, 1);
    g.fillCircle(18, 31, 4);
    g.fillCircle(46, 31, 4);
    g.generateTexture("memoryLaugh", 64, 58);
    g.clear();
  }

  criarTexturaLanterna(g) {
    g.fillStyle(0x30384f, 1);
    g.fillRoundedRect(8, 20, 42, 16, 5);
    g.fillStyle(0x9ca3af, 1);
    g.fillRoundedRect(46, 17, 12, 22, 4);
    g.fillStyle(0xf5c542, 1);
    g.fillCircle(55, 28, 5);
    g.fillStyle(0x111827, 1);
    g.fillRect(17, 24, 18, 8);
    g.generateTexture("flashlightIcon", 64, 56);
    g.clear();
  }

  criarAnimacoes() {
    this.criarAnimacao({
      key: "chucky-idle",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 2, end: 5 }),
      frameRate: 4,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "chucky-walk",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 6, end: 13 }),
      frameRate: 8,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "chucky-scare",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 14, end: 19 }),
      frameRate: 7,
      repeat: -1,
    });
    this.criarAnimacao({
      key: "chucky-stun",
      frames: this.anims.generateFrameNumbers("chuckySprite", { start: 20, end: 23 }),
      frameRate: 5,
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
      frames: this.anims.generateFrameNumbers("livinhaSprite", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  criarAnimacao(config) {
    if (!this.anims.exists(config.key)) {
      this.anims.create(config);
    }
  }

  criarLojaEscura() {
    for (let x = 0; x < this.worldWidth; x += 400) {
      this.add.rectangle(x + 200, 250, 400, 500, 0x14101c, 1).setDepth(-30);
      this.add.rectangle(x + 200, 250, 392, 492, 0x1d1728, 0.96).setDepth(-29);
      this.add.rectangle(x + 200, 494, 400, 6, 0x342842, 1).setDepth(-28);
    }

    for (let x = 160; x < this.worldWidth; x += 520) {
      this.add.image(x, 450, "toyShelf").setDisplaySize(190, 136).setDepth(-15);
    }

    for (let x = 430; x < this.worldWidth; x += 660) {
      const janela = this.add.rectangle(x, 205, 112, 86, 0x07111f, 1).setDepth(-20);
      janela.setStrokeStyle(3, 0x312a3f, 1);
      this.add.rectangle(x, 205, 4, 86, 0x312a3f, 1).setDepth(-19);
      this.add.rectangle(x, 205, 112, 4, 0x312a3f, 1).setDepth(-19);
      this.add.circle(x - 24, 195, 3, 0xf87171, 0.45).setDepth(-18);
      this.add.circle(x + 24, 195, 3, 0xf87171, 0.45).setDepth(-18);
    }

    for (let x = 140; x < this.worldWidth; x += 190) {
      const caixa = this.add.rectangle(
        x,
        FLOOR_Y - 30,
        Phaser.Math.Between(42, 78),
        Phaser.Math.Between(28, 48),
        Phaser.Utils.Array.GetRandom([0x4b355f, 0x5a2d3b, 0x35415f]),
        1
      );
      caixa.setStrokeStyle(2, 0x221827, 0.8).setDepth(-4);
    }

    this.chuckyPeek = this.add
      .sprite(0, 0, "chuckySprite", 0)
      .setDisplaySize(72, 72)
      .setDepth(7)
      .setVisible(false);

    this.flashlightBeam = this.add.graphics().setDepth(18);
    this.darkPulse = this.add
      .rectangle(0, 0, this.largura, this.altura, 0x000000, 0.16)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(55)
      .setVisible(false);
  }

  criarPlataformas() {
    this.platforms = this.physics.add.staticGroup();
    this.criarPlataforma(this.worldWidth / 2, FLOOR_Y + 22, this.worldWidth, 80, 0x100d18);

    [
      { x: 500, y: 535, w: 360 },
      { x: 1060, y: 440, w: 320 },
      { x: 1580, y: 540, w: 360 },
      { x: 2260, y: 460, w: 340 },
      { x: 2670, y: 395, w: 260 },
      { x: 3180, y: 540, w: 380 },
      { x: 3620, y: 455, w: 300 },
    ].forEach((p) => {
      const img = this.add.image(p.x, p.y, "toyPlatform").setDisplaySize(p.w, 34).setDepth(4);
      const body = this.add.zone(p.x, p.y + 4, p.w, 28);
      this.physics.add.existing(body, true);
      this.platforms.add(body);
      body.visual = img;
    });
  }

  criarPlataforma(x, y, width, height, color) {
    const rect = this.add.rectangle(x, y, width, height, color, 1).setDepth(3);
    this.physics.add.existing(rect, true);
    this.platforms.add(rect);
    return rect;
  }

  criarZonasSeguras() {
    this.safeZoneVisuals = SAFE_ZONES.map((zone) => {
      const glow = this.add
        .circle(zone.x, zone.y, zone.radius, 0xffe8a3, 0.12)
        .setDepth(8)
        .setBlendMode(Phaser.BlendModes.ADD);
      const lamp = this.add
        .image(zone.x, zone.y - 34, "flashlightIcon")
        .setDisplaySize(48, 40)
        .setDepth(9);
      const floor = this.add
        .ellipse(zone.x, zone.y + 36, zone.radius * 1.4, 24, 0xffe8a3, 0.18)
        .setDepth(7);

      this.tweens.add({
        targets: glow,
        alpha: 0.2,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });

      return { ...zone, glow, lamp, floor, activated: false };
    });
  }

  criarLembrancas() {
    this.memories = this.physics.add.staticGroup();

    MEMORIES.forEach((memory) => {
      const item = this.memories.create(memory.x, memory.y, memory.texture);
      item.setDisplaySize(52, 48);
      item.setDepth(15);
      item.memory = memory;
      item.baseY = memory.y;
      item.refreshBody();

      this.tweens.add({
        targets: item,
        y: memory.y - 10,
        duration: 900,
        yoyo: true,
        repeat: -1,
      });
    });
  }

  criarPortaFinal() {
    this.exitDoor = this.physics.add.sprite(
      this.worldWidth - 140,
      FLOOR_Y - 86,
      "exitDoorClosed"
    );
    this.exitDoor.setDisplaySize(92, 134).setDepth(12);
    this.exitDoor.body.setAllowGravity(false);
    this.exitDoor.body.setImmovable(true);
    this.exitDoor.body.setSize(56, 112, true);
    this.exitDoor.open = false;

    this.exitGlow = this.add
      .circle(this.exitDoor.x, this.exitDoor.y, 78, 0xffe8a3, 0.04)
      .setDepth(10)
      .setBlendMode(Phaser.BlendModes.ADD);
  }

  criarPersonagem() {
    this.player = this.physics.add.sprite(100, FLOOR_Y - 82, "livinhaSprite", 0);
    this.player.setDisplaySize(76, 76).setDepth(20);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(34, 58);
    this.player.body.setOffset(55, 56);
    this.player.anims.play("livinha-chucky-idle", true);
  }

  criarChucky() {
    this.chucky = this.physics.add.sprite(620, FLOOR_Y - 40, "chuckySprite", 2);
    this.chucky.setDisplaySize(72, 72).setDepth(19);
    this.chucky.body.setAllowGravity(false);
    this.chucky.body.setSize(32, 44);
    this.chucky.body.setOffset(16, 18);
    this.chucky.setVisible(false);
    this.chucky.body.enable = false;
  }

  criarHud() {
    this.hudTitle = this.add
      .text(this.largura / 2, 30, "Capitulo: O Susto que Vira Risada", {
        fontSize: "30px",
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
      .text(
        this.largura / 2,
        72,
        "Colete 5 lembrancas, use a lanterna e encontre a saida.",
        {
          fontSize: "18px",
          color: "#f5e7c8",
          fontFamily: "Trebuchet MS",
          stroke: "#05030a",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(80);

    this.counterText = this.add
      .text(28, 30, "", {
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
      .text(28, 58, "", {
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
      .rectangle(this.largura - 220, 42, 170, 14, 0xffffff, 0.14)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(80);
    this.chargeFill = this.add
      .rectangle(this.largura - 220, 42, 170, 14, 0xffe8a3, 0.9)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(81);
    this.chargeLabel = this.add
      .text(this.largura - 220, 62, "Lanterna: X ou F", {
        fontSize: "13px",
        color: "#f5e7c8",
        fontFamily: "Trebuchet MS",
        stroke: "#05030a",
        strokeThickness: 3,
      })
      .setScrollFactor(0)
      .setDepth(80);

    this.feedbackBox = this.add
      .rectangle(this.largura / 2, this.altura - 86, 880, 82, 0x080613, 0.82)
      .setStrokeStyle(1, 0xffe8a3, 0.34)
      .setScrollFactor(0)
      .setDepth(78)
      .setVisible(false);
    this.feedbackText = this.add
      .text(this.largura / 2, this.altura - 86, "", {
        fontSize: "20px",
        color: "#fff8e7",
        fontFamily: "Trebuchet MS",
        align: "center",
        wordWrap: { width: 790 },
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
    this.physics.add.overlap(this.player, this.chucky, this.serPegaPorChucky, null, this);
  }

  atualizarJogadora() {
    const speed = 292;
    const jump = -570;
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
      this.player.setFlipX(false);
    } else if (right) {
      this.player.body.setVelocityX(speed);
      this.playerDirection = 1;
      this.player.setFlipX(true);
    }

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(jump);
    }

    const moving = Math.abs(this.player.body.velocity.x) > 5;
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
    const startX = this.player.x + dir * 30;
    const startY = this.player.y - 8;
    const endX = startX + dir * 390;

    this.flashlightBeam.fillStyle(0xffe8a3, 0.16);
    this.flashlightBeam.fillTriangle(startX, startY - 24, startX, startY + 24, endX, startY);
    this.flashlightBeam.fillStyle(0xfff3bf, 0.12);
    this.flashlightBeam.fillCircle(endX, startY, 82);
    this.flashlightBeam.lineStyle(2, 0xffe8a3, 0.22);
    this.flashlightBeam.strokeTriangle(startX, startY - 24, startX, startY + 24, endX, startY);

    this.tentarAfastarChuckyComLanterna();
  }

  tentarAfastarChuckyComLanterna() {
    if (!this.chuckyHunting || !this.chucky.visible || this.time.now < this.chuckyStunnedUntil) {
      return;
    }

    const dir = this.playerDirection;
    const ahead = dir > 0 ? this.chucky.x - this.player.x : this.player.x - this.chucky.x;
    const vertical = Math.abs(this.chucky.y - this.player.y);

    if (ahead > 0 && ahead < 430 && vertical < 118) {
      this.chuckyStunnedUntil = this.time.now + 2200;
      this.chucky.body.setVelocityX(0);
      this.chucky.anims.play("chucky-stun", true);
      this.mostrarTextoFlutuante(this.chucky.x, this.chucky.y - 54, "luz!", "#fff3bf");
      this.mostrarFeedback("A luz segurou o susto por alguns segundos.", "#fff3bf");
    }
  }

  atualizarChucky(time) {
    if (!this.chuckyHunting || !this.chucky.visible) {
      return;
    }

    this.chucky.y = FLOOR_Y - 43;

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
      this.chucky.setAlpha(0.62);
      return;
    }

    this.chucky.setAlpha(1);
    const dx = this.player.x - this.chucky.x;
    const dir = Math.sign(dx) || 1;
    const speed = 84 + this.memoriesCollected * 16;
    this.chucky.body.setVelocityX(dir * speed);
    this.chucky.setFlipX(dir < 0);
    this.chucky.anims.play(Math.abs(dx) < 210 ? "chucky-scare" : "chucky-walk", true);
  }

  atualizarZonasSeguras() {
    const activeZone = this.safeZoneVisuals.find(
      (zone) => Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y) < zone.radius
    );

    if (!activeZone) {
      this.lastSafeZone = null;
      return;
    }

    this.checkpoint = { x: activeZone.x, y: FLOOR_Y - 82 };
    this.lastSafeZone = activeZone;

    if (!activeZone.activated) {
      activeZone.activated = true;
      activeZone.floor.setFillStyle(0xffe8a3, 0.3);
      this.mostrarFeedback(`${activeZone.name}. Aqui o susto fica menor.`, "#ffe8a3");
    }
  }

  atualizarSustosLeves(time) {
    if (time < this.nextScareAt || this.levelComplete) {
      return;
    }

    this.nextScareAt = time + Phaser.Math.Between(6200, 9800);
    const cameraX = this.cameras.main.scrollX;
    const x = Phaser.Math.Clamp(
      cameraX + Phaser.Math.Between(380, 1180),
      180,
      this.worldWidth - 260
    );
    const y = Phaser.Math.Between(170, 255);

    this.chuckyPeek.setPosition(x, y).setVisible(true).setAlpha(0);
    this.chuckyPeek.setFrame(Phaser.Utils.Array.GetRandom([0, 1, 14, 16]));
    this.darkPulse.setVisible(true).setAlpha(0.22);

    this.tweens.add({
      targets: this.chuckyPeek,
      alpha: 1,
      y: y - 8,
      duration: 160,
      yoyo: true,
      hold: 380,
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
    const x = Phaser.Math.Clamp(this.player.x + side * Phaser.Math.Between(360, 520), 180, this.worldWidth - 280);

    this.chucky.enableBody(false, x, FLOOR_Y - 43, true, true);
    this.chucky.body.enable = true;
    this.chucky.setVisible(true).setAlpha(1);
    this.chuckyHunting = true;
    this.chuckyHideAt = this.time.now + 6500 + this.memoriesCollected * 650;
    this.chuckyStunnedUntil = 0;
    this.chucky.anims.play("chucky-scare", true);
    this.mostrarFeedback("Corre! Mas sem esquecer de respirar.", "#ffcfdf");
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
    this.exitDoor.open = true;
    this.exitDoor.setTexture("exitDoorOpen");
    this.exitGlow.setFillStyle(0xffe8a3, 0.18);
    this.mostrarFeedback("Voce encontrou todas as lembrancas. A saida abriu.", "#fff3bf");
    this.esconderChucky();

    this.tweens.add({
      targets: this.exitGlow,
      alpha: 0.32,
      scaleX: 1.22,
      scaleY: 1.22,
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

    this.levelComplete = true;
    this.player.body.setVelocity(0, 0);
    this.esconderChucky();
    this.mostrarFeedback(
      "Voce passou pelo susto. Correu, respirou e continuou. No fim, ate o medo virou lembranca nossa.",
      "#fff3bf"
    );
    this.time.delayedCall(2600, () => {
      this.game.events.emit("chucky-complete");
    });
  }

  jogadoraEmZonaSegura() {
    return this.safeZoneVisuals.some(
      (zone) => Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y) < zone.radius
    );
  }

  atualizarHud() {
    this.counterText.setText(`Lembrancas: ${this.memoriesCollected}/${this.totalMemories}`);
    this.lifeText.setText(`Vidas: ${this.lives}/3`);
    this.chargeFill.setDisplaySize(Math.max(0, 170 * (this.flashlightCharge / 100)), 14);
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
      delay: 2700,
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
    for (let i = 0; i < 14; i += 1) {
      const spark = this.add
        .circle(x, y, Phaser.Math.Between(3, 7), color, 0.78)
        .setDepth(60)
        .setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-74, 74),
        y: y + Phaser.Math.Between(-64, 36),
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
      to: 0.045,
      duration: 1300,
      onUpdate: (tween) => {
        if (this.trilhaChuckyMaster) {
          this.trilhaChuckyMaster.gain.value = tween.getValue();
        }
      },
    });

    this.trilhaChuckyTimer = this.time.addEvent({
      delay: 720,
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
    const notas = [130.81, 146.83, 155.56, 196.0, 220.0];
    const nota = Phaser.Utils.Array.GetRandom(notas);

    this.tocarOscilador(agora, nota, 0.32, "triangle", 0.11);

    if (Phaser.Math.Between(0, 100) > 66) {
      this.tocarOscilador(agora + 0.18, nota * 1.5, 0.18, "sine", 0.05);
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

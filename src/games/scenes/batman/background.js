import Phaser from "phaser";

export function criarCenarioGotham(scene) {
  scene.gothamBackdrop = scene.add
    .image(scene.largura / 2, scene.altura / 2, "gothamBackdrop")
    .setDisplaySize(scene.largura * 1.16, scene.altura * 1.04)
    .setDepth(-56)
    .setScrollFactor(0);

  scene.gothamSky = scene.add
    .image(scene.largura / 2, scene.altura / 2, "gothamSky")
    .setDisplaySize(scene.largura * 1.08, scene.altura * 1.04)
    .setAlpha(0.16)
    .setTint(0x8da7d8)
    .setDepth(-50)
    .setScrollFactor(0);

  scene.gothamSkyShade = scene.add
    .rectangle(
      scene.largura / 2,
      scene.altura / 2,
      scene.largura,
      scene.altura,
      0x02040c,
      0.12
    )
    .setDepth(-49)
    .setScrollFactor(0);

  scene.gothamMoonGlow = scene.add
    .circle(scene.largura * 0.2, scene.altura * 0.36, 170, 0xb9cfff, 0.08)
    .setDepth(-48)
    .setScrollFactor(0);

  scene.gothamBuildingsBack = scene.add
    .image(scene.largura / 2, scene.altura + 28, "gothamBuildingsBack")
    .setOrigin(0.5, 1)
    .setDisplaySize(scene.largura * 1.18, scene.altura * 0.66)
    .setAlpha(0.22)
    .setDepth(-40)
    .setScrollFactor(0);

  scene.gothamBuildingsFront = scene.add
    .image(scene.largura / 2, scene.altura + 42, "gothamBuildingsFront")
    .setOrigin(0.5, 1)
    .setDisplaySize(scene.largura * 1.24, scene.altura * 0.58)
    .setAlpha(0.18)
    .setDepth(-32)
    .setScrollFactor(0);

  scene.gothamFogBack = scene.add
    .tileSprite(
      scene.largura / 2,
      scene.altura - 52,
      scene.largura * 1.28,
      220,
      "gothamFog"
    )
    .setOrigin(0.5, 1)
    .setAlpha(0.06)
    .setDepth(-28)
    .setScrollFactor(0);

  scene.gothamFog = scene.add
    .tileSprite(
      scene.largura / 2,
      scene.altura + 8,
      scene.largura * 1.3,
      180,
      "gothamFog"
    )
    .setOrigin(0.5, 1)
    .setAlpha(0.13)
    .setDepth(-12)
    .setScrollFactor(0);

  scene.gothamParallax = [
    {
      target: scene.gothamBackdrop,
      baseX: scene.gothamBackdrop.x,
      strength: 10,
      drift: 1,
    },
    { target: scene.gothamSky, baseX: scene.gothamSky.x, strength: 16, drift: 2 },
    {
      target: scene.gothamMoonGlow,
      baseX: scene.gothamMoonGlow.x,
      strength: 26,
      drift: 4,
    },
    {
      target: scene.gothamBuildingsBack,
      baseX: scene.gothamBuildingsBack.x,
      strength: 38,
      drift: 6,
    },
    {
      target: scene.gothamBuildingsFront,
      baseX: scene.gothamBuildingsFront.x,
      strength: 62,
      drift: 9,
    },
    {
      target: scene.gothamFogBack,
      baseX: scene.gothamFogBack.x,
      strength: 84,
      drift: 14,
    },
    {
      target: scene.gothamFog,
      baseX: scene.gothamFog.x,
      strength: 112,
      drift: 18,
    },
  ];

  for (let i = 0; i < 30; i++) {
    const x = Phaser.Math.Between(0, scene.largura);
    const y = Phaser.Math.Between(120, scene.altura);

    const gota = scene.add
      .rectangle(x, y, 2, 16, 0x9eb7ff, 0.13)
      .setDepth(-1)
      .setScrollFactor(0);

    scene.tweens.add({
      targets: gota,
      y: scene.altura + 60,
      x: x + 70,
      duration: Phaser.Math.Between(1100, 1900),
      repeat: -1,
      delay: Phaser.Math.Between(0, 900),
    });
  }
}

export function atualizarCenarioGotham(scene) {
  const playerOffset = scene.player
    ? Phaser.Math.Clamp(scene.player.x / (scene.worldWidth ?? scene.largura) - 0.5, -0.5, 0.5)
    : 0;
  const wind = Math.sin(scene.time.now * 0.00035);

  if (scene.gothamParallax) {
    scene.gothamParallax.forEach((layer) => {
      if (!layer.target) {
        return;
      }

      layer.target.x =
        layer.baseX - playerOffset * layer.strength + wind * layer.drift;
    });
  }

  if (scene.gothamFogBack) {
    scene.gothamFogBack.tilePositionX += 0.05;
  }

  if (scene.gothamFog) {
    scene.gothamFog.tilePositionX += 0.16;
    scene.gothamFog.tilePositionY = wind * 8;
  }
}

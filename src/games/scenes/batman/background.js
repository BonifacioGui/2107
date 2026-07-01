import Phaser from "phaser";

export function criarCenarioGotham(scene) {
  scene.gothamSky = scene.add
    .image(scene.largura / 2, scene.altura / 2, "gothamSky")
    .setDisplaySize(scene.largura, scene.altura)
    .setDepth(-50);

  scene.add
    .rectangle(
      scene.largura / 2,
      scene.altura / 2,
      scene.largura,
      scene.altura,
      0x02040c,
      0.05
    )
    .setDepth(-49);

  scene.gothamBuildingsBack = scene.add
    .image(scene.largura / 2, scene.altura + 28, "gothamBuildingsBack")
    .setOrigin(0.5, 1)
    .setDisplaySize(scene.largura * 1.08, scene.altura * 0.66)
    .setAlpha(0.76)
    .setDepth(-40);

  scene.gothamBuildingsFront = scene.add
    .image(scene.largura / 2, scene.altura + 42, "gothamBuildingsFront")
    .setOrigin(0.5, 1)
    .setDisplaySize(scene.largura * 1.12, scene.altura * 0.58)
    .setAlpha(0.42)
    .setDepth(-32);

  scene.gothamFog = scene.add
    .tileSprite(
      scene.largura / 2,
      scene.altura + 8,
      scene.largura * 1.2,
      180,
      "gothamFog"
    )
    .setOrigin(0.5, 1)
    .setAlpha(0.08)
    .setDepth(-12);

  for (let i = 0; i < 30; i++) {
    const x = Phaser.Math.Between(0, scene.largura);
    const y = Phaser.Math.Between(120, scene.altura);

    const gota = scene.add
      .rectangle(x, y, 2, 16, 0x9eb7ff, 0.13)
      .setDepth(-1);

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
  if (scene.gothamFog) {
    scene.gothamFog.tilePositionX += 0.1;
  }
}
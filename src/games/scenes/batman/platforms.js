export function criarPlataformas(scene) {
  scene.plataformas = scene.physics.add.staticGroup();
  scene.plataformasMoveis = scene.physics.add.staticGroup();

  const larguraMundo = scene.worldWidth ?? scene.largura;

  criarPlataforma(scene, {
    x: larguraMundo / 2,
    y: scene.chaoY,
    largura: larguraMundo + 220,
    altura: 44,
    tipo: "ground",
  });

  [
    { x: 470, y: scene.chaoY - 112, largura: 280 },
    { x: 860, y: scene.chaoY - 178, largura: 260 },
    { x: 1230, y: scene.chaoY - 112, largura: 330 },
    { x: 1650, y: scene.chaoY - 220, largura: 320 },
    { x: 2060, y: scene.chaoY - 310, largura: 280 },
    { x: 2460, y: scene.chaoY - 196, largura: 380 },
    { x: 2890, y: scene.chaoY - 126, largura: 310 },
    { x: 3270, y: scene.chaoY - 256, largura: 320 },
    { x: 3650, y: scene.chaoY - 162, largura: 360 },
    { x: 3950, y: scene.chaoY - 272, largura: 240 },
  ].forEach((plataforma) =>
    criarPlataforma(scene, {
      ...plataforma,
      altura: 28,
      tipo: "platform",
    })
  );

  criarPlataformaMovel(scene, {
    x: 2250,
    y: scene.chaoY - 246,
    largura: 190,
    altura: 28,
    movimento: { x: 180, y: 0, duracao: 2300 },
  });

  criarPlataformaMovel(scene, {
    x: 3070,
    y: scene.chaoY - 206,
    largura: 180,
    altura: 28,
    movimento: { x: 0, y: -92, duracao: 2100 },
  });
}

function criarPlataforma(scene, { x, y, largura, altura, tipo }) {
  const textura = tipo === "ground" ? "rooftopGround" : "rooftopPlatform";
  const texturaCarregada = texturaExisteDeVerdade(scene, textura);

  if (texturaCarregada) {
    criarPlataformaComImagem(scene, {
      x,
      y,
      largura,
      altura,
      tipo,
      textura,
    });
  } else {
    criarPlataformaFallback(scene, {
      x,
      y,
      largura,
      altura,
      tipo,
    });
  }

  const colisor = scene.add.zone(x, y, largura, altura);
  scene.physics.add.existing(colisor, true);
  scene.plataformas.add(colisor);
}

function criarPlataformaComImagem(scene, { x, y, largura, altura, tipo, textura }) {
  const superficieY = y - altura / 2;

  if (tipo === "ground") {
    scene.add
      .rectangle(x, superficieY + 95, largura, 190, 0x02040a, 0.72)
      .setDepth(8);

    scene.add
      .image(x, superficieY + 42, textura)
      .setDisplaySize(largura, 260)
      .setAlpha(1)
      .setDepth(10);

    return;
  }

  scene.add
    .rectangle(x, superficieY + 36, largura, 54, 0x02040a, 0.62)
    .setDepth(8);

  scene.add
    .image(x, superficieY + 14, textura)
    .setDisplaySize(largura, 76)
    .setAlpha(1)
    .setDepth(10);
}

function texturaExisteDeVerdade(scene, chave) {
  if (!scene.textures.exists(chave)) {
    return false;
  }

  const textura = scene.textures.get(chave);
  const source = textura?.source?.[0];

  if (!source) {
    return false;
  }

  return source.width > 64 && source.height > 32;
}

function criarPlataformaFallback(scene, { x, y, largura, altura, tipo }) {
  const superficieY = y - altura / 2;

  if (tipo === "ground") {
    scene.add
      .rectangle(x, y + 24, largura, 96, 0x050712, 1)
      .setDepth(10);

    scene.add
      .rectangle(x, superficieY, largura, 5, 0xf5c542, 0.7)
      .setDepth(11);

    return;
  }

  scene.add
    .rectangle(x, y + 12, largura, 48, 0x070b1d, 1)
    .setDepth(10);

  scene.add
    .rectangle(x, superficieY, largura, 4, 0xf5c542, 0.6)
    .setDepth(11);
}

function criarPlataformaMovel(scene, { x, y, largura, altura, movimento }) {
  const textura = "rooftopPlatform";
  const colisor = scene.add.zone(x, y, largura, altura + 10);
  scene.physics.add.existing(colisor, true);
  scene.plataformasMoveis.add(colisor);

  const sombra = scene.add
    .rectangle(x, y + 36, largura, 54, 0x02040a, 0.62)
    .setDepth(12);

  const plataforma = scene.add
    .image(x, y + 14, textura)
    .setDisplaySize(largura, 76)
    .setDepth(13);

  const brilho = scene.add
    .rectangle(x, y - altura / 2, largura, 4, 0xf5c542, 0.62)
    .setDepth(14);

  scene.tweens.add({
    targets: colisor,
    x: x + movimento.x,
    y: y + movimento.y,
    duration: movimento.duracao,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
    onUpdate: () => {
      plataforma.setPosition(colisor.x, colisor.y + 14);
      sombra.setPosition(colisor.x, colisor.y + 36);
      brilho.setPosition(colisor.x, colisor.y - altura / 2);
      colisor.body.updateFromGameObject();
    },
  });
}

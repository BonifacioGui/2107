export function criarPlataformas(scene) {
  scene.plataformas = scene.physics.add.staticGroup();

  criarPlataforma(scene, {
    x: scene.largura / 2,
    y: scene.chaoY,
    largura: scene.largura + 180,
    altura: 44,
    tipo: "ground",
  });

  criarPlataforma(scene, {
    x: scene.largura * 0.2,
    y: scene.chaoY - 110,
    largura: 300,
    altura: 28,
    tipo: "platform",
  });

  criarPlataforma(scene, {
    x: scene.largura * 0.45,
    y: scene.chaoY - 205,
    largura: 330,
    altura: 28,
    tipo: "platform",
  });

  criarPlataforma(scene, {
    x: scene.largura * 0.68,
    y: scene.chaoY - 105,
    largura: 340,
    altura: 28,
    tipo: "platform",
  });

  criarPlataforma(scene, {
    x: scene.largura * 0.86,
    y: scene.chaoY - 235,
    largura: 320,
    altura: 28,
    tipo: "platform",
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
    .rectangle(x, superficieY + 54, largura, 92, 0x02040a, 0.62)
    .setDepth(8);

  scene.add
    .image(x, superficieY + 22, textura)
    .setDisplaySize(largura, 130)
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
export const TEXTURES = [
  { name: 'Aircraft C', file: 'Aircraft C.jpg' },
  { name: 'Aircraft N', file: 'Aircraft N.jpg' },
  { name: 'Aircraft S', file: 'Aircraft S.jpg' },
  { name: 'REF 1', file: 'REF 1.jpg' }
];

export const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 8, z: 20 },
  minZoom: 2,
  maxZoom: 50
};

export const LIGHTING_CONFIG = {
  ambient: { color: 0xffffff, intensity: 1.2 },
  directional1: { color: 0xffffff, intensity: 2, position: { x: 10, y: 15, z: 10 } },
  directional2: { color: 0xffffff, intensity: 1.5, position: { x: -10, y: 10, z: -10 } },
  point: { color: 0xffffff, intensity: 1, position: { x: 0, y: 10, z: 0 } }
};

export const SCENE_CONFIG = {
  background: 0x1a1a1a,
  modelPath: `${process.env.PUBLIC_URL}/assets/futuristic_combat_jet/Futuristic combat jet.fbx`,
  texturePath: `${process.env.PUBLIC_URL}/assets/futuristic_combat_jet/textures/`,
  defaultTexture: 'Aircraft C.jpg',
  modelScale: 15
};

export const CONTROLS_CONFIG = {
  enableDamping: true,
  dampingFactor: 0.05
};

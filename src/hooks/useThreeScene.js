import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CAMERA_CONFIG, LIGHTING_CONFIG, SCENE_CONFIG, CONTROLS_CONFIG } from '../constants';

export const useThreeScene = (mountRef) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;
    
    // Prevent duplicate canvas creation
    if (currentMount.querySelector('canvas')) {
      console.log('Canvas already exists, skipping scene setup');
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_CONFIG.background);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far
    );
    camera.position.set(CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);
    console.log('Scene, camera, and renderer created');

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = CONTROLS_CONFIG.enableDamping;
    controls.dampingFactor = CONTROLS_CONFIG.dampingFactor;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(
      LIGHTING_CONFIG.ambient.color,
      LIGHTING_CONFIG.ambient.intensity
    );
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      LIGHTING_CONFIG.directional1.color,
      LIGHTING_CONFIG.directional1.intensity
    );
    directionalLight.position.set(
      LIGHTING_CONFIG.directional1.position.x,
      LIGHTING_CONFIG.directional1.position.y,
      LIGHTING_CONFIG.directional1.position.z
    );
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(
      LIGHTING_CONFIG.directional2.color,
      LIGHTING_CONFIG.directional2.intensity
    );
    directionalLight2.position.set(
      LIGHTING_CONFIG.directional2.position.x,
      LIGHTING_CONFIG.directional2.position.y,
      LIGHTING_CONFIG.directional2.position.z
    );
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(
      LIGHTING_CONFIG.point.color,
      LIGHTING_CONFIG.point.intensity
    );
    pointLight.position.set(
      LIGHTING_CONFIG.point.position.x,
      LIGHTING_CONFIG.point.position.y,
      LIGHTING_CONFIG.point.position.z
    );
    scene.add(pointLight);

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && rendererRef.current) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [mountRef]);

  return { sceneRef, cameraRef, rendererRef, controlsRef };
};

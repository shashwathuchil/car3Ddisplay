import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { SCENE_CONFIG } from '../constants';

export const useFBXLoader = (sceneRef, modelRef, setFbxAnimations, mixerRef) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const applyMaterialSettings = useCallback((child) => {
    if (!child.isMesh) return;

    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(mat => {
        mat.side = THREE.DoubleSide;
        mat.wireframe = false;
        mat.visible = true;
        mat.opacity = 1;
        mat.transparent = false;
        if (!mat.color) {
          mat.color = new THREE.Color(0x888888);
        }
        mat.needsUpdate = true;
      });
    } else {
      child.material = new THREE.MeshPhongMaterial({
        color: 0x888888,
        side: THREE.DoubleSide
      });
    }
    child.castShadow = true;
    child.receiveShadow = true;
    child.visible = true;
  }, []);

  const loadDefaultTexture = useCallback((fbx) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `${SCENE_CONFIG.texturePath}${SCENE_CONFIG.defaultTexture}`,
      (texture) => {
        console.log('Default texture loaded');
        fbx.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              mat.map = texture;
              mat.needsUpdate = true;
            });
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading default texture:', error);
      }
    );
  }, []);

  const loadModel = useCallback(() => {
    if (!sceneRef.current) return;
    
    // Prevent duplicate loading
    if (loadingRef.current || modelRef.current) {
      console.log('Model already loading or loaded, skipping');
      return;
    }
    
    loadingRef.current = true;
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      SCENE_CONFIG.modelPath,
      (fbx) => {
        console.log('FBX loaded successfully', fbx);

        if (fbx.animations && fbx.animations.length > 0) {
          console.log(`Found ${fbx.animations.length} animations`);
          setFbxAnimations(fbx.animations);
          mixerRef.current = new THREE.AnimationMixer(fbx);
        }

        let meshCount = 0;
        fbx.traverse((child) => {
          if (child.isMesh) {
            meshCount++;
            console.log('Mesh:', child.name, 'Visible:', child.visible);
          }
          applyMaterialSettings(child);
        });
        console.log(`Total meshes: ${meshCount}`);

        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        console.log('Model size:', size);
        console.log('Model center:', center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = SCENE_CONFIG.modelScale / maxDim;
        console.log('Calculated scale:', scale);

        fbx.scale.set(scale, scale, scale);
        fbx.position.sub(center.multiplyScalar(scale));
        fbx.position.y = 2;
        console.log('Model position:', fbx.position);

        sceneRef.current.add(fbx);
        modelRef.current = fbx;
        loadingRef.current = false;
        console.log('Model added to scene');

        loadDefaultTexture(fbx);
        setLoading(false);
      },
      (xhr) => {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`FBX: ${percentComplete.toFixed(2)}% loaded`);
      },
      (error) => {
        console.error('Error loading FBX:', error);
        setError('Failed to load 3D model');
        setLoading(false);
        loadingRef.current = false;
      }
    );
  }, [sceneRef, modelRef, setFbxAnimations, mixerRef, applyMaterialSettings, loadDefaultTexture]);

  return { loading, error, loadModel };
};

import './App.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeScene } from './hooks/useThreeScene';
import { useFBXLoader } from './hooks/useFBXLoader';
import { Controls } from './components/Controls';
import { TextureSelector } from './components/TextureSelector';
import { ZoomControls } from './components/ZoomControls';
import { LoadingOverlay } from './components/LoadingOverlay';
import { CAMERA_CONFIG, SCENE_CONFIG } from './constants';

function App() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef({ rotate: false });
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  
  const [selectedTexture, setSelectedTexture] = useState(SCENE_CONFIG.defaultTexture);
  const [animations, setAnimations] = useState({ rotate: false });
  const [fbxAnimations, setFbxAnimations] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState(null);

  const { sceneRef, cameraRef, rendererRef, controlsRef } = useThreeScene(mountRef);
  const { loading, error, loadModel } = useFBXLoader(sceneRef, modelRef, setFbxAnimations, mixerRef);

  const handleZoomIn = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(
        cameraRef.current.position.z - 1, 
        CAMERA_CONFIG.minZoom
      );
    }
  }, [cameraRef]);

  const handleZoomOut = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(
        cameraRef.current.position.z + 1, 
        CAMERA_CONFIG.maxZoom
      );
    }
  }, [cameraRef]);

  const toggleAnimation = useCallback(() => {
    setAnimations(prev => ({
      ...prev,
      rotate: !prev.rotate
    }));
    animationRef.current.rotate = !animationRef.current.rotate;
  }, []);

  const playFBXAnimation = useCallback((animationName) => {
    if (!mixerRef.current || fbxAnimations.length === 0) return;
    
    const clip = fbxAnimations.find(anim => anim.name === animationName);
    if (clip) {
      mixerRef.current.stopAllAction();
      const action = mixerRef.current.clipAction(clip);
      action.reset();
      action.play();
      setActiveAnimation(animationName);
    }
  }, [fbxAnimations]);

  const stopAllAnimations = useCallback(() => {
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      setActiveAnimation(null);
    }
  }, []);

  const handleTextureChange = useCallback((textureFile) => {
    setSelectedTexture(textureFile);
    if (!modelRef.current) return;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `${SCENE_CONFIG.texturePath}${textureFile}`,
      (texture) => {
        modelRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) 
              ? child.material 
              : [child.material];
            materials.forEach((mat) => {
              mat.map = texture;
              mat.needsUpdate = true;
            });
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      loadModel();
    }
  }, [sceneRef, loadModel]);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !controlsRef.current) {
      console.log('Animation loop waiting for refs:', {
        renderer: !!rendererRef.current,
        scene: !!sceneRef.current,
        camera: !!cameraRef.current,
        controls: !!controlsRef.current
      });
      return;
    }

    console.log('Starting animation loop');
    let animationId;
    let frameCount = 0;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controlsRef.current.update();
      
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }
      
      if (modelRef.current && animationRef.current.rotate) {
        modelRef.current.rotation.y += 0.01;
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      frameCount++;
      if (frameCount === 1 || frameCount === 60) {
        console.log(`Animation frame ${frameCount}, scene children:`, sceneRef.current.children.length);
      }
    };
    animate();

    return () => {
      console.log('Stopping animation loop');
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [rendererRef, sceneRef, cameraRef, controlsRef]);

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      <LoadingOverlay loading={loading} error={error} />
      <TextureSelector 
        selectedTexture={selectedTexture} 
        onTextureChange={handleTextureChange} 
      />
      <Controls
        animations={animations}
        fbxAnimations={fbxAnimations}
        activeAnimation={activeAnimation}
        onToggleRotate={toggleAnimation}
        onPlayAnimation={playFBXAnimation}
        onStopAll={stopAllAnimations}
      />
      <ZoomControls 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
      />
    </>
  );
}

export default App;

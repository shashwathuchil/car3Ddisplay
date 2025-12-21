import './App.css';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef({ rotate: false });
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState('Aircraft C.jpg');
  const [animations, setAnimations] = useState({
    rotate: false
  });
  const [fbxAnimations, setFbxAnimations] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState(null);

  const textures = [
    { name: 'Aircraft C', file: 'Aircraft C.jpg' },
    { name: 'Aircraft N', file: 'Aircraft N.jpg' },
    { name: 'Aircraft S', file: 'Aircraft S.jpg' },
    { name: 'REF 1', file: 'REF 1.jpg' }
  ];

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(cameraRef.current.position.z - 1, 2);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(cameraRef.current.position.z + 1, 50);
    }
  };

  const toggleAnimation = (animationType) => {
    setAnimations(prev => ({
      ...prev,
      [animationType]: !prev[animationType]
    }));
    animationRef.current[animationType] = !animationRef.current[animationType];
  };

  const playFBXAnimation = (animationName) => {
    if (mixerRef.current && fbxAnimations.length > 0) {
      const clip = fbxAnimations.find(anim => anim.name === animationName);
      if (clip) {
        mixerRef.current.stopAllAction();
        const action = mixerRef.current.clipAction(clip);
        action.reset();
        action.play();
        setActiveAnimation(animationName);
        console.log('Playing animation:', animationName);
      }
    }
  };

  const stopAllAnimations = () => {
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      setActiveAnimation(null);
      console.log('Stopped all animations');
    }
  };

  const handleTextureChange = (textureFile) => {
    setSelectedTexture(textureFile);
    if (modelRef.current) {
      const textureLoader = new THREE.TextureLoader();
      const newTexture = textureLoader.load(
        `/assets/futuristic_combat_jet/textures/${textureFile}`,
        () => {
          console.log(`Texture ${textureFile} loaded successfully`);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
        }
      );
      
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.map = newTexture;
              mat.needsUpdate = true;
            });
          } else {
            child.material.map = newTexture;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight2.position.set(-10, 10, -10);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);


    console.log('Starting to load 3D model...');
    
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/assets/futuristic_combat_jet/Futuristic combat jet.fbx',
      (fbx) => {
        console.log('FBX loaded successfully!', fbx);
        
        if (fbx.animations && fbx.animations.length > 0) {
          console.log(`Found ${fbx.animations.length} animations:`);
          fbx.animations.forEach((clip, index) => {
            console.log(`  ${index + 1}. ${clip.name} (duration: ${clip.duration.toFixed(2)}s)`);
          });
          setFbxAnimations(fbx.animations);
          
          mixerRef.current = new THREE.AnimationMixer(fbx);
          console.log('Animation mixer created');
        } else {
          console.log('No animations found in FBX file');
        }
        
        let meshCount = 0;
        let materialCount = 0;
        
        fbx.traverse((child) => {
          console.log('Child:', child.type, child.name);
          if (child.isMesh) {
            meshCount++;
            console.log('Mesh found:', child.name, 'Geometry:', child.geometry, 'Material:', child.material);
            
            if (child.material) {
              materialCount++;
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
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
                child.material.side = THREE.DoubleSide;
                child.material.wireframe = false;
                child.material.visible = true;
                child.material.opacity = 1;
                child.material.transparent = false;
                if (!child.material.color) {
                  child.material.color = new THREE.Color(0x888888);
                }
                child.material.needsUpdate = true;
              }
            } else {
              child.material = new THREE.MeshPhongMaterial({
                color: 0x888888,
                side: THREE.DoubleSide
              });
            }
            child.castShadow = true;
            child.receiveShadow = true;
            child.visible = true;
          }
        });
        
        console.log(`Found ${meshCount} meshes with ${materialCount} materials`);
        
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        console.log('Model size:', size);
        console.log('Model center:', center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 15 / maxDim;
        fbx.scale.set(scale, scale, scale);
        
        fbx.position.sub(center.multiplyScalar(scale));
        fbx.position.y = 0;
        
        scene.add(fbx);
        modelRef.current = fbx;
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          '/assets/futuristic_combat_jet/textures/Aircraft C.jpg',
          (texture) => {
            console.log('Default texture (Aircraft C) loaded');
            fbx.traverse((child) => {
              if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    mat.map = texture;
                    mat.needsUpdate = true;
                  });
                } else {
                  child.material.map = texture;
                  child.material.needsUpdate = true;
                }
              }
            });
          },
          undefined,
          (error) => {
            console.error('Error loading default texture:', error);
          }
        );
        
        setLoading(false);
        console.log('Model added to scene with scale:', scale);
      },
      (xhr) => {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log('FBX: ' + percentComplete.toFixed(2) + '% loaded');
      },
      (error) => {
        console.error('Error loading FBX:', error);
        setError('Failed to load 3D model: ' + error.message);
        setLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }
      
      if (modelRef.current && animationRef.current.rotate) {
        modelRef.current.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '20px 40px',
          borderRadius: '10px',
          zIndex: 1000
        }}>
          Loading 3D Model...
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ff4444',
          fontSize: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '20px 40px',
          borderRadius: '10px',
          zIndex: 1000,
          maxWidth: '80%',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        zIndex: 1000
      }}>
        <label style={{
          color: '#fff',
          fontSize: '14px',
          marginRight: '10px',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          Texture:
        </label>
        <select
          value={selectedTexture}
          onChange={(e) => handleTextureChange(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '5px',
            border: '2px solid #fff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          {textures.map((texture) => (
            <option key={texture.file} value={texture.file}>
              {texture.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={() => toggleAnimation('rotate')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            borderRadius: '5px',
            border: '2px solid #fff',
            backgroundColor: animations.rotate ? 'rgba(0, 200, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            minWidth: '150px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {animations.rotate ? '⏸ Stop Rotate' : '🔄 Auto Rotate'}
        </button>
        
        {fbxAnimations.length > 0 && (
          <>
            <div style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '10px',
              padding: '5px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '3px',
              textAlign: 'center'
            }}>
              FBX Animations ({fbxAnimations.length})
            </div>
            {fbxAnimations.map((clip, index) => (
              <button
                key={index}
                onClick={() => playFBXAnimation(clip.name)}
                style={{
                  padding: '10px 15px',
                  fontSize: '13px',
                  borderRadius: '5px',
                  border: '2px solid #fff',
                  backgroundColor: activeAnimation === clip.name ? 'rgba(0, 200, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  minWidth: '150px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                ▶ {clip.name}
              </button>
            ))}
            <button
              onClick={stopAllAnimations}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                borderRadius: '5px',
                border: '2px solid #ff4444',
                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ⏹ Stop All
            </button>
          </>
        )}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid #fff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid #fff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        >
          −
        </button>
      </div>
    </>
  );
}

export default App;

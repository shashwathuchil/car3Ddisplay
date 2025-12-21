import './App.css';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef({ rotate: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState('Aircraft C.jpg');
  const [animations, setAnimations] = useState({
    rotate: false
  });

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
    camera.position.set(0, 5, 10);
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

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    console.log('Starting to load 3D model...');
    
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('/assets/futuristic_combat_jet/');
    mtlLoader.load(
      'Futuristic combat jet.mtl',
      (materials) => {
        materials.preload();
        console.log('Materials loaded successfully');
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/assets/futuristic_combat_jet/');
        
        objLoader.load(
          'Futuristic combat jet.obj',
          (obj) => {
            console.log('OBJ loaded successfully!', obj);
            obj.scale.set(0.5, 0.5, 0.5);
            obj.position.set(0, 0, 0);
            
            obj.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  child.material.needsUpdate = true;
                }
              }
            });
            
            scene.add(obj);
            modelRef.current = obj;
            setLoading(false);
            console.log('Model added to scene');
          },
          (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log('OBJ: ' + percentComplete.toFixed(2) + '% loaded');
          },
          (error) => {
            console.error('Error loading OBJ:', error);
            setError('Failed to load 3D model: ' + error.message);
            setLoading(false);
          }
        );
      },
      (xhr) => {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log('MTL: ' + percentComplete.toFixed(2) + '% loaded');
      },
      (error) => {
        console.error('Error loading MTL:', error);
        setError('Failed to load materials: ' + error.message);
        setLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
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
        zIndex: 1000
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
            minWidth: '120px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {animations.rotate ? '⏸ Stop Rotate' : '🔄 Auto Rotate'}
        </button>
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

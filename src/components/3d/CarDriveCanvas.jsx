import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import CarControlsUI from './CarControlsUI';
import './CarDriveCanvas.css';

const CHECKPOINTS = [
  { id: 'about', title: 'ABOUT ME', subtitle: 'Explore Bio & Experience', color: 0x00f3ff, pos: { x: -20, z: -18 } },
  { id: 'skills', title: 'SKILLS ARENA', subtitle: 'Tech Stack & Tools', color: 0x9d4edd, pos: { x: 20, z: -18 } },
  { id: 'projects', title: 'PROJECTS', subtitle: 'Featured Web Applications', color: 0x10b981, pos: { x: -20, z: 18 } },
  { id: 'contact', title: 'CONTACT PORTAL', subtitle: 'Get In Touch', color: 0xf43f5e, pos: { x: 20, z: 18 } },
];

const COINS_DATA = [
  { x: -10, z: -10, id: 1 }, { x: 10, z: -10, id: 2 },
  { x: -10, z: 10, id: 3 }, { x: 10, z: 10, id: 4 },
  { x: 0, z: -18, id: 5 }, { x: 0, z: 18, id: 6 },
  { x: -18, z: 0, id: 7 }, { x: 18, z: 0, id: 8 },
];

const CarDriveCanvas = ({ onNavigateSection }) => {
  const mountRef = useRef(null);
  const wrapperRef = useRef(null);
  const keysRef = useRef({ w: false, a: false, s: false, d: false, space: false, shift: false });
  const touchStateRef = useRef({ forward: false, backward: false, left: false, right: false, brake: false, boost: false });
  const autoDriveTargetRef = useRef(null);
  const audioContextRef = useRef(null);
  const engineOscRef = useRef(null);

  const [speedKmH, setSpeedKmH] = useState(0);
  const [activeZone, setActiveZone] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [camMode, setCamMode] = useState('chase');
  const [envTheme, setEnvTheme] = useState('forest');
  const [isBoosting, setIsBoosting] = useState(false);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [carTransform, setCarTransform] = useState({ x: 0, z: 0, rot: 0 });

  // Web Audio Synth Engine Sound
  const initEngineSound = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioContextRef.current = ctx;
        engineOscRef.current = osc;
      }
      setSoundEnabled(true);
    } catch (err) {
      console.warn("Web Audio API issue", err);
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      initEngineSound();
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.suspend();
      }
      setSoundEnabled(false);
    }
  };

  // HTML Native Fullscreen Event Listener
  useEffect(() => {
    const handleFSChange = () => {
      const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFS);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    };

    document.addEventListener('fullscreenchange', handleFSChange);
    document.addEventListener('webkitfullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
      document.removeEventListener('webkitfullscreenchange', handleFSChange);
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const isForest = envTheme === 'forest';

    const scene = new THREE.Scene();
    const bgColor = isForest ? 0x05140d : 0x04060f;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, isForest ? 0.015 : 0.012);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isForest ? 1.25 : 1.15;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isForest ? 0.95 : 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(isForest ? 0xd1fae5 : 0xffffff, isForest ? 1.5 : 1.3);
    dirLight.position.set(35, 55, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 130;
    const d = 42;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(
      isForest ? 0x34d399 : 0x00f3ff,
      isForest ? 0x064e3b : 0x11052C,
      0.7
    );
    scene.add(hemiLight);

    // Ground Plane & Road Texture
    const groundSize = 100;
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = 512;
    gridCanvas.height = 512;
    const gctx = gridCanvas.getContext('2d');

    if (isForest) {
      gctx.fillStyle = '#0a2217';
      gctx.fillRect(0, 0, 512, 512);

      gctx.fillStyle = '#0f3323';
      for (let i = 0; i < 300; i++) {
        const rx = Math.random() * 512;
        const ry = Math.random() * 512;
        const rw = 4 + Math.random() * 14;
        gctx.fillRect(rx, ry, rw, rw);
      }

      gctx.strokeStyle = '#231e17';
      gctx.lineWidth = 56;
      gctx.beginPath();
      gctx.moveTo(0, 256);
      gctx.lineTo(512, 256);
      gctx.moveTo(256, 0);
      gctx.lineTo(256, 512);
      gctx.stroke();

      gctx.strokeStyle = '#10b981';
      gctx.lineWidth = 4;
      gctx.strokeRect(8, 8, 496, 496);
    } else {
      gctx.fillStyle = '#090c15';
      gctx.fillRect(0, 0, 512, 512);
      gctx.strokeStyle = '#1e293b';
      gctx.lineWidth = 4;
      const step = 64;
      for (let x = 0; x <= 512; x += step) {
        gctx.beginPath();
        gctx.moveTo(x, 0);
        gctx.lineTo(x, 512);
        gctx.stroke();
      }
      for (let y = 0; y <= 512; y += step) {
        gctx.beginPath();
        gctx.moveTo(0, y);
        gctx.lineTo(512, y);
        gctx.stroke();
      }
    }

    const groundTexture = new THREE.CanvasTexture(gridCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(16, 16);

    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: isForest ? 0.9 : 0.75,
      metalness: isForest ? 0.05 : 0.2,
    });
    const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Boundary Fences
    const barrierMat = new THREE.MeshStandardMaterial({
      color: isForest ? 0x10b981 : 0x00f3ff,
      emissive: isForest ? 0x059669 : 0x00f3ff,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const barrierGeo = new THREE.BoxGeometry(groundSize, 3, 1);
    
    const northBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    northBarrier.position.set(0, 1.5, -groundSize / 2);
    scene.add(northBarrier);

    const southBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    southBarrier.position.set(0, 1.5, groundSize / 2);
    scene.add(southBarrier);

    const sideBarrierGeo = new THREE.BoxGeometry(1, 3, groundSize);
    const eastBarrier = new THREE.Mesh(sideBarrierGeo, barrierMat);
    eastBarrier.position.set(groundSize / 2, 1.5, 0);
    scene.add(eastBarrier);

    const westBarrier = new THREE.Mesh(sideBarrierGeo, barrierMat);
    westBarrier.position.set(-groundSize / 2, 1.5, 0);
    scene.add(westBarrier);

    // Trees
    const animatedTrees = [];

    if (isForest) {
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2e1d11, roughness: 0.95 });
      const pineMat1 = new THREE.MeshStandardMaterial({ color: 0x0b4728, roughness: 0.75, flatShading: true });
      const pineMat2 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65, flatShading: true });
      const oakMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7, flatShading: true });

      const treePositions = [
        [-34, -34], [34, -34], [-34, 34], [34, 34],
        [-38, 0], [38, 0], [0, -38], [0, 38],
        [-12, -36], [12, -36], [-12, 36], [12, 36],
        [-36, -12], [36, -12], [-36, 12], [36, 12],
        [-28, -22], [28, -22], [-28, 22], [28, 22],
        [-22, -28], [22, -28], [-22, 28], [22, 28]
      ];

      treePositions.forEach(([tx, tz], idx) => {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(tx, 0, tz);

        const scale = 0.9 + Math.random() * 0.45;
        treeGroup.scale.set(scale, scale, scale);

        const trunkMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.65, 4.2, 8), trunkMat);
        trunkMesh.position.y = 2.1;
        trunkMesh.castShadow = true;
        treeGroup.add(trunkMesh);

        if (idx % 3 === 0) {
          const oakCluster1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 1), oakMat);
          oakCluster1.position.y = 4.8;
          oakCluster1.castShadow = true;
          treeGroup.add(oakCluster1);

          const oakCluster2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7, 1), oakMat);
          oakCluster2.position.set(-0.9, 5.4, 0.6);
          oakCluster2.castShadow = true;
          treeGroup.add(oakCluster2);

          const oakCluster3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), oakMat);
          oakCluster3.position.set(0.9, 5.2, -0.6);
          oakCluster3.castShadow = true;
          treeGroup.add(oakCluster3);
        } else {
          const fMat = idx % 2 === 0 ? pineMat1 : pineMat2;
          
          const cone1 = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3.6, 8), fMat);
          cone1.position.y = 4.0;
          cone1.castShadow = true;
          treeGroup.add(cone1);

          const cone2 = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3.0, 8), fMat);
          cone2.position.y = 5.5;
          cone2.castShadow = true;
          treeGroup.add(cone2);

          const cone3 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.4, 8), fMat);
          cone3.position.y = 6.9;
          cone3.castShadow = true;
          treeGroup.add(cone3);
        }

        scene.add(treeGroup);
        animatedTrees.push({ group: treeGroup, initRot: Math.random() * Math.PI, tx });
      });
    } else {
      const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 12);
      const pillarPositions = [
        [-35, 6, -35], [35, 6, -35], [-35, 6, 35], [35, 6, 35],
        [0, 6, -42], [0, 6, 42], [-42, 6, 0], [42, 6, 0]
      ];
      pillarPositions.forEach(([px, py, pz], i) => {
        const col = i % 2 === 0 ? 0x00f3ff : 0x9d4edd;
        const pMat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.8 });
        const pMesh = new THREE.Mesh(pillarGeo, pMat);
        pMesh.position.set(px, py, pz);
        scene.add(pMesh);
      });
    }

    // Collectibles
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
    });
    const coinGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 16);
    coinGeo.rotateX(Math.PI / 2);

    const coinObjects = COINS_DATA.map((c) => {
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.position.set(c.x, 1.2, c.z);
      scene.add(coinMesh);
      return { mesh: coinMesh, collected: false, x: c.x, z: c.z, id: c.id };
    });

    // Checkpoints
    const checkpointObjects = [];
    const createTextCanvas = (text, colorHexStr) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.fillStyle = isForest ? '#062016' : '#0a0d18';
      ctx.fillRect(0, 0, 512, 128);
      ctx.strokeStyle = colorHexStr;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 504, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = colorHexStr;
      ctx.shadowBlur = 15;
      ctx.fillText(text, 256, 64);
      return new THREE.CanvasTexture(c);
    };

    CHECKPOINTS.forEach((cp) => {
      const group = new THREE.Group();
      group.position.set(cp.pos.x, 0, cp.pos.z);
      const colorHexStr = `#${cp.color.toString(16).padStart(6, '0')}`;

      const pMat = new THREE.MeshStandardMaterial({ color: cp.color, emissive: cp.color, emissiveIntensity: 0.6 });
      const gatePillarGeo = new THREE.BoxGeometry(0.8, 6, 0.8);
      
      const leftPillar = new THREE.Mesh(gatePillarGeo, pMat);
      leftPillar.position.set(-3.5, 3, 0);
      leftPillar.castShadow = true;
      group.add(leftPillar);

      const rightPillar = new THREE.Mesh(gatePillarGeo, pMat);
      rightPillar.position.set(3.5, 3, 0);
      rightPillar.castShadow = true;
      group.add(rightPillar);

      const signTex = createTextCanvas(cp.title, colorHexStr);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
      const signGeo = new THREE.PlaneGeometry(7.2, 1.8);
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(0, 5.8, 0);
      group.add(signMesh);

      const ringGeo = new THREE.RingGeometry(3.5, 4.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: cp.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.05;
      group.add(ringMesh);

      const gateLight = new THREE.PointLight(cp.color, 2, 12);
      gateLight.position.set(0, 3, 0);
      group.add(gateLight);

      scene.add(group);

      checkpointObjects.push({
        ...cp,
        meshGroup: group,
        ringMesh: ringMesh,
      });
    });

    // 3D Supercar Model
    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0, 0);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 1.2,
    });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.3 });
    
    const chassisGeo = new THREE.BoxGeometry(2.15, 0.55, 4.3);
    const chassisMesh = new THREE.Mesh(chassisGeo, bodyMat);
    chassisMesh.position.y = 0.55;
    chassisMesh.castShadow = true;
    carGroup.add(chassisMesh);

    const hoodGeo = new THREE.BoxGeometry(1.95, 0.3, 1.6);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    hoodMesh.position.set(0, 0.78, -1.25);
    hoodMesh.rotation.x = 0.08;
    hoodMesh.castShadow = true;
    carGroup.add(hoodMesh);

    const splitterMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.5), carbonMat);
    splitterMesh.position.set(0, 0.32, -2.15);
    carGroup.add(splitterMesh);

    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      metalness: 0.98,
      roughness: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const cabinGeo = new THREE.BoxGeometry(1.65, 0.58, 2.1);
    const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
    cabinMesh.position.set(0, 1.12, -0.15);
    cabinMesh.rotation.x = -0.05;
    cabinMesh.castShadow = true;
    carGroup.add(cabinMesh);

    const mirrorGeo = new THREE.BoxGeometry(0.32, 0.12, 0.2);
    const mirrorLeft = new THREE.Mesh(mirrorGeo, bodyMat);
    mirrorLeft.position.set(-1.05, 1.08, -0.6);
    carGroup.add(mirrorLeft);
    const mirrorRight = new THREE.Mesh(mirrorGeo, bodyMat);
    mirrorRight.position.set(1.05, 1.08, -0.6);
    carGroup.add(mirrorRight);

    const spoilerBar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.45), carbonMat);
    spoilerBar.position.set(0, 1.32, 1.85);
    carGroup.add(spoilerBar);
    
    const spoilerEndLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.5), carbonMat);
    spoilerEndLeft.position.set(-0.96, 1.32, 1.85);
    carGroup.add(spoilerEndLeft);
    const spoilerEndRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.5), carbonMat);
    spoilerEndRight.position.set(0.96, 1.32, 1.85);
    carGroup.add(spoilerEndRight);

    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12);
    exhaustGeo.rotateX(Math.PI / 2);
    
    [-0.4, -0.2, 0.2, 0.4].forEach((xPos) => {
      const pipe = new THREE.Mesh(exhaustGeo, exhaustMat);
      pipe.position.set(xPos, 0.45, 2.18);
      carGroup.add(pipe);
    });

    const nitroLight = new THREE.PointLight(0xff0055, 0, 8);
    nitroLight.position.set(0, 0.5, 2.2);
    carGroup.add(nitroLight);

    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlGeo = new THREE.BoxGeometry(0.42, 0.12, 0.1);
    
    const hlLeft = new THREE.Mesh(hlGeo, headlightMat);
    hlLeft.position.set(-0.75, 0.65, -2.12);
    carGroup.add(hlLeft);
    const hlRight = new THREE.Mesh(hlGeo, headlightMat);
    hlRight.position.set(0.75, 0.65, -2.12);
    carGroup.add(hlRight);

    const spotLeft = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 5, 0.3, 1);
    spotLeft.position.set(-0.75, 0.65, -2.1);
    spotLeft.target.position.set(-0.75, 0, -18);
    carGroup.add(spotLeft);
    carGroup.add(spotLeft.target);

    const spotRight = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 5, 0.3, 1);
    spotRight.position.set(0.75, 0.65, -2.1);
    spotRight.target.position.set(0.75, 0, -18);
    carGroup.add(spotRight);
    carGroup.add(spotRight.target);

    const tailBarMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.1), tailBarMat);
    tailBar.position.set(0, 0.72, 2.15);
    carGroup.add(tailBar);

    // Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x14141d, roughness: 0.85, metalness: 0.15 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.95 });
    const caliperMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.8 });

    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 24);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelMeshes = [];
    const wheelPositions = [
      { x: -1.08, y: 0.42, z: -1.3, isFront: true },
      { x: 1.08, y: 0.42, z: -1.3, isFront: true },
      { x: -1.08, y: 0.42, z: 1.3, isFront: false },
      { x: 1.08, y: 0.42, z: 1.3, isFront: false },
    ];

    wheelPositions.forEach((wp) => {
      const wPivot = new THREE.Group();
      wPivot.position.set(wp.x, wp.y, wp.z);

      const wMesh = new THREE.Mesh(wheelGeo, tireMat);
      wMesh.castShadow = true;

      const rimStar1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.76, 0.08), rimMat);
      wMesh.add(rimStar1);
      const rimStar2 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.76, 0.08), rimMat);
      rimStar2.rotation.x = Math.PI / 3;
      wMesh.add(rimStar2);
      const rimStar3 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.76, 0.08), rimMat);
      rimStar3.rotation.x = -Math.PI / 3;
      wMesh.add(rimStar3);

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.15), caliperMat);
      caliper.position.set(wp.x > 0 ? -0.1 : 0.1, 0, 0);
      wPivot.add(caliper);

      wPivot.add(wMesh);
      carGroup.add(wPivot);
      wheelMeshes.push({ pivot: wPivot, mesh: wMesh, isFront: wp.isFront });
    });

    scene.add(carGroup);

    // Physics Engine
    const carPhysics = {
      speed: 0,
      baseMaxSpeed: 1.45,
      boostMaxSpeed: 2.45,
      baseAcceleration: 0.05,
      boostAcceleration: 0.09,
      maxReverseSpeed: -0.5,
      deceleration: 0.95,
      brakeDecel: 0.88,
      steeringAngle: 0,
      maxSteeringAngle: 0.075,
      turnSpeed: 0.16,
      rotation: 0,
    };

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') { keysRef.current.w = true; autoDriveTargetRef.current = null; }
      if (key === 's' || key === 'arrowdown') { keysRef.current.s = true; autoDriveTargetRef.current = null; }
      if (key === 'a' || key === 'arrowleft') { keysRef.current.a = true; autoDriveTargetRef.current = null; }
      if (key === 'd' || key === 'arrowright') { keysRef.current.d = true; autoDriveTargetRef.current = null; }
      if (e.code === 'Space') keysRef.current.space = true;
      if (e.key === 'Shift' || key === 'shift') keysRef.current.shift = true;
      if (key === 'r') {
        autoDriveTargetRef.current = null;
        carGroup.position.set(0, 0, 0);
        carPhysics.speed = 0;
        carPhysics.rotation = 0;
        carGroup.rotation.y = 0;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false;
      if (e.code === 'Space') keysRef.current.space = false;
      if (e.key === 'Shift' || key === 'shift') keysRef.current.shift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Sway trees
      animatedTrees.forEach((t) => {
        t.group.rotation.z = Math.sin(elapsedTime * 1.5 + t.tx) * 0.03;
      });

      // Spin Coins
      coinObjects.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.z = elapsedTime * 3;
          c.mesh.position.y = 1.2 + Math.sin(elapsedTime * 4 + c.id) * 0.25;

          const cdx = carGroup.position.x - c.x;
          const cdz = carGroup.position.z - c.z;
          if (Math.sqrt(cdx * cdx + cdz * cdz) < 2.2) {
            c.collected = true;
            c.mesh.visible = false;
            setScore((prev) => prev + 250);
          }
        }
      });

      // AUTO-DRIVE NAVIGATOR
      if (autoDriveTargetRef.current) {
        const targetPos = autoDriveTargetRef.current;
        const dx = targetPos.x - carGroup.position.x;
        const dz = targetPos.z - carGroup.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 1.2) {
          const targetAngle = Math.atan2(-dx, -dz);
          let diffAngle = targetAngle - carPhysics.rotation;
          while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
          while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;

          carPhysics.rotation += diffAngle * 0.12;
          carPhysics.speed = Math.min(1.2, dist * 0.08);
        } else {
          carPhysics.speed = 0;
          autoDriveTargetRef.current = null;
        }
      } else {
        // MANUAL DRIVING
        const moveForward = keysRef.current.w || touchStateRef.current.forward;
        const moveBackward = keysRef.current.s || touchStateRef.current.backward;
        const turnLeft = keysRef.current.a || touchStateRef.current.left;
        const turnRight = keysRef.current.d || touchStateRef.current.right;
        const isBraking = keysRef.current.space || touchStateRef.current.brake;
        const boostActive = keysRef.current.shift || touchStateRef.current.boost;

        setIsBoosting(boostActive && moveForward);

        const currentMaxSpeed = boostActive ? carPhysics.boostMaxSpeed : carPhysics.baseMaxSpeed;
        const currentAccel = boostActive ? carPhysics.boostAcceleration : carPhysics.baseAcceleration;

        nitroLight.intensity = boostActive ? 4 : 0;

        if (moveForward) {
          carPhysics.speed = Math.min(carPhysics.speed + currentAccel, currentMaxSpeed);
        } else if (moveBackward) {
          carPhysics.speed = Math.max(carPhysics.speed - currentAccel, carPhysics.maxReverseSpeed);
        } else {
          carPhysics.speed *= carPhysics.deceleration;
        }

        if (isBraking) {
          carPhysics.speed *= carPhysics.brakeDecel;
        }

        let targetSteer = 0;
        if (turnLeft) targetSteer += carPhysics.maxSteeringAngle;
        if (turnRight) targetSteer -= carPhysics.maxSteeringAngle;

        carPhysics.steeringAngle += (targetSteer - carPhysics.steeringAngle) * carPhysics.turnSpeed;

        if (Math.abs(carPhysics.speed) > 0.005) {
          const dir = carPhysics.speed >= 0 ? 1 : -1;
          carPhysics.rotation += carPhysics.steeringAngle * (carPhysics.speed / carPhysics.baseMaxSpeed) * dir;
        }
      }

      wheelMeshes.forEach((w) => {
        if (w.isFront) {
          w.pivot.rotation.y = carPhysics.steeringAngle * 6;
        }
        w.mesh.rotation.x += carPhysics.speed * 3.2;
      });

      carGroup.rotation.y = carPhysics.rotation;
      carGroup.position.x -= Math.sin(carPhysics.rotation) * carPhysics.speed;
      carGroup.position.z -= Math.cos(carPhysics.rotation) * carPhysics.speed;

      chassisMesh.rotation.z = -carPhysics.steeringAngle * carPhysics.speed * 1.2;

      setCarTransform({ x: carGroup.position.x, z: carGroup.position.z, rot: carPhysics.rotation });

      if (engineOscRef.current && audioContextRef.current) {
        const pitch = 45 + Math.abs(carPhysics.speed) * 120;
        engineOscRef.current.frequency.setValueAtTime(pitch, audioContextRef.current.currentTime);
      }

      // Arena Bound Limits
      const boundLimit = 44;
      if (Math.abs(carGroup.position.x) > boundLimit) {
        carGroup.position.x = Math.sign(carGroup.position.x) * boundLimit;
        carPhysics.speed *= -0.4;
      }
      if (Math.abs(carGroup.position.z) > boundLimit) {
        carGroup.position.z = Math.sign(carGroup.position.z) * boundLimit;
        carPhysics.speed *= -0.4;
      }

      setSpeedKmH(Math.round(Math.abs(carPhysics.speed) * 110));

      let detectedZone = null;
      checkpointObjects.forEach((cp) => {
        const dx = carGroup.position.x - cp.pos.x;
        const dz = carGroup.position.z - cp.pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        cp.ringMesh.material.opacity = 0.5 + Math.sin(elapsedTime * 4) * 0.3;
        cp.meshGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;

        if (dist < 5.2) {
          detectedZone = cp;
        }
      });

      setActiveZone((prevZone) => (prevZone?.id !== detectedZone?.id ? detectedZone : prevZone));

      // Dynamic Camera
      if (camMode === 'chase') {
        const camDistance = isBoosting ? 11 : 9.5;
        const cameraOffset = new THREE.Vector3(
          Math.sin(carPhysics.rotation) * camDistance,
          isBoosting ? 5.2 : 4.5,
          Math.cos(carPhysics.rotation) * camDistance
        );
        const targetCamPos = carGroup.position.clone().add(cameraOffset);
        camera.position.lerp(targetCamPos, 0.15);
        
        const lookTarget = carGroup.position.clone().add(new THREE.Vector3(0, 1.2, 0));
        camera.lookAt(lookTarget);
      } else if (camMode === 'overhead') {
        camera.position.set(carGroup.position.x, 35, carGroup.position.z + 5);
        camera.lookAt(carGroup.position);
      } else if (camMode === 'hood') {
        const hoodOffset = new THREE.Vector3(
          -Math.sin(carPhysics.rotation) * 0.5,
          1.2,
          -Math.cos(carPhysics.rotation) * 0.5
        );
        camera.position.copy(carGroup.position.clone().add(hoodOffset));
        const forwardLook = carGroup.position.clone().add(
          new THREE.Vector3(-Math.sin(carPhysics.rotation) * 10, 1.0, -Math.cos(carPhysics.rotation) * 10)
        );
        camera.lookAt(forwardLook);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [camMode, envTheme, isBoosting]);

  const handleResetCar = () => {
    autoDriveTargetRef.current = null;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
  };

  const handleAutoDriveZone = (zoneId) => {
    const cp = CHECKPOINTS.find((c) => c.id === zoneId);
    if (cp) {
      autoDriveTargetRef.current = { x: cp.pos.x, z: cp.pos.z };
    }
  };

  const toggleCamMode = () => {
    if (camMode === 'chase') setCamMode('overhead');
    else if (camMode === 'overhead') setCamMode('hood');
    else setCamMode('chase');
  };

  const toggleEnvTheme = () => {
    setEnvTheme((prev) => (prev === 'forest' ? 'cyber' : 'forest'));
  };

  const toggleFullscreen = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch(() => setIsFullscreen(true));
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`car-drive-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="car-drive-container" ref={mountRef}>
        <CarControlsUI
          speedKmH={speedKmH}
          activeZone={activeZone}
          touchStateRef={touchStateRef}
          onNavigateSection={onNavigateSection}
          onResetCar={handleResetCar}
          onAutoDriveZone={handleAutoDriveZone}
          camMode={camMode}
          onToggleCam={toggleCamMode}
          envTheme={envTheme}
          onToggleEnv={toggleEnvTheme}
          isBoosting={isBoosting}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          score={score}
          carTransform={carTransform}
          checkpoints={CHECKPOINTS}
        />
      </div>
    </div>
  );
};

export default CarDriveCanvas;

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlassCubeCanvas({ currentHeadline = "Explore Code" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Offscreen Canvas Texture for Text & Grid Behind Cube
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 2048;
    textCanvas.height = 2048;
    const ctx = textCanvas.getContext('2d');

    const drawTextTexture = (text) => {
      // Solid Obsidian Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 2048, 2048);

      // Subtle Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 2;
      const gridSize = 128;
      for (let x = 0; x <= 2048; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, 2048);
        ctx.stroke();
      }
      for (let y = 0; y <= 2048; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(2048, y);
        ctx.stroke();
      }

      // Draw Giant Bold Typography Behind the Glass Cube
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 240px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const words = text.toUpperCase().split(' ');
      if (words.length >= 2) {
        ctx.fillText(words[0], 1024, 820);
        ctx.fillText(words[1], 1024, 1220);
      } else {
        ctx.fillText(text.toUpperCase(), 1024, 1024);
      }

      // Secondary Tagline Text behind
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = '700 60px "Space Grotesk", sans-serif';
      ctx.fillText('DESIGN • CODE • ARCHITECTURE', 1024, 1550);
    };

    drawTextTexture(currentHeadline);
    const backgroundTexture = new THREE.CanvasTexture(textCanvas);
    backgroundTexture.needsUpdate = true;

    // Background Mesh positioned behind the 3D Glass Cube
    const aspect = width / height;
    const planeHeight = 14;
    const planeWidth = planeHeight * aspect;
    const bgGeo = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const bgMat = new THREE.MeshBasicMaterial({ map: backgroundTexture });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.z = -2.5;
    scene.add(bgMesh);

    // 3. Environment Map Lighting for Glass Refraction
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x050505);
    
    const light1 = new THREE.PointLight(0xffffff, 20, 100);
    light1.position.set(6, 6, 6);
    envScene.add(light1);

    const light2 = new THREE.PointLight(0xec4899, 15, 100);
    light2.position.set(-6, -6, 3);
    envScene.add(light2);

    const light3 = new THREE.PointLight(0x6366f1, 12, 100);
    light3.position.set(0, 6, -4);
    envScene.add(light3);

    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // 4. 3D Glass Refraction Cube
    const geometry = new THREE.BoxGeometry(2.6, 2.6, 2.6, 32, 32, 32);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.99,
      opacity: 1,
      transparent: true,
      roughness: 0.02,
      ior: 1.55, // High refraction glass
      thickness: 2.2,
      specularIntensity: 1,
      specularColor: 0xffffff,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide
    });

    const glassCube = new THREE.Mesh(geometry, glassMaterial);
    scene.add(glassCube);

    // Subtle Edge Outlines
    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
    const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
    glassCube.add(edgesLine);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 4);
    dirLight1.position.set(5, 10, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 3);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // 6. Mouse Motion Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.8;
      targetY = y * 1.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse tracking
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // 3D Glass Cube Rotation & Float
      glassCube.rotation.x = elapsedTime * 0.35 + mouseY;
      glassCube.rotation.y = elapsedTime * 0.5 + mouseX;
      glassCube.rotation.z = Math.sin(elapsedTime * 0.25) * 0.15;

      glassCube.position.y = Math.sin(elapsedTime * 1.4) * 0.15;

      // Update text texture
      drawTextTexture(currentHeadline);
      backgroundTexture.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      const newAspect = newW / newH;
      bgMesh.geometry.dispose();
      bgMesh.geometry = new THREE.PlaneGeometry(14 * newAspect, 14);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      glassMaterial.dispose();
      renderer.dispose();
    };
  }, [currentHeadline]);

  return (
    <div 
      ref={mountRef} 
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}

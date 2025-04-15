import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';

const NeuralBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Background colors
    const bgColorLight = new THREE.Color('#f0f9ff');
    const bgColorDark = new THREE.Color('#111827');
    scene.background = isDarkMode ? bgColorDark : bgColorLight;
    
    // Particles parameters
    const particleCount = 800;
    const maxDistance = 100;
    const branchFactor = 3;
    const particles: THREE.Vector3[] = [];
    const connections: { from: number, to: number, distance: number }[] = [];
    
    // Create geometry
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: isDarkMode ? 0x0ea5e9 : 0x0ea5e9,
      size: 2,
      transparent: true,
      opacity: 0.7,
    });
    
    // Create line material
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: 0.2,
    });
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      // Create central brain-like structure with branches
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 15 + 5;
      
      // Create branches in 3D space
      const branch = Math.floor(Math.random() * branchFactor);
      const branchOffset = (branch / branchFactor) * Math.PI * 2;
      
      // Calculate 3D position with spiral pattern
      const x = Math.cos(angle + branchOffset) * radius;
      const y = Math.random() * 30 - 15 + Math.sin(i * 0.01) * 5;
      const z = Math.sin(angle + branchOffset) * radius - 30;
      
      particles.push(new THREE.Vector3(x, y, z));
    }
    
    // Set positions
    const positions = new Float32Array(particles.length * 3);
    for (let i = 0; i < particles.length; i++) {
      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = particles[i].z;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Create connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].distanceTo(particles[j]);
        if (distance < maxDistance / 10) {
          connections.push({ from: i, to: j, distance });
        }
      }
    }
    
    // Create lines for connections
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    
    connections.forEach(connection => {
      const from = particles[connection.from];
      const to = particles[connection.to];
      
      linePositions.push(from.x, from.y, from.z);
      linePositions.push(to.x, to.y, to.z);
    });
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    
    // Position camera
    camera.position.z = 30;
    
    // Create pulse animations using GSAP
    const createPulseAnimation = () => {
      // Select a random particle
      const randomParticle = Math.floor(Math.random() * particleCount);
      const position = particles[randomParticle];
      
      // Create a glowing sphere at that position
      const pulseGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6, // Purple color for brain activity
        transparent: true,
        opacity: 0,
      });
      
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.position.copy(position);
      scene.add(pulse);
      
      // Animate the pulse with GSAP
      gsap.to(pulseMaterial, {
        opacity: 0.8,
        duration: 0.5,
        onComplete: () => {
          gsap.to(pulseMaterial, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              scene.remove(pulse);
              pulse.geometry.dispose();
              pulseMaterial.dispose();
            }
          });
        }
      });
      
      gsap.to(pulse.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 1,
        ease: "power1.out"
      });
      
      // Add ripple effect through connected particles
      connections
        .filter(conn => conn.from === randomParticle || conn.to === randomParticle)
        .forEach((conn, index) => {
          const targetIndex = conn.from === randomParticle ? conn.to : conn.from;
          const targetPosition = particles[targetIndex];
          
          const rippleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
          const rippleMaterial = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9, // Blue color for ripple effect
            transparent: true,
            opacity: 0,
          });
          
          const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
          ripple.position.copy(position);
          scene.add(ripple);
          
          // Animate ripple from source to connected particle
          gsap.to(ripple.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 0.5,
            delay: 0.2 + (index * 0.05),
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(rippleMaterial, {
                opacity: 0.7,
                duration: 0.2,
                onComplete: () => {
                  gsap.to(rippleMaterial, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                      scene.remove(ripple);
                      rippleGeometry.dispose();
                      rippleMaterial.dispose();
                    }
                  });
                }
              });
            }
          });
          
          gsap.to(rippleMaterial, {
            opacity: 0.5,
            duration: 0.3,
          });
        });
    };
    
    // Start pulse animations at random intervals
    const startPulseAnimations = () => {
      createPulseAnimation();
      setTimeout(startPulseAnimations, Math.random() * 2000 + 1000);
    };
    
    setTimeout(startPulseAnimations, 1000);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle rotation of the entire particle system
      particleSystem.rotation.y += 0.001;
      lines.rotation.y += 0.001;
      
      // Subtle wave motion in the y-axis
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3 + 1; // y-coordinate
        const originalY = particles[i].y;
        positions[idx] = originalY + Math.sin(Date.now() * 0.001 + i * 0.1) * 0.1;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Update background color when theme changes
    if (isDarkMode) {
      // Use hex value instead of THREE.Color object for GSAP
      scene.background = bgColorDark;
      particleMaterial.color.set(0x0ea5e9);
      lineMaterial.color.set(0x38bdf8);
      lineMaterial.opacity = 0.2;
    } else {
      scene.background = bgColorLight;
      particleMaterial.color.set(0x0ea5e9);
      lineMaterial.color.set(0x0284c7);
      lineMaterial.opacity = 0.1;
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.remove(particleSystem);
      scene.remove(lines);
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [isDarkMode]);
  
  return (
    <div 
      ref={mountRef}
      className="neural-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      }}
    />
  );
};

export default NeuralBackground; 
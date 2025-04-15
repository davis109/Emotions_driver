import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MoodLevel } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MoodSelectorThreeDProps {
  initialValue?: MoodLevel;
  onChange: (value: MoodLevel) => void;
}

const moods = [
  { value: 1, emoji: '😞', label: 'Very Bad', color: '#ef4444' },
  { value: 2, emoji: '😕', label: 'Bad', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#facc15' },
  { value: 4, emoji: '🙂', label: 'Good', color: '#84cc16' },
  { value: 5, emoji: '😄', label: 'Very Good', color: '#22c55e' },
];

const MoodSelectorThreeD: React.FC<MoodSelectorThreeDProps> = ({ 
  initialValue = 3, 
  onChange 
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodLevel>(initialValue);
  const mountRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<THREE.Mesh[]>([]);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create mood orbs
    const orbs: THREE.Mesh[] = [];
    const orbRadius = 1.5;
    const totalWidth = (moods.length - 1) * 2.5;
    
    moods.forEach((mood, index) => {
      // Create emoji canvas texture
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mood.emoji, canvas.width / 2, canvas.height / 2);
      }
      const texture = new THREE.CanvasTexture(canvas);
      
      // Create orb geometry and material
      const geometry = new THREE.SphereGeometry(orbRadius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: mood.color,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.8,
        emissive: mood.color,
        emissiveIntensity: 0.2,
      });
      
      // Create orb mesh
      const orb = new THREE.Mesh(geometry, material);
      
      // Position orbs horizontally
      const x = (index * 2.5) - (totalWidth / 2);
      orb.position.set(x, 0, 0);
      orb.userData = { value: mood.value, index };
      
      // Add to scene
      scene.add(orb);
      orbs.push(orb);
      
      // Create emoji sprite
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(2, 2, 1);
      sprite.position.set(0, 0, 1.1);
      orb.add(sprite);
      
      // Add text label
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 64;
      const labelCtx = labelCanvas.getContext('2d');
      if (labelCtx) {
        labelCtx.fillStyle = 'transparent';
        labelCtx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
        labelCtx.font = '24px Arial';
        labelCtx.textAlign = 'center';
        labelCtx.textBaseline = 'middle';
        labelCtx.fillStyle = isDarkMode ? '#ffffff' : '#333333';
        labelCtx.fillText(mood.label, labelCanvas.width / 2, labelCanvas.height / 2);
      }
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture, transparent: true });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(3, 0.8, 1);
      label.position.set(0, -2, 0);
      orb.add(label);
      
      // Make initial orb bigger
      if (mood.value === initialValue) {
        gsap.to(orb.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5 });
        material.emissiveIntensity = 0.5;
      }
    });
    
    orbsRef.current = orbs;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 10;
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Mouse events
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / mountRef.current!.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / mountRef.current!.clientHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(orbs);
      
      // Change cursor and scale orb slightly on hover
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hoveredOrb = intersects[0].object as THREE.Mesh;
        
        // Only animate if not already selected
        if (hoveredOrb.userData.value !== selectedMood) {
          gsap.to(hoveredOrb.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
          
          const material = hoveredOrb.material as THREE.MeshStandardMaterial;
          gsap.to(material, { emissiveIntensity: 0.3, duration: 0.3 });
        }
        
        // Return other orbs to original size
        orbs.forEach(orb => {
          if (orb !== hoveredOrb && orb.userData.value !== selectedMood) {
            gsap.to(orb.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            
            const material = orb.material as THREE.MeshStandardMaterial;
            gsap.to(material, { emissiveIntensity: 0.2, duration: 0.3 });
          }
        });
      } else {
        document.body.style.cursor = 'default';
        
        // Return all non-selected orbs to original size
        orbs.forEach(orb => {
          if (orb.userData.value !== selectedMood) {
            gsap.to(orb.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            
            const material = orb.material as THREE.MeshStandardMaterial;
            gsap.to(material, { emissiveIntensity: 0.2, duration: 0.3 });
          }
        });
      }
    };
    
    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(orbs);
      
      if (intersects.length > 0) {
        const selectedOrb = intersects[0].object as THREE.Mesh;
        const newMoodValue = selectedOrb.userData.value as MoodLevel;
        
        // Only update if different from current selection
        if (newMoodValue !== selectedMood) {
          setSelectedMood(newMoodValue);
          onChange(newMoodValue);
          
          // Animate selected orb
          gsap.to(selectedOrb.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5, ease: "elastic.out(1, 0.5)" });
          
          const material = selectedOrb.material as THREE.MeshStandardMaterial;
          gsap.to(material, { emissiveIntensity: 0.5, duration: 0.5 });
          
          // Create pulse wave animation
          const pulseGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
          const pulseMaterial = new THREE.MeshBasicMaterial({
            color: material.color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
          });
          
          const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
          pulse.position.copy(selectedOrb.position);
          pulse.rotation.x = Math.PI / 2;
          scene.add(pulse);
          
          gsap.to(pulse.scale, {
            x: 10,
            y: 10,
            z: 1,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
              (pulseMaterial as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - pulse.scale.x / 10);
            },
            onComplete: () => {
              scene.remove(pulse);
              pulse.geometry.dispose();
              pulseMaterial.dispose();
            }
          });
          
          // Return all other orbs to original size
          orbs.forEach(orb => {
            if (orb !== selectedOrb) {
              gsap.to(orb.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
              
              const orbMaterial = orb.material as THREE.MeshStandardMaterial;
              gsap.to(orbMaterial, { emissiveIntensity: 0.2, duration: 0.3 });
            }
          });
        }
      }
    };
    
    // Add event listeners
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleClick);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle floating animation
      orbs.forEach((orb, index) => {
        orb.position.y = Math.sin(Date.now() * 0.001 + index * 0.5) * 0.2;
        orb.rotation.y += 0.005;
      });
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleClick);
        mountRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      
      orbs.forEach(orb => {
        scene.remove(orb);
        orb.geometry.dispose();
        (orb.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
    };
  }, [initialValue, onChange, isDarkMode]);
  
  // Update selected orb on external state change
  useEffect(() => {
    // Skip during initial render
    if (orbsRef.current.length === 0) return;
    
    orbsRef.current.forEach(orb => {
      if (orb.userData.value === selectedMood) {
        gsap.to(orb.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5 });
        
        const material = orb.material as THREE.MeshStandardMaterial;
        gsap.to(material, { emissiveIntensity: 0.5, duration: 0.5 });
      } else {
        gsap.to(orb.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        
        const material = orb.material as THREE.MeshStandardMaterial;
        gsap.to(material, { emissiveIntensity: 0.2, duration: 0.3 });
      }
    });
  }, [selectedMood]);
  
  return (
    <div className="w-full py-4">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
        How are you feeling today?
      </h3>
      <div 
        ref={mountRef} 
        className="w-full h-48 rounded-lg overflow-hidden" 
        style={{ background: 'transparent' }}
      />
      <div className="w-full mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ease-in-out`}
            style={{ 
              width: `${(selectedMood / 5) * 100}%`,
              backgroundColor: moods.find(m => m.value === selectedMood)?.color 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodSelectorThreeD; 
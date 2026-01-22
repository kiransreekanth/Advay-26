'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Preload, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useDeviceDetect, useMouseParallax, useGyroscope } from '@/hooks/useDeviceDetect'

// ============================================
// ADVAY 2026 COLOR PALETTE
// ============================================
const COLORS = {
  background: '#0D0D0D',
  textPrimary: '#E5E4E2',
  textSecondary: '#71797E',
  accentPrimary: '#E50914',
  accentSecondary: '#B20710',
}

// ============================================
// PARTICLES COMPONENT - Floating stars
// ============================================
interface ParticlesProps {
  count: number
}

function Particles({ count }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const primaryColor = new THREE.Color(COLORS.accentPrimary)
    const whiteColor = new THREE.Color(COLORS.textPrimary)
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a large sphere
      const radius = 8 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi) - 5
      
      // 15% red particles, 85% white
      const isRed = Math.random() > 0.85
      const color = isRed ? primaryColor : whiteColor
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [count])

  // Create buffer attributes with useMemo
  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positions, 3)
  }, [positions])

  const colorAttribute = useMemo(() => {
    return new THREE.BufferAttribute(colors, 3)
  }, [colors])
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive object={positionAttribute} attach="attributes-position" />
        <primitive object={colorAttribute} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ============================================
// PLACEHOLDER LOGO (3D Object with parallax)
// ============================================
interface LogoPlaceholderProps {
  mouseX: number
  mouseY: number
  gyroGamma: number
  gyroBeta: number
  isMobile: boolean
}

function LogoPlaceholder({ mouseX, mouseY, gyroGamma, gyroBeta, isMobile }: LogoPlaceholderProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Smooth interpolation targets
  const target = useRef({ rotX: 0, rotY: 0, posX: 0, posY: 0 })
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    // Determine input source
    let inputX: number
    let inputY: number
    
    if (isMobile) {
      inputX = gyroGamma * 0.5
      inputY = gyroBeta * 0.3
    } else {
      inputX = mouseX * 0.5
      inputY = mouseY * 0.3
    }
    
    // Smooth lerp to target
    target.current.rotX += (inputY * 0.2 - target.current.rotX) * 0.05
    target.current.rotY += (inputX * 0.2 - target.current.rotY) * 0.05
    target.current.posX += (inputX * 0.3 - target.current.posX) * 0.05
    target.current.posY += (-inputY * 0.2 - target.current.posY) * 0.05
    
    // Apply transformations
    groupRef.current.rotation.x = target.current.rotX
    groupRef.current.rotation.y = target.current.rotY
    groupRef.current.position.x = target.current.posX
    groupRef.current.position.y = target.current.posY
    
    // Floating animation on mesh
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={meshRef} scale={isMobile ? 1.2 : 1.5}>
          {/* Torus Knot as placeholder - will be replaced with 3D logo */}
          <torusKnotGeometry args={[0.7, 0.2, 100, 16]} />
          <meshStandardMaterial
            color={COLORS.accentPrimary}
            emissive={COLORS.accentPrimary}
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={isMobile ? 2 : 2.5}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial
          color={COLORS.accentPrimary}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// ============================================
// LIGHTING SETUP - Advay Red Theme
// ============================================
function AdvayLighting() {
  return (
    <>
      {/* Ambient - subtle warm tint */}
      <ambientLight color="#1a0808" intensity={0.4} />
      
      {/* Main red light - top right */}
      <pointLight
        position={[5, 5, 3]}
        color={COLORS.accentPrimary}
        intensity={50}
        distance={20}
        decay={2}
      />
      
      {/* Secondary darker red - bottom left */}
      <pointLight
        position={[-4, -3, 2]}
        color={COLORS.accentSecondary}
        intensity={30}
        distance={15}
        decay={2}
      />
      
      {/* Fill light - subtle gray */}
      <pointLight
        position={[0, 0, 5]}
        color={COLORS.textSecondary}
        intensity={10}
        distance={10}
        decay={2}
      />
      
      {/* Rim light for depth */}
      <spotLight
        position={[0, 8, -5]}
        angle={0.4}
        penumbra={1}
        color={COLORS.accentPrimary}
        intensity={20}
        distance={25}
        decay={2}
      />
    </>
  )
}

// ============================================
// CAMERA CONTROLLER - Subtle movement
// ============================================
interface CameraControllerProps {
  mouseX: number
  mouseY: number
  gyroGamma: number
  gyroBeta: number
  isMobile: boolean
}

function CameraController({ mouseX, mouseY, gyroGamma, gyroBeta, isMobile }: CameraControllerProps) {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })
  
  useFrame(() => {
    let inputX: number
    let inputY: number
    
    if (isMobile) {
      inputX = gyroGamma * 0.08
      inputY = gyroBeta * 0.05
    } else {
      inputX = mouseX * 0.15
      inputY = mouseY * 0.08
    }
    
    target.current.x += (inputX - target.current.x) * 0.03
    target.current.y += (inputY - target.current.y) * 0.03
    
    camera.position.x = target.current.x
    camera.position.y = target.current.y
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// ============================================
// SCENE CONTENT
// ============================================
interface SceneContentProps {
  isMobile: boolean
  mouseX: number
  mouseY: number
  gyroGamma: number
  gyroBeta: number
}

function SceneContent({ isMobile, mouseX, mouseY, gyroGamma, gyroBeta }: SceneContentProps) {
  const particleCount = isMobile ? 500 : 1200
  
  // Set background and fog
  const { scene } = useThree()
  
  useEffect(() => {
    scene.background = new THREE.Color(COLORS.background)
    scene.fog = new THREE.FogExp2(COLORS.background, 0.04)
    
    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene])
  
  return (
    <>
      <AdvayLighting />
      
      <CameraController
        mouseX={mouseX}
        mouseY={mouseY}
        gyroGamma={gyroGamma}
        gyroBeta={gyroBeta}
        isMobile={isMobile}
      />
      
      <Particles count={particleCount} />
      
      <LogoPlaceholder
        mouseX={mouseX}
        mouseY={mouseY}
        gyroGamma={gyroGamma}
        gyroBeta={gyroBeta}
        isMobile={isMobile}
      />
    </>
  )
}

// ============================================
// MAIN SCENE COMPONENT (Export)
// ============================================
interface SceneProps {
  className?: string
}

export default function Scene({ className = '' }: SceneProps) {
  const { isMobile, hasGyroscope } = useDeviceDetect()
  const mouse = useMouseParallax(1)
  const gyro = useGyroscope()
  
  const [showGyroPrompt, setShowGyroPrompt] = useState(false)
  
  // Check if iOS needs permission - show prompt on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (isMobile) {
      // Check if it's iOS that needs explicit permission
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const needsPermission = typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      
      if (isIOS && needsPermission && gyro.permission === 'pending') {
        setShowGyroPrompt(true)
      } else if (!isIOS && gyro.permission === 'pending') {
        // Android - try to request permission automatically
        gyro.requestPermission()
      }
    }
  }, [isMobile, gyro.permission, gyro.requestPermission])
  
  const handleGyroPermission = async () => {
    try {
      await gyro.requestPermission()
      setShowGyroPrompt(false)
    } catch (error) {
      console.error('Gyro permission error:', error)
      setShowGyroPrompt(false)
    }
  }
  
  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: COLORS.background,
      }}
    >
      {/* Gyroscope Permission Prompt (iOS) - Same level as description */}
      {showGyroPrompt && (
        <button
          onClick={handleGyroPermission}
          style={{
            position: 'absolute',
            top: '200px',
            left: '44px',
            zIndex: 200,
            padding: '0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: COLORS.textPrimary,
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'left',
          }}
        >
          <span style={{ color: COLORS.accentPrimary }}>TAP</span> TO ENABLE MOTION
        </button>
      )}
      
      {/* Three.js Canvas */}
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{
          position: [0, 0, 5],
          fov: isMobile ? 80 : 75,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <SceneContent
            isMobile={isMobile}
            mouseX={mouse.normalizedX}
            mouseY={mouse.normalizedY}
            gyroGamma={gyro.gamma}
            gyroBeta={gyro.beta}
          />
        </Suspense>
        <Preload all />
      </Canvas>
      
      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(13,13,13,0.5) 100%)',
          zIndex: 1,
        }}
      />
      
      {/* Bottom red glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '25%',
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(229,9,20,0.06) 0%, transparent 100%)',
          zIndex: 1,
        }}
      />
    </div>
  )
}
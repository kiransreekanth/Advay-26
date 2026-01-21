'use client'

import { useState, useEffect, useCallback } from 'react'

// ============================================
// DEVICE DETECTION HOOK
// ============================================

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasGyroscope: boolean
  hasTouchScreen: boolean
  screenWidth: number
  screenHeight: number
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasGyroscope: false,
    hasTouchScreen: false,
    screenWidth: 1920,
    screenHeight: 1080,
  })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isMobile = isMobileUA || width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024
      
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const hasGyroscope = 'DeviceOrientationEvent' in window

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        hasGyroscope,
        hasTouchScreen,
        screenWidth: width,
        screenHeight: height,
      })
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return deviceInfo
}

// ============================================
// MOUSE PARALLAX HOOK (Desktop)
// ============================================

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

export function useMouseParallax(sensitivity: number = 1): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2 * sensitivity
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2 * sensitivity

      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX,
        normalizedY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [sensitivity])

  return position
}

// ============================================
// GYROSCOPE HOOK (Mobile)
// ============================================

interface GyroscopeData {
  beta: number   // Front-to-back tilt (-180 to 180)
  gamma: number  // Left-to-right tilt (-90 to 90)
  permission: 'granted' | 'denied' | 'pending'
  requestPermission: () => Promise<void>
}

export function useGyroscope(): GyroscopeData {
  const [data, setData] = useState<GyroscopeData>({
    beta: 0,
    gamma: 0,
    permission: 'pending',
    requestPermission: async () => {},
  })

  const requestPermission = useCallback(async () => {
    // iOS 13+ requires permission request
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        setData(prev => ({ ...prev, permission }))
        return permission
      } catch (error) {
        setData(prev => ({ ...prev, permission: 'denied' }))
        return 'denied'
      }
    } else {
      // Android and older iOS - permission granted by default
      setData(prev => ({ ...prev, permission: 'granted' }))
      return 'granted'
    }
  }, [])

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta || 0
      const gamma = e.gamma || 0
      
      // Normalize to -1 to 1 range
      const normalizedBeta = Math.max(-1, Math.min(1, beta / 45))
      const normalizedGamma = Math.max(-1, Math.min(1, gamma / 45))

      setData(prev => ({
        ...prev,
        beta: normalizedBeta,
        gamma: normalizedGamma,
      }))
    }

    // Auto-request on Android
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      setData(prev => ({ ...prev, permission: 'granted' }))
      window.addEventListener('deviceorientation', handleOrientation)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  useEffect(() => {
    if (data.permission === 'granted') {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const beta = e.beta || 0
        const gamma = e.gamma || 0
        
        const normalizedBeta = Math.max(-1, Math.min(1, beta / 45))
        const normalizedGamma = Math.max(-1, Math.min(1, gamma / 45))

        setData(prev => ({
          ...prev,
          beta: normalizedBeta,
          gamma: normalizedGamma,
        }))
      }

      window.addEventListener('deviceorientation', handleOrientation)
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [data.permission])

  return { ...data, requestPermission }
}
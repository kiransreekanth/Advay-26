'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// Dynamic import for Scene (no SSR for Three.js)
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

// ============================================
// ADVAY COLORS
// ============================================
const COLORS = {
  bg: '#0D0D0D',
  text: '#E5E4E2',
  textMuted: '#71797E',
  red: '#E50914',
  redDark: '#B20710',
}

// ============================================
// KPR VERSE STYLE BOUNDARY FRAME
// ============================================
function BoundaryFrame() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Main Border Frame - All 4 sides */}
      <div
        style={{
          position: 'absolute',
          inset: '20px',
          border: `1px solid ${COLORS.textMuted}30`,
          pointerEvents: 'none',
        }}
      />
      
      {/* Corner Brackets - Top Left */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '24px',
        height: '24px',
        borderTop: `2px solid ${COLORS.textMuted}`,
        borderLeft: `2px solid ${COLORS.textMuted}`,
      }} />
      
      {/* Corner Brackets - Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '24px',
        height: '24px',
        borderTop: `2px solid ${COLORS.textMuted}`,
        borderRight: `2px solid ${COLORS.textMuted}`,
      }} />
      
      {/* Corner Brackets - Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '24px',
        height: '24px',
        borderBottom: `2px solid ${COLORS.textMuted}`,
        borderLeft: `2px solid ${COLORS.textMuted}`,
      }} />
      
      {/* Corner Brackets - Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '24px',
        height: '24px',
        borderBottom: `2px solid ${COLORS.textMuted}`,
        borderRight: `2px solid ${COLORS.textMuted}`,
      }} />
      
      {/* Crosshair Element - Left Side (KPR Verse style) */}
      <div
        style={{
          position: 'absolute',
          left: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
        }}
      >
        {/* Vertical line top */}
        <div style={{
          width: '1px',
          height: '20px',
          background: COLORS.textMuted,
        }} />
        {/* Horizontal line */}
        <div style={{
          width: '20px',
          height: '1px',
          background: COLORS.textMuted,
          position: 'relative',
        }}>
          {/* Center dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            border: `1px solid ${COLORS.textMuted}`,
            background: 'transparent',
          }} />
        </div>
        {/* Vertical line bottom */}
        <div style={{
          width: '1px',
          height: '20px',
          background: COLORS.textMuted,
        }} />
      </div>
    </div>
  )
}

// ============================================
// LOADING SCREEN COMPONENT
// ============================================
function LoadingScreen({ progress, onComplete }: { progress: number; onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const urlRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  
  // GSAP entrance animations
  useGSAP(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(urlRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(progressRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(promptRef.current,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.4 },
      '-=0.2'
    )
  }, { scope: containerRef })
  
  // Exit animation when loading complete
  useEffect(() => {
    if (progress >= 100) {
      gsap.to(promptRef.current, { opacity: 1, duration: 0.3 })
      
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete,
        })
      }, 600)
      
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])
  
  // URL scramble effect
  const [scrambledUrl, setScrambledUrl] = useState('')
  const targetUrl = 'HTTPS://ADVAY.LIVE/2026/FEST/INIT'
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:.'
    let iteration = 0
    
    const interval = setInterval(() => {
      setScrambledUrl(
        targetUrl.split('').map((char, i) => {
          if (i < iteration / 2) return targetUrl[i]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )
      
      iteration++
      if (iteration >= targetUrl.length * 2) {
        clearInterval(interval)
        setScrambledUrl(targetUrl)
      }
    }, 40)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.bg,
      }}
    >
      {/* Terminal URL */}
      <div
        ref={urlRef}
        style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: COLORS.textMuted,
          letterSpacing: '0.12em',
        }}
      >
        {scrambledUrl}
      </div>
      
      {/* Progress */}
      <div ref={progressRef} style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.25em',
          color: COLORS.textMuted,
          marginBottom: '20px',
        }}>
          LOADING → <span style={{ color: COLORS.red }}>{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '180px',
          height: '1px',
          background: `${COLORS.textMuted}30`,
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: COLORS.red,
            boxShadow: `0 0 8px ${COLORS.red}`,
            transition: 'width 0.15s ease-out',
          }} />
        </div>
      </div>
      
      {/* Bottom Prompt */}
      <div
        ref={promptRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: COLORS.textMuted,
        }}
      >
        {progress >= 100 ? (
          <><span style={{ color: COLORS.red }}>TAP</span> TO ENABLE SOUND</>
        ) : (
          'PREPARING EXPERIENCE'
        )}
      </div>
      
      {/* Boundary Frame on Loading Screen too */}
      <BoundaryFrame />
    </div>
  )
}

// ============================================
// MOBILE SLIDE-OUT MENU (KPR Verse Style)
// ============================================
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Animate in
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      })
      // Stagger menu items - with null check for TypeScript
      const menuItems = contentRef.current?.querySelectorAll('.menu-item')
      if (menuItems && menuItems.length > 0) {
        gsap.fromTo(
          menuItems,
          { opacity: 0, x: -30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.4, 
            stagger: 0.08,
            delay: 0.2,
            ease: 'power2.out' 
          }
        )
      }
    } else {
      // Animate out
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
      gsap.to(menuRef.current, {
        x: '-100%',
        duration: 0.3,
        ease: 'power3.in',
      })
    }
  }, [isOpen])
  
  const menuItems = [
    { label: 'HOME', href: '#', highlight: true },
    { label: 'ABOUT', href: '#about' },
    { label: 'EVENTS', href: '#events' },
    { label: 'NEWS', href: '#news' },
    { label: 'CONTACT', href: '#contact' },
  ]
  
  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          opacity: 0,
          zIndex: 998,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />
      
      {/* Menu Panel */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '400px',
          background: COLORS.bg,
          zIndex: 999,
          transform: 'translateX(-100%)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${COLORS.textMuted}30`,
        }}
      >
        {/* Header with close button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 32px',
          borderBottom: `1px solid ${COLORS.textMuted}20`,
        }}>
          {/* Close Button (X with circle like KPR) */}
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `1px solid ${COLORS.textMuted}50`,
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.text,
              fontSize: '18px',
            }}
          >
            ✕
          </button>
          
          {/* Register Button */}
          <button
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${COLORS.red}`,
              color: COLORS.text,
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.red
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            REGISTER
          </button>
        </div>
        
        {/* Menu Content */}
        <div
          ref={contentRef}
          style={{
            flex: 1,
            padding: '48px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {/* Section Label (like KPR's "DISCOVER") */}
          <div
            className="menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <span style={{
              width: '4px',
              height: '4px',
              background: COLORS.red,
              borderRadius: '50%',
            }} />
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: COLORS.textMuted,
            }}>
              DISCOVER
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: `${COLORS.textMuted}30`,
              marginLeft: '12px',
            }} />
          </div>
          
          {/* Main Menu Items (Large Typography like KPR) */}
          {menuItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="menu-item"
              onClick={onClose}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: item.highlight ? COLORS.red : COLORS.text,
                textDecoration: 'none',
                marginBottom: '8px',
                display: 'block',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!item.highlight) e.currentTarget.style.color = COLORS.red
              }}
              onMouseLeave={(e) => {
                if (!item.highlight) e.currentTarget.style.color = COLORS.text
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        {/* Bottom Section (Social Links like KPR) */}
        <div style={{
          padding: '24px 32px',
          borderTop: `1px solid ${COLORS.textMuted}20`,
        }}>
          {/* Connect Section */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '20px',
          }}>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.15em',
              color: COLORS.textMuted,
              paddingTop: '4px',
            }}>
              ■ CONNECT
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <a href="#" style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: COLORS.text,
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}>
                INSTAGRAM
              </a>
              <a href="#" style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: COLORS.text,
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}>
                LINKEDIN
              </a>
            </div>
          </div>
          
          {/* Year */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: COLORS.textMuted,
            letterSpacing: '0.1em',
          }}>
            © 2026
          </div>
        </div>
      </div>
    </>
  )
}

// ============================================
// NAVBAR COMPONENT (Responsive)
// ============================================
function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useGSAP(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
    )
  }, { scope: navRef })
  
  const navItems = [
    { label: 'HOME', href: '#', active: true },
    { label: 'ABOUT', href: '#about' },
    { label: 'EVENTS', href: '#events' },
    { label: 'NEWS', href: '#news' },
    { label: 'CONTACT', href: '#contact' },
  ]
  
  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '16px 16px' : '16px 24px',
        }}
      >
        {/* Left Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Hamburger Menu (Mobile Only) */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '4px',
              }}
            >
              <div style={{ width: '24px', height: '2px', background: COLORS.text }} />
              <div style={{ width: '24px', height: '2px', background: COLORS.text }} />
            </button>
          )}
          
          {/* ADVAY Logo (Always visible) */}
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: COLORS.text,
          }}>
            ADVAY
          </div>
        </div>
        
        {/* Center Navigation Links (Desktop Only) */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  color: item.active ? COLORS.red : COLORS.textMuted,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  if (!item.active) e.currentTarget.style.color = COLORS.text
                }}
                onMouseLeave={(e) => {
                  if (!item.active) e.currentTarget.style.color = COLORS.textMuted
                }}
              >
                {/* Active indicator dot */}
                {item.active && (
                  <span style={{
                    width: '4px',
                    height: '4px',
                    background: COLORS.red,
                    borderRadius: '50%',
                  }} />
                )}
                {item.label}
              </a>
            ))}
          </div>
        )}
        
        {/* Register Button */}
        <button
          style={{
            padding: isMobile ? '10px 16px' : '12px 24px',
            background: 'transparent',
            border: `1px solid ${COLORS.red}`,
            color: COLORS.text,
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.red
            e.currentTarget.style.color = COLORS.text
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = COLORS.text
          }}
        >
          {isMobile ? 'REGISTER' : 'REGISTER NOW'}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}

// ============================================
// HERO CONTENT COMPONENT
// ============================================
function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    
    // Description
    tl.fromTo(descRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }
    )
    
    // Index numbers (like KPR Verse 01K, 02P, 03R)
    const wordIndexElements = indexRef.current?.querySelectorAll('.word-index')
    if (wordIndexElements && wordIndexElements.length > 0) {
      tl.fromTo(wordIndexElements,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.15 },
        '-=0.4'
      )
    }
    
    // Title letters
    const letters = titleRef.current?.querySelectorAll('.hero-letter')
    if (letters) {
      tl.fromTo(letters,
        { opacity: 0, y: 60 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.02,
          ease: 'power3.out' 
        },
        '-=0.5'
      )
    }
    
    // Scroll indicator
    tl.fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      '-=0.2'
    )
  }, { scope: containerRef })
  
  // Animated scroll indicator
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    
    gsap.to(el, {
      y: 6,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
  }, [])
  
  // Words with KPR-style index codes
  const words = [
    { text: 'IGNITE.', index: '01I', align: 'left' },
    { text: 'CREATE.', index: '02C', align: 'center' },
    { text: 'CELEBRATE.', index: '03C', align: 'left' },
  ]
  
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '100px 24px 32px 24px' : '100px 60px 40px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Mobile: Description at top-right (KPR Verse style) */}
      {isMobile && (
        <div
          ref={descRef}
          style={{
            alignSelf: 'flex-end',
            maxWidth: '180px',
            textAlign: 'right',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            lineHeight: 1.5,
            color: COLORS.textMuted,
          }}
        >
          <span style={{ color: COLORS.text, fontWeight: 500 }}>ADVAY</span> is the National-level 
          Techno-Cultural fest of Toc H Institute of Science & Technology. 
          A celebration since 2009.
        </div>
      )}
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: isMobile ? 'flex-end' : 'center',
      }}>
        {/* Desktop: Description on left */}
        {!isMobile && (
          <div
            ref={descRef}
            style={{
              maxWidth: '300px',
              marginBottom: '40px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              lineHeight: 1.7,
              color: COLORS.textMuted,
            }}
          >
            <span style={{ color: COLORS.text, fontWeight: 500 }}>ADVAY</span> is the National-level 
            Techno-Cultural fest of Toc H Institute of Science & Technology. 
            A celebration since 2009.
          </div>
        )}
        
        {/* Hero Title with Index Numbers */}
        <div 
          ref={titleRef}
          style={{
            marginBottom: isMobile ? '24px' : '0',
          }}
        >
          <div ref={indexRef}>
            {words.map((word, wordIndex) => (
              <div
                key={word.text}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  // Mobile: center aligned, slight stagger on CREATE
                  textAlign: isMobile ? 'center' : 'left',
                  marginLeft: isMobile 
                    ? '0'
                    : (word.align === 'center' ? '15%' : 0),
                  marginBottom: wordIndex < words.length - 1 ? (isMobile ? '-4px' : '-5px') : 0,
                }}
              >
                {/* Index code (like KPR Verse 01K, 02P, 03R) - Hide on mobile */}
                {!isMobile && (
                  <span
                    className="word-index"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: word.align === 'center' ? '-50px' : '-45px',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      color: COLORS.textMuted,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {word.index}
                  </span>
                )}
                
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: isMobile ? 'clamp(32px, 10vw, 44px)' : 'clamp(48px, 12vw, 140px)',
                  fontWeight: 700,
                  lineHeight: isMobile ? 1.1 : 0.95,
                  letterSpacing: '-0.02em',
                  color: COLORS.text,
                  display: 'inline-block',
                  // Mobile: indent CREATE slightly
                  marginLeft: isMobile && wordIndex === 1 ? '8%' : '0',
                }}>
                  {word.text.split('').map((letter, i) => (
                    <span
                      key={`${word.text}-${i}`}
                      className="hero-letter"
                      style={{ display: 'inline-block' }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Info - KPR Verse style */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: '24px',
      }}>
        {/* Left - Event details */}
        <div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: `${COLORS.textMuted}80`,
            letterSpacing: '0.1em',
            marginBottom: '4px',
          }}>
            ////
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: isMobile ? '10px' : '11px',
            color: COLORS.textMuted,
            letterSpacing: '0.08em',
          }}>
            FEB 14-15, 2026
          </div>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '10px' : '11px',
            color: COLORS.textMuted,
            letterSpacing: '0.06em',
            marginTop: '2px',
          }}>
            TIST, ARAKKUNNAM
          </div>
        </div>
        
        {/* Right - Scroll indicator */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            color: COLORS.textMuted,
            letterSpacing: '0.15em',
          }}
        >
          SCROLL
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 5L6 9L10 5" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  
  // Simulate loading
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Eased progress
        const remaining = 100 - prev
        return prev + Math.max(1, remaining * 0.08)
      })
    }, 60)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <main style={{ 
      position: 'fixed', 
      inset: 0,
      overflow: 'hidden',
    }}>
      {/* 3D Background */}
      <Scene />
      
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen
          progress={Math.round(progress)}
          onComplete={() => setIsLoading(false)}
        />
      )}
      
      {/* Main Content (after loading) */}
      {!isLoading && (
        <>
          {/* KPR Verse Style Boundary Frame */}
          <BoundaryFrame />
          
          {/* Navigation Bar */}
          <Navbar />
          
          {/* Hero Content */}
          <HeroContent />
        </>
      )}
    </main>
  )
}
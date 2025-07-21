// Animation tokens for glassmorphism effects
export const animations = {
  // Timing functions
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Duration tokens
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
  },

  // Keyframe animations
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideUp: `
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    slideDown: `
      @keyframes slideDown {
        from { 
          opacity: 0;
          transform: translateY(-20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    scaleIn: `
      @keyframes scaleIn {
        from { 
          opacity: 0;
          transform: scale(0.9);
        }
        to { 
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    shimmer: `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `,
    glow: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
      }
    `,
  },
};
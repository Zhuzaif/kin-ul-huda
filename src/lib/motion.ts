export const ANIMATION_DURATION = {
  micro: 0.15,
  small: 0.2,
  screen: 0.3,
  theme: 0.4,
};

export const EASING = [0.22, 1, 0.36, 1]; // cubic-bezier(0.22, 1, 0.36, 1)

// Page Transitions (Fade in + slide up)
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: ANIMATION_DURATION.screen, ease: EASING } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: ANIMATION_DURATION.small, ease: EASING } 
  }
};

// Lists Stagger Effect
export const listVariants = {
  initial: {},
  animate: { 
    transition: { staggerChildren: 0.04 } 
  }
};

export const listItemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: ANIMATION_DURATION.small, ease: EASING } 
  }
};

// Modals, Dialogs, Bottom Sheets
export const modalVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: ANIMATION_DURATION.screen, ease: EASING } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { duration: ANIMATION_DURATION.small, ease: EASING } 
  }
};

export const dialogVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: ANIMATION_DURATION.screen, ease: EASING } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    transition: { duration: ANIMATION_DURATION.small, ease: EASING } 
  }
};

// Tap/Press Micro-interactions
export const buttonTap = { scale: 0.97 };

export const playRetroClick = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Retro click/thud sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio errors (e.g. if browser blocks autoplay before interaction)
  }
};

const mouseClickAudio = new Audio('/mouse_click.mp3');

export const playGenericClick = () => {
  try {
    // Reset time to allow rapid clicking
    mouseClickAudio.currentTime = 0;
    mouseClickAudio.play().catch(() => {
      // Ignore if browser blocks autoplay before interaction
    });
  } catch (e) {
    // Ignore audio errors
  }
};

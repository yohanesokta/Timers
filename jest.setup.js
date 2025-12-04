// Mock for Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    type: '',
    frequency: { setValueAtTime: jest.fn() },
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: { 
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn()
    },
  })),
  destination: {},
  state: 'running',
  resume: jest.fn(),
}));

// Mock for requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

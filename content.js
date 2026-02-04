/**
 * Gerrit Atom One Dark - Performance Edition with Visual Feedback
 */

const ATOM = {
  bg: '#282c34',
  text: '#abb2bf',
  green: '#98c379',
  red: '#e06c75',
  purple: '#c678dd',
  blue: '#61aeee',
  gray: '#7f848e',
  diffAdd: '#2d3f34',
  diffRemove: '#4b3136'
};

// 1. Injected CSS (Theme + Spinner)
const STYLE_BLOCK = `
  /* Theme Variables */
  :host, .gr-diff, gr-diff, .contentText {
    background-color: ${ATOM.bg} !important;
    color: ${ATOM.text} !important;
  }
  .intraline, hl, .gr-syntax { background-color: transparent !important; }
  .add, .gi, .add .contentText, .gi .contentText { background-color: ${ATOM.diffAdd} !important; }
  .remove, .gd, .remove .contentText, .gd .contentText { background-color: ${ATOM.diffRemove} !important; }
  hl.gr-syntax-string { color: ${ATOM.green} !important; }
  hl.gr-syntax-keyword { color: ${ATOM.purple} !important; }
  hl.gr-syntax-comment { color: ${ATOM.gray} !important; font-style: italic !important; }
  hl.tk-text-f, hl.tk-text-f hl.gr-syntax-string { color: ${ATOM.purple} !important; font-weight: bold !important; }
  hl.tk-text-f ~ hl[class*="tk-text-"] hl.gr-syntax-string { color: ${ATOM.red} !important; }
  .lineNum, .lineNumButton { color: #5c6370 !important; background-color: ${ATOM.bg} !important; }

  /* Visual Feedback Spinner */
  #atom-highlighter-status {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
    border: 3px solid rgba(198, 120, 221, 0.2);
    border-top: 3px solid ${ATOM.purple};
    border-radius: 50%;
    z-index: 9999;
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
  }
  #atom-highlighter-status.active {
    opacity: 1;
    animation: atom-spin 0.8s linear infinite;
  }
  @keyframes atom-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Create the status indicator
const loader = document.createElement('div');
loader.id = 'atom-highlighter-status';
document.body.appendChild(loader);

const styleTag = document.createElement('style');
styleTag.textContent = STYLE_BLOCK;
document.head.appendChild(styleTag);

let isWorking = false;
let workTimeout;

function setWorking(state) {
  if (state) {
    loader.classList.add('active');
    isWorking = true;
  } else {
    // Small delay before hiding so it doesn't flicker too fast
    clearTimeout(workTimeout);
    workTimeout = setTimeout(() => {
      loader.classList.remove('active');
      isWorking = false;
    }, 400);
  }
}

function inject(root) {
  if (!root) return;

  if (root instanceof ShadowRoot) {
    if (!root.querySelector('#atom-style-perf')) {
      const s = document.createElement('style');
      s.id = 'atom-style-perf';
      s.textContent = STYLE_BLOCK;
      root.appendChild(s);
    }
  }

  const children = root.querySelectorAll ? root.querySelectorAll('*') : [];
  children.forEach(el => {
    if (el.shadowRoot) inject(el.shadowRoot);
  });
}

// Debounced processing to save CPU
let processingTimer;
function triggerProcessing() {
  setWorking(true);

  // Use requestIdleCallback if available, otherwise setTimeout
  const scheduler = window.requestIdleCallback || window.setTimeout;

  clearTimeout(processingTimer);
  processingTimer = setTimeout(() => {
    scheduler(() => {
      inject(document.body);
      setWorking(false);
    });
  }, 150); // Wait for 150ms of "quiet" before running
}

const observer = new MutationObserver((mutations) => {
  // Only trigger if actual elements were added/removed
  const hasChanges = mutations.some(m => m.addedNodes.length > 0);
  if (hasChanges) triggerProcessing();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial Load
triggerProcessing();
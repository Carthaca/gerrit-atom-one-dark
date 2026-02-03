const ATOM = {
  bg: '#282c34',
  text: '#abb2bf',
  green: '#98c379',
  red: '#e06c75',
  purple: '#c678dd',
  blue: '#61aeee',
  gray: '#5c6370',
  orange: '#d19a66'
};

function applySurgicalStyle(el, color) {
  el.style.setProperty('color', color, 'important');
}

function processLine(line) {
  const fullText = line.textContent;
  const variableRanges = [];
  const regex = /\{.*?\}/g;
  let match;
  while ((match = regex.exec(fullText)) !== null) {
    variableRanges.push({ start: match.index, end: match.index + match[0].length });
  }

  const allSpans = line.querySelectorAll('.gr-syntax');
  let offset = 0;

  allSpans.forEach(span => {
    const text = span.textContent;
    const spanStart = fullText.indexOf(text, offset);

    if (spanStart !== -1) {
      const spanEnd = spanStart + text.length;
      offset = spanEnd;

      // Check if this span is "mixed" (contains both variable and non-variable chars)
      let hasVar = false;
      let hasStr = false;
      for (let i = spanStart; i < spanEnd; i++) {
        if (variableRanges.some(r => i >= r.start && i < r.end)) hasVar = true;
        else hasStr = true;
      }

      // If it's mixed (like "}" or "}. {"), we rebuild the inside of the span
      if (hasVar && hasStr) {
        let newHTML = '';
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const globalIdx = spanStart + i;
          const isCharVar = variableRanges.some(r => globalIdx >= r.start && globalIdx < r.end);
          const color = isCharVar ? ATOM.red : ATOM.green;
          newHTML += `<span style="color: ${color} !important;">${char}</span>`;
        }
        span.innerHTML = newHTML;
      } else if (hasVar) {
        applySurgicalStyle(span, ATOM.red);
      } else {
        applyBasicColor(span);
      }
    }
  });
}

function applyBasicColor(span) {
  // If we already manually colored the inside, don't override the outer span
  if (span.querySelector('span')) return;

  const text = span.textContent;
  if (span.classList.contains('gr-syntax-keyword') || text === 'f') {
    applySurgicalStyle(span, ATOM.purple);
  } else if (span.classList.contains('gr-syntax-string')) {
    applySurgicalStyle(span, ATOM.green);
  } else if (span.classList.contains('gr-syntax-comment')) {
    applySurgicalStyle(span, ATOM.gray);
  } else if (span.classList.contains('gr-syntax-number')) {
    applySurgicalStyle(span, ATOM.orange);
  }
}

function themeDiff(diff) {
  diff.style.setProperty('--gr-diff-background-color', ATOM.bg, 'important');
  if (diff.shadowRoot) {
    let style = diff.shadowRoot.querySelector('#atom-theme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'atom-theme';
      diff.shadowRoot.appendChild(style);
    }
    style.textContent = `
      :host, .gr-diff, .content, .contentText, gr-diff-text {
        background-color: ${ATOM.bg} !important;
        color: ${ATOM.text} !important;
      }
      .lineNum, .blankLineNum {
        background-color: ${ATOM.bg} !important;
        color: #4b5263 !important;
      }
      .gi { background-color: #2c313a !important; } /* Inserts */
      .gd { background-color: #3e4451 !important; } /* Deletions */
      .content.add { background-color: #2d3f34 !important; }
      .content.remove { background-color: #4b3136 !important; }
    `;
    diff.shadowRoot.querySelectorAll('gr-diff-text').forEach(processLine);
  }
}

function run() {
  const search = (root) => {
    root.querySelectorAll('gr-diff').forEach(themeDiff);
    root.querySelectorAll('*').forEach(el => {
      if (el.shadowRoot) search(el.shadowRoot);
    });
  };
  search(document);
}

setInterval(run, 2000);
run();
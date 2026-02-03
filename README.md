# Gerrit Atom One Dark 🚀

A Chrome Extension that brings the **Atom One Dark** syntax theme to Gerrit code reviews (specifically tested on `review.opendev.org`).

## Features
- **Surgical Highlighting:** Correctly highlights Python f-strings, even when Gerrit fragments the HTML into multiple spans.
- **Shadow DOM Piercing:** Works seamlessly with PolyGerrit's nested Shadow DOM architecture.
- **Performance Optimized:** Uses a character-tracking engine to ensure accurate colors without slowing down your browser.

## Installation (Manual)
Since this is a developer tool, you can install it via Chrome's Developer Mode:

1. Download this repository as a ZIP and extract it.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the folder containing the extension files.
5. Refresh your Gerrit page.

## Technical Details
Gerrit's rendering engine often splits a single line of code into dozens of nested spans, making standard CSS themes fail. This extension uses a custom JavaScript engine to:
1. Reconstruct the text of each line.
2. Identify f-string variable ranges using Regex.
3. Manually split and recolor DOM nodes at the character level to ensure `f"text {var}"` is colored accurately.

## License
Apache
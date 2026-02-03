# Gerrit Atom One Dark 🚀

A Chrome Extension that brings the **Atom One Dark** syntax theme to Gerrit code reviews (specifically tested on `review.opendev.org`).

## The Problem (The "Why")
Gerrit's modern "PolyGerrit" UI is notoriously difficult to theme for two main reasons:

1. **Shadow DOM Encapsulation:** The code diffs are hidden inside nested Shadow DOM layers. Standard CSS injection cannot "see" or style the code without explicitly piercing these boundaries.
2. **Extreme Token Fragmentation:** Unlike standard highlighters that wrap a variable in a single `<span>`, Gerrit's rendering engine often splits a single word or f-string into multiple, separate HTML elements. For example:
   - `f"hello {name}"` might be split into 11+ different spans.
   - Braces `{}` are often merged with the surrounding string text (e.g., `}"`), making it impossible to color them differently using just CSS.

## The Solution
This extension doesn't just inject a stylesheet; it runs a **character-level surgical engine**:
- **Shadow Piercing:** Recursively traverses the `gr-app` and `gr-diff` shadow roots to find hidden code blocks.
- **Character Mapping:** It reconstructs the text content of every line, identifies Python f-string variables via Regex, and maps those character offsets back to the fragmented DOM.
- **Sub-Atomic Injector:** If a span contains mixed content (like a brace and a quote), the extension splits that span into individual character nodes to apply the correct Atom One Dark hex codes.

## Created with Gemini 🤖
This entire extension was built through an iterative, collaborative process with **Gemini**.
- **The Journey:** We went through several architectural iterations—moving from simple CSS injection to Shadow DOM adopted stylesheets, and finally to a custom JavaScript character-mapping engine to solve the f-string fragmentation issue.
- **AI-Human Collaboration:** The logic for "surgical" span splitting and the recursive heartbeat that handles Gerrit's lazy-loading were developed through real-time debugging and DOM analysis provided by the user.

## Installation (Manual)
1. Download this repository as a ZIP and extract it.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.
5. Refresh your Gerrit page.

## License
Apache
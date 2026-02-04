# Gerrit Atom One Dark

A high-performance, high-specificity syntax highlighting override for Gerrit. This project brings the **Atom One Dark** aesthetic to the code review process while solving the unique challenges posed by Gerrit's modern architecture.

## 🚀 Key Features

* **True Atom One Dark Palette**: Accurately mapped colors for keywords, strings, comments, and variables.
* **The "Surgical" F-String Fix**: Solves the common Gerrit issue where Python f-strings are rendered as a single green block. This script identifies variables inside f-strings (`f"{variable}"`) and forces them to Atom Red.
* **Shadow DOM Piercing**: Recursively injects styles into every nested Shadow Root to ensure styles reach "lazy-loaded" diff chunks and Lit-rendered elements.
* **Performance Optimized**:
    * **Debounced Injection**: Prevents browser lag by waiting for a "quiet period" before processing the DOM.
    * **Idle Scheduling**: Uses `requestIdleCallback` to run heavy styling tasks without interrupting smooth scrolling.
* **Visual Feedback**: Includes a pulsing Atom-purple ring in the bottom-right corner that appears whenever the script is actively calculating syntax logic.

## 🎨 Syntax Mapping

| Token | Color | Hex Code |
| :--- | :--- | :--- |
| **Background** | Slate | `#282c34` |
| **Text** | Silver | `#abb2bf` |
| **Keywords** | Purple | `#c678dd` |
| **Strings** | Green | `#98c379` |
| **F-String Vars** | Red | `#e06c75` |
| **Comments** | Gray | `#7f848e` |
| **Add Line** | Deep Green | `#2d3f34` |
| **Remove Line** | Deep Red | `#4b3136` |

## 🛠 Installation

1.  **Requirement**: A browser extension that supports custom scripts (e.g., Tampermonkey, Violentmonkey) or a local unpacked extension.
2.  **Script**: Copy the contents of `content.js` into your script manager.
3.  **Match Pattern**: Ensure your script is configured to run on your Gerrit domain, for example:
    ```javascript
    // @match [https://gerrit.yourcompany.com/](https://gerrit.yourcompany.com/)*
    ```

## 🧠 Technical Overview: Fragmented Tokenization
Modern Gerrit instances fragment code into many tiny `<hl>` tags, often separating the `f` prefix from the `{` and the internal `variable_name`. This script uses **CSS Sibling Selectors (`~`)** and specific token class targeting (`tk-text-*`) to identify variables that specifically follow an `f` token, ensuring that docstrings and regular strings remain correctly green.

## 🔄 Status Indicator
* **Purple Spinner Visible**: The script is currently calculating syntax logic or re-applying styles after a scroll/render event.
* **Hidden**: The theme is fully applied and the browser is idle.

## License
Apache License 2.0
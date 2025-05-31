# ugrandjo README

Written for the AIforSocial good hackathon by MicrosoftSA in collaboration with Geekulcha ans 22OnSloan
A vscode quickstart extension first ever attempt at creating an extension Copilot endpoint. typescript 
is a delightful, animated VS Code companion designed to hype you up while you code. This extension brings a pixelated dog into your editor's side panel who animates, reacts to your code, and delivers motivational feedback based on what you’re working on.


## Features

- 🐾 **Pixel Dog Companion**: A side-panel animated dog that reacts to your code and commands.
- 🧠 **Context-Aware Motivation**: Analyzes your code to provide animated, breed-specific motivation.
- 🔄 **Breed Selector**: Choose between Shiba, Golden Retriever, Pomeranian.
- 🎨 **Sprite-Based Animation**: Idle, bark, read, and other actions triggered via CSS sprites.
- 🎮 **WebView Interface**: Secure, styled panel powered by WebView and VS Code APIs.


## 🚀 Getting Started

1. Open VS Code.
2. Clone this repo or install via the extensions `ugrandlo`.
3. Press `F5` to run the extension in a new Extension Development Host.
4. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and try:
   - `Hypedawg: Hype`
   - `Hypedawg: Breed`

---

### 📂 File Structure

hypedawg/
├── media/
│ ├── main.js # WebView script
│ ├── main.css # Styling with sprite logic
│ ├── sprite.css # Animation logic
│ └── *.png # Sprite images (shiba, retriever, etc.)
│
├── src/
│ ├── extension.ts # Entry point and commands
│ ├── getHype.ts # Code analysis + motivation logic
│ └── getPrompt.ts # Prompt builder for feedback
│
├── package.json # Extension config
└── README.md # This file

## HOW IT WORKS
Main entry point that:
- Registers the WebView (`HypedawgViewProvider`)
- Registers two commands:
  - `hypedawg.hype`: Analyzes code + shows animation
  - `hypedawg.breed`: Lets you choose a breed

### 📬 Messaging & Animation
In `main.js`, the WebView listens for messages like:

```js
{
  animation: "bark",
  breed: "shiba",
  hype: "Nice async function, you're crushing it!"
}

**Enjoy!**

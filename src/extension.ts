// @ts-nocheck
import * as vscode from "vscode";

let currentBreed = "golden";

export function activate(context: vscode.ExtensionContext) {
  const provider = new HypedawgViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      HypedawgViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("hypedawg.animate", async () => {
      const animation = await vscode.window.showQuickPick([
        "idle", "walk", "run", "bark", "sit", "tilt", "leap", "howl",
        "paw", "beg", "rollover", "wetDogShake", "playful", "read"
      ]);
      provider.animate(animation);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("hypedawg.breed", async () => {
      const breed = await vscode.window.showQuickPick([
        "golden", "wolf", "pomeranian", "shiba"
      ]);
      currentBreed = breed;
      provider.setBreed(breed);
    })
  );
}

class HypedawgViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "hypedawg.hypedawgView";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  ////
  public animate(animation: string) {
    if (animation) {
      this._view?.webview.postMessage({ animation, breed: currentBreed });
    }
  }
  
  public setBreed(breed: string) {
    if (breed) {
      currentBreed = breed;
      this._view?.webview.postMessage({ breed, animation: "idle" }); // Reset to idle with the new breed
    }
  }
  ////

  // public animate(animation: string) {
  //   this._view?.webview.postMessage({ animation, breed: currentBreed });
  // }

  // public setBreed(breed: string) {
  //   currentBreed = breed;
  //   this._view?.webview.postMessage({ breed, animation: "idle" }); // Send the updated breed with "idle" animation
  // }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const resetCss = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const mainCss = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
    );
    const vscodeCss = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const spriteCss = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "sprite.css")
    );
  
    const goldenUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "golden.png")
    );
    const wolfUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "wolf.png")
    );
    const shibaUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "shiba.png")
    );
    const pomeranianUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "pomeranian.png")
    );
  
    const nonce = getNonce();
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline' ${webview.cspSource};">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${resetCss}" rel="stylesheet">
        <link href="${mainCss}" rel="stylesheet">
        <link href="${vscodeCss}" rel="stylesheet">
        <link href="${spriteCss}" rel="stylesheet">
        <style>
          .golden { background-image: url(${goldenUri}); }
          .wolf { background-image: url(${wolfUri}); }
          .shiba { background-image: url(${shibaUri}); }
          .pomeranian { background-image: url(${pomeranianUri}); }
        </style>
        <title>Hypedawg</title>
      </head>
      <body>
        <div id="hypedawg" class="idle golden"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

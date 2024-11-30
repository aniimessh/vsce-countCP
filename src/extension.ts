import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "countcp" is now active!');

  // Initialize counts for Copy and Paste
  let copyCount = 0;
  let pasteCount = 0;

  // Create a status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = `Copy: ${copyCount} | Paste: ${pasteCount}`;
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Wrap copy command
  const originalCopyCommand = vscode.commands.executeCommand.bind(
    null,
    "editor.action.clipboardCopyAction"
  );
  const copyCommandDisposable = vscode.commands.registerCommand(
    "countcp.trackCopy",
    async () => {
      copyCount++;
      statusBarItem.text = `Copy: ${copyCount} | Paste: ${pasteCount}`;
      await originalCopyCommand(); // Call the original copy command
    }
  );

  // Wrap paste command
  const originalPasteCommand = vscode.commands.executeCommand.bind(
    null,
    "editor.action.clipboardPasteAction"
  );
  const pasteCommandDisposable = vscode.commands.registerCommand(
    "countcp.trackPaste",
    async () => {
      pasteCount++;
      statusBarItem.text = `Copy: ${copyCount} | Paste: ${pasteCount}`;
      await originalPasteCommand(); // Call the original paste command
    }
  );

  // Add disposables to the context
  context.subscriptions.push(copyCommandDisposable);
  context.subscriptions.push(pasteCommandDisposable);

  // Optional: Command to show a greeting message
  const disposableHelloWorld = vscode.commands.registerCommand(
    "countcp.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Let's Count Your Copy & Paste Skills!"
      );
    }
  );
  context.subscriptions.push(disposableHelloWorld);
}

export function deactivate() {}

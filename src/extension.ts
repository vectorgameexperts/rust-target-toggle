// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ConsoleMessage } from 'puppeteer';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rust-target-toggle" is now active!');
	
	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(symbol-misc)";
    statusBarItem.tooltip = "Toggle Rust Target";
    statusBarItem.command = 'rust-target-toggle.toggleTarget';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rust-target-toggle.toggleTarget', async  () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let target = 'wasm32-unknown-unknown';
		const settings = vscode.workspace.getConfiguration('rust-analyzer');
		const currentValue = settings.get('cargo.target');
		vscode.window.showInformationMessage('current val '+ currentValue);
		if (currentValue === target) {
			try{
			 	await settings.update('cargo.target', undefined, vscode.ConfigurationTarget.Workspace);
				vscode.window.showInformationMessage('Removed target setting, you can ignore the rust server restart');
				vscode.commands.executeCommand('rust-analyzer.restartServer'); 
			}
			catch  (error) {
				console.log('failure removing cargo target' + error);
			}
			finally{
				vscode.window.showInformationMessage("Sucess");
			}
		}  else {
			try  {
				await settings.update('cargo.target', 'wasm32-unknown-unknown', vscode.ConfigurationTarget.Workspace);
				//@command:rust-analyzer.restartServer
				vscode.commands.executeCommand('rust-analyzer.restartServer'); 
				vscode.window.showInformationMessage('Swapped target to '+ target + " you can ignore the rust server restart");
			}
			catch  (error) {
				console.log('failure updating cargo target' + error);
			}
			finally{
				vscode.window.showInformationMessage("Success");
			}

		}

	});

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}

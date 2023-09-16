// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const settings = vscode.workspace.getConfiguration('rust-analyzer');
const defaultValue = settings.get('cargo.target');
const target = 'wasm32-unknown-unknown';
let currentValue= defaultValue;
let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

export function activate(context: vscode.ExtensionContext) {

	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(' "rust-target-toggle" is now active!');
	
	


	// button
	
    statusBarItem.text = "Target Toggle";
    statusBarItem.tooltip = "Toggle Rust Target";
    statusBarItem.command = 'rust-target-toggle.toggleTarget';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
	
	vscode.workspace.getConfiguration('rust-analyzer');
	context.subscriptions.push(disposable);

}

	let disposable = vscode.commands.registerCommand('rust-target-toggle.toggleTarget', async  () => {
		// if current val is wasm
		console.log("current setting: " + currentValue);
		if (currentValue === target) {
			try{
			 	await settings.update('cargo.target', undefined, vscode.ConfigurationTarget.Workspace);
				vscode.window.showInformationMessage('Removed target setting, you can ignore the rust server restart');

				//restart server
				await vscode.commands.executeCommand('rust-analyzer.restartServer'); 
			}
			catch  (error) {
				console.log('failure removing cargo target' + error);
			}
			finally{
				vscode.window.showInformationMessage("Sucess");
				currentValue = null;
				statusBarItem.text = "Target " + target;
				console.log("leaving... " + settings.get('cargo.target'));
			}
		// else replace with wasm	
		}  else {
			try  {
				await settings.update('cargo.target', target, vscode.ConfigurationTarget.Workspace);
				vscode.window.showInformationMessage('Swapped target to '+ target + " you can ignore the rust server restart");
				//restart server
				await vscode.commands.executeCommand('rust-analyzer.restartServer'); 

			}
			catch  (error) {
				console.log('failure updating cargo target' + error);
			}
			finally{
				vscode.window.showInformationMessage("Success");
				currentValue = target;
				statusBarItem.text = "Target Null";
				console.log("leaving... " + settings.get('cargo.target'));
			}

		}

	});
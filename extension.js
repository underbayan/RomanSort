const vscode = require('vscode');
const { compiler } = require("./lib/compiler")
function activate(context) {
	const task = function (desc, caseInsensitive)
	{
		try {
			const textEditor = vscode.window.activeTextEditor;
			const selection = textEditor.selection;
			const startLine = selection.start.line;
			const startPos = selection.start.character;
			const endLine = selection.end.line;
			const endPos = selection.end.character;
			const selectedText = getSelection(textEditor, startLine, startPos, endLine, endPos);
			const sortedText = compiler(selectedText, desc, caseInsensitive);
			setSelection(textEditor, startLine, startPos, endLine, endPos, sortedText);
			return true;
		} catch (e) { void 0; }
	}
	const commands = [
		vscode.commands.registerCommand("roman.sort", () => task(false, false)),
		vscode.commands.registerCommand("roman.sort.reverse", () => task(true, false)),
		vscode.commands.registerCommand("roman.sort.caseInsensitive", () => task(false, true)),
		vscode.commands.registerCommand("roman.sort.reverse.caseInsensitive", () => task(true, true))
	];

	// context.subscriptions.push(disposable);
	commands.map((command) => context.subscriptions.push(command));
}

function getSelection(textEditor, startLine, startPos, endLine, endPos) {
	const selectedLines = [];
	for (let i = startLine; i <= endLine; ++i) {
		let text = textEditor.document.lineAt(i).text; if (i === endLine) { text = text.slice(0, endPos); };
		if (i === startLine) { text = text.slice(startPos); }
		selectedLines.push(text);
	}
	return selectedLines.join("\n");
}

function setSelection(textEditor, startLine, startPos, endLine, endPos, sortedText) {
	textEditor.edit(
		function (editBuilder) {
			const range = new vscode.Range(startLine, startPos, endLine, endPos);
			editBuilder.replace(range, sortedText);
		});
}


function deactivate() { }
module.exports = { activate, deactivate }
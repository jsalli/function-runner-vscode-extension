import { ChildProcess } from 'child_process';
import { window } from 'vscode';

export function processOutputToOutputChannel(
	process: ChildProcess,
	functionName: string,
	returnOutputForTest?: boolean | undefined,
): Promise<string | undefined> {
	return new Promise((res) => {
		let outputForTestExpect = '';
		const outputChannel = window.createOutputChannel(
			'Function output',
			'function-runner-vscode-extension-output',
		);
		outputChannel.show(true);

		outputChannel.appendLine(`[Running] Function ${functionName}`);
		if (returnOutputForTest) {
			outputForTestExpect += `[Running] Function ${functionName}\n`;
		}

		process.stdout?.on('data', (data: Buffer) => {
			const stdOutput = data.toString();
			outputChannel.append(stdOutput);
			if (returnOutputForTest) {
				outputForTestExpect += `${stdOutput}`;
			}
		});

		process.stderr?.on('data', (data: Buffer) => {
			const stdOutput = data.toString();
			outputChannel.append(stdOutput);
			if (returnOutputForTest) {
				outputForTestExpect += `${stdOutput}`;
			}
		});

		process.on('close', (code) => {
			outputChannel.appendLine('');
			outputChannel.appendLine(`[Done] exited with code=${code}`);
			outputChannel.appendLine('');
			if (returnOutputForTest) {
				outputForTestExpect += '\n';
				outputForTestExpect += `[Done] exited with code=${code}`;
				res(outputForTestExpect);
			}
		});
	});
}

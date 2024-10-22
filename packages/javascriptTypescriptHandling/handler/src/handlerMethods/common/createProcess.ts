import { ChildProcess, spawn, SpawnOptions, StdioOptions } from 'child_process';

export interface ProcessRunOptions {
	cwd: string;
	commandLine: string;
	args: string[];
	envVars: { [key: string]: string | undefined } | undefined;
	shell: string | true;
}

export function createProcess(
	processRunOptions: ProcessRunOptions,
): ChildProcess {
	const stdio: StdioOptions = ['pipe', 'pipe', 'pipe'];

	const envsWithParentProcessEnvs = {
		...process.env,
		...processRunOptions?.envVars,
	};

	const options: SpawnOptions = {
		cwd: processRunOptions.cwd,
		stdio,
		env: envsWithParentProcessEnvs,
		shell:
			typeof processRunOptions.shell === 'string' && processRunOptions.shell
				? processRunOptions.shell
				: true,
		// for non-windows: run in detached mode so the process will be the group leader and any subsequent process spawned
		// within can be later killed as a group to prevent orphan processes.
		// see https://nodejs.org/api/child_process.html#child_process_options_detached
		detached: process.platform !== 'win32',
	};

	// if (PRODUCTION === false) {
	// 	Logger.debug('Starting child process with envs', options.env);
	// 	Logger.debug('Starting child process with args', args);
	// }

	return spawn(processRunOptions.commandLine, processRunOptions.args, options);
}

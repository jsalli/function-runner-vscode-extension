import { container } from 'tsyringe';
import { DebugConfigurationProvider } from 'vscode';
import { JsTsDebugConfigurationProvider } from './JsTsDebugConfigurationProvider';

export const getJsTsDebugConfigurationProvider =
	(): DebugConfigurationProvider => {
		const provider = container.resolve(JsTsDebugConfigurationProvider);
		return provider;
	};

import { InjectionToken } from 'tsyringe';
import { ExtensionMode } from 'vscode';

export const vscodeUniqueExtensionIDInjectionToken: InjectionToken<string> =
	'vscodeUniqueExtensionID';
export const vscodeExtensionTempFolderInjectionToken: InjectionToken<string> =
	'vscodeExtensionTempFolderInjectionToken';
export const vscodeExtensionModeInjectionToken: InjectionToken<ExtensionMode> =
	'vscodeExtensionModeInjectionToken';

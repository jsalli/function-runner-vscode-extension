import { ConfigurationChangeEvent, Disposable, languages } from 'vscode';
import { ConfigurationService } from '@functionrunner/shared';
import { LoggerService } from '@functionrunner/shared';
import { container, injectable, singleton } from 'tsyringe';
import { FunctionRunnerCodeLensProvider } from './FunctionRunnerCodeLensProvider';

@injectable()
@singleton()
export class CodeLensController implements Disposable {
	private disposable: Disposable | undefined;
	private providerDisposable: Disposable | undefined;
	private codeLensProviders: FunctionRunnerCodeLensProvider[] = [];

	constructor(
		private logger: LoggerService,
		private configurationService: ConfigurationService,
	) {
		this.disposable = Disposable.from(
			this.configurationService.onDidChange(this.onConfigurationChanged, this),
		);
		this.onConfigurationChanged();
	}

	dispose() {
		this.providerDisposable?.dispose();
		this.disposable?.dispose();
	}

	private onConfigurationChanged(e?: ConfigurationChangeEvent) {
		if (!this.configurationService.changed(e, 'codeLens')) {
			return;
		}
		if (e != null) {
			this.logger.log('CodeLens config changed; resetting CodeLens provider');
		}

		const cfg = this.configurationService.get('codeLens');
		if (cfg.enabled === true) {
			this.ensureProviders();
		} else {
			this.providerDisposable?.dispose();
			this.codeLensProviders = [];
		}
	}

	private ensureProviders() {
		if (this.codeLensProviders.length > 0) {
			this.codeLensProviders.forEach((codeLensProvider) =>
				codeLensProvider.reset(),
			);
			return;
		}

		this.providerDisposable?.dispose();

		const codeLensProviders =
			container.resolveAll<FunctionRunnerCodeLensProvider>(
				'FunctionRunnerCodeLensProvider',
			);
		const codeLensProviderDisposables = codeLensProviders.map(
			(codeLensProvider) =>
				languages.registerCodeLensProvider(
					codeLensProvider.selector,
					codeLensProvider,
				),
		);
		this.providerDisposable = Disposable.from(...codeLensProviderDisposables);
	}
}

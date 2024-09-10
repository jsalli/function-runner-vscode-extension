import { ConfigurationChangeEvent, Disposable, languages } from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';
import { LoggerService } from '../services/LoggerService';
import { container, injectable, singleton } from 'tsyringe';
import { FunctionRunnerCodeLensProvider } from './FunctionRunnerCodeLensProvider';

@injectable()
@singleton()
export class CodeLensController implements Disposable {
	private _disposable: Disposable | undefined;
	private _providerDisposable: Disposable | undefined;
	private codeLensProviders: FunctionRunnerCodeLensProvider[] = []

	constructor(
		private logger: LoggerService,
		private configurationService: ConfigurationService
	) {
		this._disposable = Disposable.from(
			this.configurationService.onDidChange(this.onConfigurationChanged, this),
		);
		this.onConfigurationChanged()
	}

	dispose() {
		this._providerDisposable?.dispose();
		this._disposable?.dispose();
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
			this._providerDisposable?.dispose();
			this.codeLensProviders = []
		}
	}

	private ensureProviders() {
		if (
			this.codeLensProviders.length > 0
		) {
			this.codeLensProviders.forEach(codeLensProvider => codeLensProvider.reset())
			return;
		}

		this._providerDisposable?.dispose();

		const codeLensProviders = container.resolveAll<FunctionRunnerCodeLensProvider>('FunctionRunnerCodeLensProvider')
		const codeLensProviderDisposables = codeLensProviders.map(codeLensProvider => 
			languages.registerCodeLensProvider(codeLensProvider.selector, codeLensProvider)
		);
		this._providerDisposable = Disposable.from(...codeLensProviderDisposables);
	}
}

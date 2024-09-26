import { ConfigurationService } from '@functionrunner/shared';
import { injectable } from 'tsyringe';

@injectable()
export class DebuggerSettings {
	constructor(private configurationService: ConfigurationService) {}

	get address(): string {
		return this.configurationService.get('debugger.address');
	}

	get port(): number {
		return this.configurationService.get('debugger.port');
	}
}

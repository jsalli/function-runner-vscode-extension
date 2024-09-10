import type { TelemetryEventProperties, TelemetryEventMeasurements } from '@vscode/extension-telemetry'

export abstract class TelemetryService {
  public abstract sendTelemetryEvent(
		eventName: string,
		properties?: TelemetryEventProperties,
		measurements?: TelemetryEventMeasurements,
	): void

  public abstract sendTelemetryErrorEvent(
		eventName: string,
		properties?: TelemetryEventProperties,
		measurements?: TelemetryEventMeasurements,
	): void

  public abstract sendTelemetryException(
		error: Error | undefined,
		logMessage: string | undefined,
		alternativeErrorMessage?: string | undefined,
		properties?: TelemetryEventProperties | undefined,
		measurements?: TelemetryEventMeasurements | undefined,
	) : void
}
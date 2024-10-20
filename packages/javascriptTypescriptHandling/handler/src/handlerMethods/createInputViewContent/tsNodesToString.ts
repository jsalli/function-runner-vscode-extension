import {
	createPrinter,
	createSourceFile,
	factory,
	ListFormat,
	ModuleKind,
	ModuleResolutionKind,
	NewLineKind,
	Node,
	ScriptTarget,
} from 'typescript';
import {
	createLanguageService,
	LanguageServiceHost,
	createDocumentRegistry,
	IndentStyle,
	getDefaultLibFilePath,
	ScriptSnapshot,
	CompilerOptions,
	MapLike,
} from 'typescript';

function prettyFormatCode(
	sourceText: string,
	compilerOptions: CompilerOptions,
) {
	const files: MapLike<{ version: number }> = {
		'codeToInvokeFuncAndConsoleLogIO.ts': { version: 0 },
	};

	const servicesHost: LanguageServiceHost = {
		getScriptFileNames: () => ['codeToInvokeFuncAndConsoleLogIO.ts'],
		getScriptVersion: (fileName) => files[fileName]?.version.toString(),
		getScriptSnapshot: () => {
			return ScriptSnapshot.fromString(sourceText);
		},
		getCurrentDirectory: () => process.cwd(),
		getCompilationSettings: () => compilerOptions,
		getDefaultLibFileName: (options) => getDefaultLibFilePath(options),
		fileExists() {
			return true;
		},
		readFile() {
			return sourceText;
		},
		readDirectory() {
			return [];
		},
		directoryExists() {
			return true;
		},
		getDirectories() {
			return [];
		},
	};

	const languageService = createLanguageService(
		servicesHost,
		createDocumentRegistry(),
	);
	const textChanges = languageService.getFormattingEditsForDocument(
		'codeToInvokeFuncAndConsoleLogIO.ts',
		{
			convertTabsToSpaces: true,
			insertSpaceAfterCommaDelimiter: true,
			insertSpaceAfterKeywordsInControlFlowStatements: true,
			insertSpaceBeforeAndAfterBinaryOperators: true,
			newLineCharacter: '\n',
			indentStyle: IndentStyle.Smart,
			indentSize: 2,
			tabSize: 2,
		},
	);

	const sortedTextChanges = textChanges.sort(
		(a, b) => b.span.start - a.span.start,
	);

	for (const textChange of sortedTextChanges) {
		const { span } = textChange;
		sourceText =
			sourceText.slice(0, span.start) +
			textChange.newText +
			sourceText.slice(span.start + span.length);
	}

	return sourceText;
}

export function tsNodesToString(nodeArray: Node[]): string {
	const emptyTsSourceFile = createSourceFile('', '', ScriptTarget.Latest);
	const printer = createPrinter({
		newLine: NewLineKind.LineFeed,
		neverAsciiEscape: true, // Keep Scandinavian characters as is, don't turn them into utf-8 codes
	});
	const tsCode = printer.printList(
		ListFormat.MultiLine,
		factory.createNodeArray(nodeArray),
		emptyTsSourceFile,
	);
	const compilerOptions: CompilerOptions = {
		module: ModuleKind.ESNext,
		moduleResolution: ModuleResolutionKind.NodeNext,
	};
	return prettyFormatCode(tsCode, compilerOptions);
}

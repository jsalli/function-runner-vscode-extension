export class Config {
	public projectRootAbsPath: string;
	public sourceFolderRelPath: string;
	public tempFolderRelPath: string;
	constructor({
		projectRootAbsPath,
		sourceFolderRelPath,
		tempFolderRelPath,
	}: {
		projectRootAbsPath: string;
		sourceFolderRelPath: string;
		tempFolderRelPath: string;
	}) {
		this.projectRootAbsPath = projectRootAbsPath;
		this.sourceFolderRelPath = sourceFolderRelPath;
		this.tempFolderRelPath = tempFolderRelPath;
	}
}

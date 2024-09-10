import { LanguageHandler } from "@functionrunner/shared";

export function getRightLanguageHandler(languageHandlers: LanguageHandler[], languageId: string): LanguageHandler {
  const languageHandler = languageHandlers.find(langHandler => langHandler.isInterestedInThisLanguage(languageId))
  if (!languageHandler) {
    throw new Error(
      `Unsupported languageId: "${languageId}" for opening run input view`,
    );
  }
  return languageHandler
}
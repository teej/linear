import inquirer from "inquirer";
import type { Importer } from "../../types.ts";
import type { CliArgs } from "../../utils/args.ts";
import { TrelloJsonImporter } from "./TrelloJsonImporter.ts";

const BASE_PATH = process.cwd();

export const trelloJsonImport = async (args: CliArgs = {}): Promise<Importer> => {
  const prefilled: Partial<TrelloImportAnswers> = {};
  if (args.file) {
    prefilled.trelloFilePath = args.file;
  }
  if (args.mapListsToStatuses !== undefined) {
    prefilled.mapListsToStatuses = args.mapListsToStatuses;
  }
  if (args.discardArchivedCards !== undefined) {
    prefilled.discardArchivedCards = args.discardArchivedCards;
  }
  if (args.discardArchivedLists !== undefined) {
    prefilled.discardArchivedLists = args.discardArchivedLists;
  }
  const answers = await inquirer.prompt<TrelloImportAnswers>(questions, prefilled);
  const trelloImporter = new TrelloJsonImporter(
    answers.trelloFilePath,
    answers.mapListsToStatuses,
    answers.discardArchivedCards,
    answers.discardArchivedLists
  );
  return trelloImporter;
};

interface TrelloImportAnswers {
  trelloFilePath: string;
  mapListsToStatuses: boolean;
  discardArchivedCards: boolean;
  discardArchivedLists: boolean;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: "filePath",
    name: "trelloFilePath",
    message: "Select your exported JSON file of Trello cards",
  },
  {
    type: "confirm",
    name: "mapListsToStatuses",
    message: "Would you like to map Trello lists to statuses?",
    default: true,
  },
  {
    type: "confirm",
    name: "discardArchivedCards",
    message: "Would you like to discard the archived cards?",
    default: true,
  },
  {
    type: "confirm",
    name: "discardArchivedLists",
    message: "Would you like to discard the (possibly unarchived) cards within archived lists?",
    default: true,
  },
];

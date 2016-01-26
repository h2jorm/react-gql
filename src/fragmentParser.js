import {parse} from 'graphql/language';

export function getFragment(fragment) {
  const documentAST = parse(fragment);
  return parseDefinition(documentAST.definitions[0]);
}

function parseDefinition(definition) {
  return parseSelectionSet(definition.selectionSet);
}

function parseSelectionSet(selectionSet) {
  if (selectionSet === null)
    return '';
  let result = [];
  selectionSet.selections.forEach(selection => {
    result.push(parseSelection(selection));
  });
  return result.join();
}

function parseSelection(selection) {
  if (selection.selectionSet === null)
    return selection.name.value;
  // do not soft wrap template string
  return `${selection.name.value}{${parseSelectionSet(selection.selectionSet)}}`;
}

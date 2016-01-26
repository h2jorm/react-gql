import {parse} from 'graphql/language';

export function getFragment(qlString, name) {
  if (!qlString)
    return '';
  const documentAST = parse(qlString);
  const collection = {};
  let defaultFragment;
  documentAST.definitions.forEach(definition => {
    if (definition.kind === 'FragmentDefinition') {
      defaultFragment = defaultFragment || definition.name.value;
      collection[definition.name.value] = {
        definition,
        qlString: ''
      };
    }
  });
  Object.keys(collection).forEach(name => {
    parseFragment(name, collection);
  });
  defaultFragment = collection[defaultFragment].qlString;
  if (!name)
    return defaultFragment;
  return collection[name] ? collection[name].qlString : '';
}

function parseFragment(name, collection) {
  const fragment = collection[name];
  // only occurs when executed in the processing of `parseSelection`
  if (!fragment)
    return '';
  const {qlString, definition} = fragment;
  if (qlString)
    return qlString;
  return fragment.qlString = parseDefinition(definition, collection);
}

function parseDefinition(definition, collection) {
  if (!definition)
    return '';
  return parseSelectionSet(definition.selectionSet, collection);
}

function parseSelectionSet(selectionSet, collection) {
  if (selectionSet === null)
    return '';
  let result = [];
  selectionSet.selections.forEach(selection => {
    result.push(parseSelection(selection, collection));
  });
  return result.join();
}

function parseSelection(selection, collection) {
  // case 1: `InlineFragment`
  if (selection.kind === 'InlineFragment')
    return parseSelectionSet(selection.selectionSet, collection);
  let {value} = selection.name;
  // case 2: `FragmentSpread`
  if (selection.kind === 'FragmentSpread') {
    return `${parseFragment(value, collection)}`;
  }
  // case 3: `SelectionSet` is null
  if (selection.selectionSet === null)
    return value;
  // case 4: `SelectionSet` is defined
  // do not soft wrap template string
  return `${value}{${parseSelectionSet(selection.selectionSet, collection)}}`;
}

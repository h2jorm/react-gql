const colorInfo = '#03A9F4';
const colorMeno = '#9E9E9E';

export default function ({query, variables, action, type = 'query'}) {
  console.group(`react-gql ${type.toUpperCase()}`);
  console.log(query);
  if (variables)
    console.log('%c variables', css(colorMeno), variables);
  console.groupEnd();
}

function css(color) {
  return `color: ${color}; font-weight: bold;`;
}

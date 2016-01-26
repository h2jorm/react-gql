import {getFragment} from '#/src/fragmentParser';

describe('fragmentParser', () => {

  const basicFragment = `
    fragment post on Post {
      id, contents, likes
    }
  `;
  const nestedFragment = `
    fragment post on Post {
      id,
      content,
      likes,
      editor {
        id, name
      }
    }
  `;
  const deepNestedFragment = `
    fragment post on Post {
      id,
      content,
      likes,
      editor {
        id, name
      },
      tag {
        id,
        category {
          id,
          name
        }
      }
    }
  `;

  it('should parse basicFragment', () => {
    const result = 'id,contents,likes';
    expect(getFragment(basicFragment)).toBe(result);
  });
  it('should parse nestedFragment', () => {
    const result = 'id,content,likes,editor{id,name}';
    expect(getFragment(nestedFragment)).toBe(result);
  });
  it('should parse deepNestedFragment', () => {
    const result = 'id,content,likes,editor{id,name},tag{id,category{id,name}}';
    expect(getFragment(deepNestedFragment)).toBe(result);
  });

});

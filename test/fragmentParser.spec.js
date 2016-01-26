import {getFragment} from '#/src/fragmentParser';

describe('fragmentParser', () => {
  describe('single fragment', () => {
    const basicFragment = `
      fragment post on Post {
        id, content, likes
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
      const result = 'id,content,likes';
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
  describe('multiple fragments', () => {
    const inlineFragment = `
      fragment post on Post {
        id,
        content,
        likes,
        editor {
          ... on Editor {
            id, name
          }
        }
      }
    `;
    const doubleFragments = `
      fragment post on Post {
        id,
        content,
        likes,
        editor {
          ...editor
        }
      }
      fragment editor on Editor {
        id, name
      }
    `;
    const tribleFragments = `
      fragment post on Post {
        id,
        content,
        likes,
        tag {
          ...tag
        }
      }
      fragment tag on Tag {
        id, category {
          ...category
        }
      }
      fragment category on Category {
        id, name
      }
    `;
    it('should parse inlineFragment', () => {
      const result = 'id,content,likes,editor{id,name}';
      expect(getFragment(inlineFragment)).toBe(result);
    });
    it('should parse doubleFragments', () => {
      const post = 'id,content,likes,editor{id,name}';
      const editor = 'id,name';
      expect(getFragment(doubleFragments)).toBe(post);
      expect(getFragment(doubleFragments, 'post')).toBe(post);
      expect(getFragment(doubleFragments, 'editor')).toBe(editor);
    });
    it('should parse tribleFragments', () => {
      const post = 'id,content,likes,tag{id,category{id,name}}';
      const tag = 'id,category{id,name}';
      const category = 'id,name';
      expect(getFragment(tribleFragments)).toBe(post);
      expect(getFragment(tribleFragments, 'post')).toBe(post);
      expect(getFragment(tribleFragments, 'tag')).toBe(tag);
      expect(getFragment(tribleFragments, 'category')).toBe(category);
    });
  });
  describe('error prone', () => {
    it('should return empty string if 1st argument is undefined or empty string', () => {
      const fragment = ``;
      expect(getFragment()).toBe('');
      expect(getFragment(fragment)).toBe('');
    });
    it('should return empty string if 2nd argument is not valid', () => {
      const fragment = `fragment user on User {id,name}`;
      expect(getFragment(fragment, 'post')).toBe('');
    });
    it('should return empty string if spreaded fragment is not found', () => {
      const fragment = `
        fragment post on Post {
          id,
          content,
          likes,
          editor {
            ...editor
          }
        }
      `;
      expect(getFragment(fragment)).toBe('id,content,likes,editor{}');
    });
  });
});

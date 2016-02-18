### Nested fragment
`Gql.Fragment` supports nested fragment declare.

```js
import Gql from 'react-gql';
import Post from './Post';// Post is a `ReactClass`

Post = Gql.Fragment(Post, {
  fragment: `
    fragment post on Post {
      id,
      content,
      likes,
      editor {
        ...Editor
      }
    }
    fragment editor on Editor {
      id, name
    }
  `
});

Post.getFragment(); // 'id,content,likes,editor{id,name}'
Post.getFragment('post'); // 'id,content,likes,editor{id,name}'
Post.getFragment('editor'); // 'id,name'
```

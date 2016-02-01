import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Gql from '../src';
import {
  renderIntoDocument,
  Simulate,
} from 'react-addons-test-utils';

import {store, actions} from './demo/store';
import {set} from '#/src';
import {
  prepare,
  resetStore,
} from './helper';

import {
  List,
  branchOpts,
} from './demo/components/List';


const getPosts = () => ([
  {id: '1', content: 'hello world', likes: 1},
  {id: '2', content: 'hello react', likes: 2},
  {id: '3', content: 'hello graphql', likes: 3}
]);

describe('Branch', () => {
  describe('Demo List component', () => {
    let conf, list, listNode;
    beforeAll(prepare);
    beforeEach(() => {
      conf = {
        fetchAndDispatch: function ({query, action, variables}) {
          if (query === branchOpts.init.query) {
            return store.dispatch(actions[action]({posts: getPosts()}));
          }
          if (query === branchOpts.mutations.likeAll.query) {
            return store.dispatch(actions[action](null));
          }
        }
      };
      spyOn(conf, 'fetchAndDispatch').and.callThrough();
      set({fetchAndDispatch: conf.fetchAndDispatch});
    });
    beforeEach(() => {
      resetStore();
      list = renderIntoDocument(
        <List />
      );
      listNode = ReactDOM.findDOMNode(list);
    });
    afterEach(() => {
      ReactDOM.unmountComponentAtNode(listNode.parentNode);
    });

    it('should launch an initial query after initial rendering', () => {
      expect(conf.fetchAndDispatch.calls.argsFor(0)[0].action).toBe('blogInit');
    });
    describe('children', () => {
      it('should have props `mutations`', () => {
        const mutations = List.latestChildren().props.mutations;
        expect(Object.keys(mutations)).toEqual(['likeAll']);
      });
      it('should be able to dispatch `likeAll` mutation', () => {
        clickLikeAllBtn();
        expect(conf.fetchAndDispatch.calls.argsFor(1)[0].action).toBe('blogLikeAll');
      });
    });
    it('should update props of children component automatically when store changes', () => {
      // initial query
      expect(List.latestChildren().props.posts).toEqual(getPosts());
      // mutation
      expect(pickLikeNums(List.latestChildren().props.posts)).toEqual([1, 2, 3]);
      clickLikeAllBtn();
      expect(pickLikeNums(List.latestChildren().props.posts)).toEqual([2, 3, 4]);
    });

    function pickLikeNums(posts) {
      const likes = [];
      posts.forEach(post => {
        likes.push(post.likes);
      });
      return likes;
    }
    function clickLikeAllBtn() {
      const btns = listNode.querySelectorAll('button');
      let likeAllBtn = _.find(btns, btn => {
        return btn.textContent === 'like all';
      });
      Simulate.click(likeAllBtn);
    }
  });
  describe('getProps', () => {
    let hello, helloNode;
    class Hello extends React.Component {
      render() {
        return (
          <div>
            hello, {this.props.role} {this.props.name}
          </div>
        );
      }
    }
    afterEach(() => {
      ReactDOM.unmountComponentAtNode(helloNode.parentNode);
    });
    it('should send desired props of Gql.Branch into its children', () => {
      const MyHello = Gql.Branch(Hello, {
        getProps: props => {
          const {name, role} = props;
          return {name, role};
        }
      });
      hello = renderIntoDocument(
        <MyHello name="jack" role="manager" />
      );
      helloNode = ReactDOM.findDOMNode(hello);
      expect(helloNode.textContent).toBe('hello, manager jack');
    });
    it('should ignore unecessary props of Gql.Branch', () => {
      const MyHello = Gql.Branch(Hello, {
        getProps: props => {
          const {name} = props;
          return {name};
        }
      });
      hello = renderIntoDocument(
        <MyHello name="jack" role="manager" />
      );
      helloNode = ReactDOM.findDOMNode(hello);
      expect(helloNode.textContent).toBe('hello,  jack');
    });
  });
});

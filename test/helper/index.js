import {store, actionCreators} from '../demo/store';
import {
  set,
} from '#/src';

export function prepare() {
  set({store});
  resetStore();
};

export function resetStore() {
  store.dispatch(actionCreators.blog.reset());
};

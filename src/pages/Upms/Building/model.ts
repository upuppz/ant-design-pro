import { Effect, Reducer } from 'umi';
import { TableListItem } from './data';
import { tree } from './service';

export interface ModelState {
  tree: TableListItem[];
}

export interface ModelType {
  namespace: string;
  state: ModelState;
  effects: {
    fetchTree: Effect;
  };
  reducers: {
    save: Reducer<ModelState>;
  };
}

const Model: ModelType = {
  namespace: 'upmsBuilding',
  state: {
    tree: [],
  },
  effects: {
    * fetchTree({ callback }, { call, put, select }) {
      const treeList = yield select((state: any) => state[Model.namespace].tree);
      if (treeList.length <= 0) {
        const response = yield call(tree);
        yield put({
          type: 'save',
          payload: { tree: response.data },
        });
        if (callback) {
          callback(response.data);
        }
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;

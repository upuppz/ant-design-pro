import { Effect, Reducer } from 'umi';
import { TableListItem } from './data';
import { list } from './service';

export interface ModelState {
  list: TableListItem[];
}

export interface ModelType {
  namespace: string;
  state: ModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<ModelState>;
  };
}

const Model: ModelType = {
  namespace: 'upmsPermission',
  state: {
    list: [],
  },
  effects: {
    * fetch({ callback }, { call, put, select }) {
      const listState = yield select((state: any) => state[Model.namespace].list);
      if (listState.length <= 0) {
        const response = yield call(list);
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

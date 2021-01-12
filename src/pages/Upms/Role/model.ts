import type { Effect, Reducer } from 'umi';
import type { TableListItem } from './data';
import { simpleList } from './service';

export type ModelState = {
  list: TableListItem[];
};

export type ModelType = {
  namespace: string;
  state: ModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<ModelState>;
  };
};

const Model: ModelType = {
  namespace: 'upmsRole',
  state: {
    list: [],
  },
  effects: {
    * fetch({ callback }, { call, put, select }) {
      const listState = yield select((state: any) => state[Model.namespace].list);
      if (listState.length <= 0) {
        const response = yield call(simpleList);
        yield put({
          type: 'save',
          payload: { list: response.data },
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

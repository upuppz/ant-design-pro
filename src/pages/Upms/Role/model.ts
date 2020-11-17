import { Effect, Reducer } from 'umi';
import { TableListItem } from './data';
import { simpleList } from './service';

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

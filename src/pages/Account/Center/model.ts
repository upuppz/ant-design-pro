import { Reducer, Effect } from 'umi';
import { LoginLog } from './data';
import { listLoginLog } from './service';

export interface ModalState {
  logs: LoginLog[];
  // 当前页
  logsCurrent: number;
  // 总页数
  logsPages: number;
  // 总数
  logsTotal: number;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    listLoginLog: Effect;
  };
  reducers: {
    saveLoginLog: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountCenter',
  state: {
    logs: [],
    logsCurrent: 0,
    logsPages: 1,
    logsTotal: 0,
  },
  effects: {
    *listLoginLog(_, { call, put, select }) {
      const current = yield select((state: any) => state[Model.namespace].logsCurrent);
      const response = yield call(listLoginLog, { current: current + 1 });
      yield put({
        type: 'saveLoginLog',
        payload: {
          logs: response.data || [],
          logsCurrent: response.current,
          logsPages: response.pages,
          logsTotal: response.total,
        },
      });
    },
  },
  reducers: {
    saveLoginLog(state, action) {
      return {
        ...(state as ModalState),
        ...action.payload,
        logs: state?.logs.concat(action.payload.logs),
      };
    },
  },
};

export default Model;

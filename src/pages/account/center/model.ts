import { Reducer, Effect } from 'umi';
import { LoginLog, UserCenterVO } from './data.d';
import { listLoginLog,getUserInfo } from './service';

export interface ModalState {
  userInfo: Partial<UserCenterVO>;
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
    getUserInfo: Effect;
  };
  reducers: {
    saveLoginLog: Reducer<ModalState>;
    saveUserInfo: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'userCenter',
  state: {
    userInfo: {},
    logs: [],
    logsCurrent: 0,
    logsPages: 1,
    logsTotal: 0,
  },

  effects: {
    * listLoginLog(_, { call, put, select }) {
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
    * getUserInfo(_, { call, put }) {
      const response = yield call(getUserInfo);
      yield put({
        type: 'saveUserInfo',
        payload: response,
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
    saveUserInfo(state, action) {
      return {
        ...(state as ModalState),
        userInfo: action.payload,
      };
    },
  },
};

export default Model;

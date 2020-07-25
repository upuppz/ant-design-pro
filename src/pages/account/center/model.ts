import { Reducer, Effect } from 'umi';
import DEFAULT_AVATAR from '@/assets/default_avatar.png';
import { EnterpriseInfo, ListItemDataType } from './data.d';
import { enterpriseInfo, listLoginLog } from './service';

export interface EnterpriseModalState {
  info: Partial<EnterpriseInfo>;
  logs: ListItemDataType[];
  // 当前页
  logsCurrent: number;
  // 总页数
  logsPages: number;
  // 总数
  logsTotal: number;
}

export interface EnterpriseModelType {
  namespace: string;
  state: EnterpriseModalState;
  effects: {
    info: Effect;
    loginLog: Effect;
  };
  reducers: {
    saveEnterpriseInfo: Reducer<EnterpriseModalState>;
    saveLoginLog: Reducer<EnterpriseModalState>;
  };
}

const Model: EnterpriseModelType = {
  namespace: 'enterprise',

  state: {
    info: {},
    logs: [],
    logsCurrent: 0,
    logsPages: 1,
    logsTotal: 0,
  },

  effects: {
    *info(_, { call, put }) {
      const response = yield call(enterpriseInfo);
      yield put({
        type: 'saveEnterpriseInfo',
        payload: response,
      });
    },
    *loginLog(_, { call, put, select }) {
      const current = yield select((state: any) => state[Model.namespace].logsCurrent);
      const response = yield call(listLoginLog, { current: current + 1 });
      yield put({
        type: 'saveLoginLog',
        payload: Array.isArray(response.data) ? response.data : [],
        current: response.current,
        pages: response.pages,
        total: response.total,
      });
    },
  },

  reducers: {
    saveEnterpriseInfo(state, action) {
      const payload = action.payload.data;
      if (payload && !payload?.avatar) {
        payload.avatar = DEFAULT_AVATAR;
      }
      return {
        ...(state as EnterpriseModalState),
        info: payload || {},
      };
    },
    // @ts-ignore
    saveLoginLog(state, action) {
      return {
        ...(state as EnterpriseModalState),
        logs: state?.logs.concat(action.payload),
        logsCurrent: action.current,
        logsPages: action.pages,
        logsTotal: action.total,
      };
    },
  },
};

export default Model;

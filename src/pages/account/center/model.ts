import { Reducer, Effect } from 'umi';
import { ListItemDataType } from './data.d';
import { listLoginLog } from './service';

export interface CenterModalState {
  // info: Partial<EnterpriseInfo>;
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
  state: CenterModalState;
  effects: {
    loginLog: Effect;
    // changeAvatar: Effect;
  };
  reducers: {
    saveEnterpriseInfo: Reducer<CenterModalState>;
    saveLoginLog: Reducer<CenterModalState>;
    saveAvatar: Reducer<CenterModalState>;
  };
}

const Model: EnterpriseModelType = {
  namespace: 'center',
  state: {
    logs: [],
    logsCurrent: 0,
    logsPages: 1,
    logsTotal: 0,
  },

  effects: {
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
    /* *changeAvatar(_, { put }) {
       console.log('changeAvatar');
       console.log(_);
       const spreadElements = _;
       console.log(spreadElements);
       yield put({
         type: 'saveAvatar',
         avatar: _.avatar,
       });
     }, */
  },

  reducers: {
    // @ts-ignore
    saveLoginLog(state, action) {
      return {
        ...(state as CenterModalState),
        logs: state?.logs.concat(action.payload),
        logsCurrent: action.current,
        logsPages: action.pages,
        logsTotal: action.total,
      };
    },
    /* saveAvatar(state, action) {
      console.log('changeAvatar');
      console.log(state);
      console.log(action);
      return {
        ...(state as EnterpriseModalState),
        info: { ...state?.info, avatar: action.avatar },
      };
    }, */
  },
};

export default Model;

import { Reducer, Effect } from 'umi';
import { LoginLog, UserCenterVO } from './data.d';
import { listLoginLog } from './service';

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
    // changeAvatar: Effect;
  };
  reducers: {
    saveLoginLog: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'userCenter',
  state: {
    userInfo: {
      deptName: '管委会',
      buildings: '孵化一期,孵化二期,A栋',
      roles: ['管理员', '用户', '警卫'],
    },
    logs: [],
    logsCurrent: 0,
    logsPages: 1,
    logsTotal: 0,
  },

  effects: {
    * listLoginLog(_, { call, put, select }) {
      const current = yield select((state: any) => state[Model.namespace].logsCurrent);
      const response = yield call(listLoginLog, { current: current + 1 });
      console.log(response)
      yield put({
        type: 'saveLoginLog',
        payload: {
          logs: response.data || [],
          logsCurrent: response.current,
          logsPages: response.pages,
          logsTotal: response.total,
        }
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
    saveLoginLog(state, action) {
      return {
        ...(state as ModalState),
        ...action.payload,
        logs: state?.logs.concat(action.payload.logs)
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

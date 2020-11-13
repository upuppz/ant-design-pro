import { Reducer, Effect } from 'umi';
import { UploadFile } from 'antd/lib/upload/interface';
import { LoginLog } from './data';
import { listFace, listLoginLog } from './service';

export interface ModalState {
  logs: LoginLog[];
  // 当前页
  logsCurrent: number;
  // 总页数
  logsPages: number;
  // 总数
  logsTotal: number;
  // 人脸
  faces: UploadFile[];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    listLoginLog: Effect;
    listFace: Effect;
    updateListFace: Effect;
  };
  reducers: {
    saveLoginLog: Reducer<ModalState>;
    saveListFace: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountCenter',
  state: {
    logs: [],
    logsCurrent: 0,
    logsPages: 1,
    logsTotal: 0,
    faces: [],
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
    * listFace(_, { call, put }) {
      const response = yield call(listFace);
      let payload = response.data || [];
      payload = payload.map((val: UploadFile) => {
        return { ...val, thumbUrl: `data:image/jpeg;base64,${val.thumbUrl}` };
      });
      yield put({
        type: 'saveListFace',
        payload,
      });
    },
    * updateListFace({ payload }, { put }) {
      yield put({
        type: 'saveListFace',
        payload,
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
    saveListFace(state, action) {
      return {
        ...(state as ModalState),
        faces: action.payload,
      };
    },
  },
};

export default Model;

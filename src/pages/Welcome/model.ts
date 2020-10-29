import { Effect, Reducer } from 'umi';
import { AnalysisPersonalVO } from './data.d';
import { queryAnalysis } from './service';

export interface ModalState {
  amount: number;
  consumptionTrend: AnalysisPersonalVO[];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    init: Effect;
    fetchAnalysis: Effect;
  };
}

const Model: ModelType = {
  namespace: 'welcome',
  state: {
    amount: 0,
    consumptionTrend: [],
  },
  effects: {
    *init(_, { put }) {
      yield put({ type: 'fetchAnalysis' });
    },
    *fetchAnalysis(_, { call, put }) {
      const response = yield call(queryAnalysis);
      yield put({
        type: 'save',
        payload: {
          ...response.data
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        amount: 0,
        consumptionTrend: [],
        activities: [],
      };
    },
  },
};

export default Model;

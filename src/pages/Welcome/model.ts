import { Effect, Reducer } from 'umi';

import { AnalysisData } from './data';
import { analysis, trendData } from './service';

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    fetchTrendData: Effect;
  };
  reducers: {
    save: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
}

const initState = {
  analysisData: {
    totalMembership: 0,
    todayMembership: 0,
    weeklyOnWeekly: 0,
    dayOnDay: 0,
    totalSales: 0,
    todaySales: 0,
    salesData: [],
    totalMeals: 0,
    todayMeals: 0,
    mealsData: [],
    todayRechargeAmount: 0,
    totalRechargeAmount: 0,
    rechargeAmountData: [],
  },
  // 销售趋势数据
  salesData: [],
  // 用餐趋势数据
  membershipData: [],
};

const Model: ModelType = {
  namespace: 'dashboardAndAnalysis',
  state: initState,

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(analysis);
      if (response.code === '00000') {
        yield put({
          type: 'save',
          payload: { analysisData: response.data },
        });
      }
    },
    *fetchTrendData(_, { call, put }) {
      const response = yield call(trendData, _.payload);
      if (response.code === '00000') {
        if (_.payload.tableKey === 'membership') {
          yield put({
            type: 'save',
            payload: { membershipData: response.data },
          });
        } else if (_.payload.tableKey === 'sales') {
          yield put({
            type: 'save',
            payload: { salesData: response.data },
          });
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
    clear() {
      return initState;
    },
  },
};

export default Model;

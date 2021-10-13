import { createStore } from 'vuex';

export default createStore({
  state: {
    loading: false,
    user: {},
  },
  mutations: {
  },
  actions: {
    setUser(state, user) {
      state.user = user;
    },
    flushUser(state) {
      state.user = {};
    }
  },
  modules: {
  },
});

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

import users from './modules/users'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    users
  }
})

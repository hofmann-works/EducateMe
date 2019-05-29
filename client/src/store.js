import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user : {}
  },
  mutations: {
    auth_request(state){
        state.status = 'loading'
      },
      auth_success(state, token, user){
        state.status = 'success'
        state.token = token
        state.user = user
      },
      auth_error(state){
        state.status = 'error'
      },
      logout(state){
        state.status = ''
        state.token = ''
      },
  },
  actions: {
    login({commit}, user){
        
        /*let uri = 'http://localhost:4000/users/authenticate';
        console.log(user);
        this.axios.post(uri, this.user).then((response) => {
            console.log(response)
            localStorage.setItem('username', response.data.username)
            localStorage.setItem('user-token',response.data.token)
        }).catch(err => console.log(err));*/

        return new Promise((resolve, reject) => {
          commit('auth_request')
          axios({url: 'http://localhost:4000/users/authenticate', data: user, method: 'POST' })
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token, user)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
        })
    },
    logout({commit}){
        return new Promise((resolve, reject) => {
          commit('logout')
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          resolve()
        })
      }
  },
  getters : {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
  }
})
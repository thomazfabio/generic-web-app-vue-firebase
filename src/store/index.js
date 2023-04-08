import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseApp } from '../plugins/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    isSpinnerVisible: true,
    uploadImageStatus: null
  },
  getters: {
    currentUser(state) {
      return state.currentUser
    },
    isSpinnerVisible(state) {
      return state.isSpinnerVisible
    },
    uploadImageStatus(state) {
      return state.uploadImageStatus
    }
  },
  mutations: {
    currentUser(state, payload) {
      state.currentUser = payload
    },
    isSpinnerVisible(state, payload) {
      state.isSpinnerVisible = payload
    },
    uploadImageStatus(state, payload) {
      state.uploadImageStatus = payload
    }
  },
  actions: {
    setStatusUploadImage(context, payload){
      context.commit("uploadImageStatus", payload)
    },
    currentUser(context, payload) {
      context.commit("currentUser", payload)
    },
    isSpinnerVisible(context, payload) {
      context.commit("isSpinnerVisible", payload)
    },
    upImgFirebase(context, payload) {
      var storageRef = firebaseApp.storage().ref()
      var mountainsRef = storageRef.child(payload.RefImg + "/" + payload.nameImg);
      // 'file' comes from the Blob or File API
      mountainsRef.put(payload.img).on(
        "STATE_CHANGED",
        (snapshot) => {
          context.commit("uploadImageStatus", "uploading")
          //algo em tempo real sobre o upload
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progresso do upload: ${progress}%`);
        }, (error) => {
          context.commit("uploadImageStatus", "error")
          console.log(error) // se ocorrer algum erro
        }, () => {
          // quando estiver feito o upload com sucesso
          context.commit("uploadImageStatus", "success")
        });
    },
  },
  modules: {
  }
})

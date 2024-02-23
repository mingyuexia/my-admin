import { defineStore } from 'pinia'

const useUserStore = defineStore('user',{
  state: () => ({
    userInfo:null,
    sid:0,
    token:'',
  }),
  actions: {
    saveUser({baseUserInfo='',sid,token=''}){
      if(baseUserInfo){
        this.userInfo = baseUserInfo
      }
      if(token){
        this.token = token
      }
      this.sid = sid
      console.log('saveUser')
    },
    updateUserInfo(userInfo){
      this.userInfo = userInfo
    },
    deleteUser(){
      this.userInfo = null
      this.sid = 0
      this.token=''
    },

  //更新用户信息
  async successLink(res={}){
    // const userRes = await getCurrentInfo()
    // useUserStore().saveUser(res.data)
    const info = {
      ...userRes.data,
      avatar: {
        id: userRes.data.avatorId,
        url: userRes.data.avatorName,
      }
    }
    console.log(info, 'info---')
    useUserStore().updateUserInfo(info)
  }
  },
 // persist: true, // 设置持久化
  // 单独设置存储位置
  persist: {
    storage: window.localStorage,
  },
})

export default useUserStore
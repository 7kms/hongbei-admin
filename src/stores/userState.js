import { observable, action } from "mobx";
import { $get } from '~util/index';

class UserState {
  @observable authenticated;
  @observable info;
  @observable hasChecked;

  constructor() {
    this.authortoken = '';
    this.authenticated = false;
    this.info = {}
  }

  @action async login(params){
    try {
      let res =  await $get('/admin/login',params)
      console.log(res);
      this.setData(res.data.user)
     }catch(err){
       console.log(err)
     }
     return this.info;
  }

  @action async getInfo(){
    try {
     let user =  await $get('/admin/profile')
     console.log(user);
     this.setData(user.data)
    }catch(err){
      console.log(err)
    }
    return this.info;
  }

  @action async author(){
    if(!this.authenticated){
      await this.getInfo();
    }
    this.hasChecked = true;
    return await this.info;
  }

  @action setData(data) {
    this.authenticated = true;
    this.info = data;
  }
}

export default new UserState()

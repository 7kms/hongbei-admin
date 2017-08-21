import { observable, action } from "mobx";
import { $get } from '~util/index';

class GoodState {
  @observable info;
  
  constructor(props = {}) {
    this.info = props;
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

  @action setData(data) {
    this.authenticated = true;
    this.info = data;
  }
}

export default new GoodState()

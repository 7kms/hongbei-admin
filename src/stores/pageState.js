import { observable, action } from "mobx";
class PageState {
  @observable title = '管理工作台';
//   @observable info;
  constructor() {
    // this.info = {}
  }
  @action changeTitle(title){
      this.title = title;
  }
}
export default new PageState()

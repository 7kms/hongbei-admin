/**
 * Created by float.. on 2017/5/22.
 */
import { dataList } from '../mock/data';

export const $get = (url, params) => {
  return new Promise((resolve, reject)=>{
    resolve({ result: dataList });
  })
};
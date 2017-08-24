/**
 * Created by float.. on 2017/5/22.
 */
import moment from 'moment';

export {$get,$post,$put,$delete} from './api';

let appRouter = null;
export const setAppRouter = (router)=>{
    appRouter = router;
}
export const getAppRouter = ()=>{
    return appRouter;
}

export const dateFormat = (dateStr, format='YYYY-MM-DD HH:mm:ss')=>{
    return moment(dateStr).format(format)
}
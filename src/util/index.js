/**
 * Created by float.. on 2017/5/22.
 */
export {$get,$post,$put,$delete} from './api';

let appRouter = null;
export const setAppRouter = (router)=>{
    appRouter = router;
}
export const getAppRouter = ()=>{
    return appRouter;
}
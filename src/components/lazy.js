import Bundle from './bundle.js';
import { Route } from 'react-router-dom';

class LazyRoute extends Route {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <Bundle loading={()=>{}}></Bundle>
        );
    }
}


export default LazyRoute;
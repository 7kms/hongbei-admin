import React from 'react';
import {inject, observer} from 'mobx-react';


@inject('store')
@observer
class GoodsAdd extends React.PureComponent{
    render(){
        console.log('render-------goods-add')
        return(
            <div>
                goods add
            </div>
        )
    }
}
export default GoodsAdd
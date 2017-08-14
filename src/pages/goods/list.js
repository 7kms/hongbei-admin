import React from 'react';
import {inject, observer} from 'mobx-react';


@inject('store')
@observer
class GoodsList extends React.PureComponent{
    render(){
        console.log('render-------goods-list')
        return(
            <div>
                goods list
            </div>
        )
    }
}

export default GoodsList
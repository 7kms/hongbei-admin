import React from 'react';
import Bundle from '../components/bundle.js';

let LazyComponent = (component)=>{
  let lazy = (props)=> (
    <Bundle load={component}>
        {(Ele) => <Ele {...props}/>}
    </Bundle>
  )
  lazy.displayName = 'LazyLoad';
  return lazy;
}
export default LazyComponent;
import { Component } from 'react';
import PropTypes from 'prop-types';

class Bundle extends Component {
    static propTypes = {
        load: PropTypes.func.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.element
        ])
    }

    constructor(props){
        super(props);
        this.state = {
            mod: null
        }
    }
    
    compnentWillMount(){
        this.load(this.props);
    }

    componentWillReciveProps(nextProps){
        if(nextProps.load !== this.props.load){
            this.load(this.props);
        }
    }

    load(props){
        this.setState({
            mod: null
        })
        props.load((mod)=>{
            this.setState({
                // handle both es imports and cjs
                mod: mod.default ? mod.default : mod
            })
        })
    }

    render() {
        return this.state.mod ? this.props.children(this.state.mod) : null
    }
}

export default Bundle;
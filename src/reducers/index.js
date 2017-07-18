
import * as ActionTypes from '../actions'
import { combineReducers } from 'redux';


// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.USER_SUCCESS) {
    return null
  } else if (error) {
    return error
  }

  return state
}


export default combineReducers({errorMessage});
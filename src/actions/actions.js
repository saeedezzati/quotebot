import * as actionType from "../actionTypes/actionTypes"
export const setAppState = data => ({
	type: actionType.SET_APP_STATE,
	data
})
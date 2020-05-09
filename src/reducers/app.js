import * as actionType from "../actionTypes/actionTypes"
const app = (state = {
    ip: "",
    lat: "",
    lon: "",
    city: "",
    isFetchingLocation: false,
    allQuotes: [],
    isFetchingQuotes: false
}, action) => {
    switch (action.type) {
        case actionType.SET_APP_STATE:
            return {
                ...state,
                ...action.data
            }
        default:
            return state;
    }
}
export default app;
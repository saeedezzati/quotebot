import axios from "axios";
import { setAppState } from "./actions/actions"

export const getIP = dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		},
	}
	dispatch(setAppState({
		isFetchingLocation: true,
	}))
	return axios
		.get('http://ip-api.com/json', config)
		.then(response => {
			// handle success
			dispatch(setAppState({
				isFetchingLocation: false,
				ip: response.data.query,
				lat: response.data.lat,
				lon: response.data.lon,
				city: response.data.city,
			}))
		})
		.catch(error => {
			// handle error
			dispatch(setAppState({
				isFetchingLocation: false,
			}))
		})

}


export const getAllQuotes = (page, dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		},
	}
	dispatch(setAppState({
		isFetchingQuotes: true,
	}))
	return axios
		.get(`https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand&per_page=10&page=${page}`, config)
		.then(response => {
			// handle success
			dispatch(setAppState({
				isFetchingQuotes: false,
				allQuotes: response.data
			}))
		})
		.catch(error => {
			// handle error
			dispatch(setAppState({
				isFetchingQuotes: false,
			}))
		})
 }

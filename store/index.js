import { EventBus } from '../plugins/v-event-bus.js';
const Cosmic = require('cosmicjs');
const api = Cosmic();
const bucket = api.bucket({
  slug: 'sarmaniata-production',
  read_key: 'PZSFvEaXhYIidLNTHeOpqPaNiVU85UQg77TUsFbNwlM28Az94K'
});

export const state = () => ({
	objData: null,
	homepageObjData: null,
	logo: null,
	whiteLogo: null,
	response: null,
	events: null,
	registration: null,
	footerData: null
})

export const mutations = {
	storeData(state, payload) {
		state.objData = payload;
	},
	storeHomepageData(state, payload) {
		state.homepageObjData = payload;
	},
	storeLogo(state, payload) {
		state.logo = payload;
	},
	storeWhiteLogo(state, payload) {
		state.whiteLogo = payload;
	},
	saveResponse(state, payload) {
		state.response = payload;
	},
	storeEventsData(state, payload) {
		state.events = payload;
	},
	saveRegistration(state, payload) {
		state.registration = payload;
	},
	storeFooterData(state, payload) {
		state.footerData = payload;
	},
	resetResponse(state) {
		state.response = null;
	},
	resetRegistration(state) {
		state.registration = null;
	}
};
	
export const actions = {
	fetchContent({commit}, payload) {
		bucket.getObject({
			id: payload.id,
			props: payload.props
		}).then(response => commit('storeData', response.object));
	},
	fetchEvents({commit}, payload) {
		bucket.getObject({
			id: payload.id,
			props: payload.props
		}).then(response => commit('storeEventsData', response.object));
	},
	fetchHomepage({commit}, payload) {
		bucket.getObject({
			id: payload.id,
			props: payload.props
		}).then(response => {
			commit('storeHomepageData', response.object)
		});
	},
	fetchLogo({commit}) {
		bucket.getSingleMedia({
			id: '624d6a92354d6f0e475d4d3f',
			props: 'url,original_name'
		}).then(response => commit('storeLogo', response.media));
	},
	fetchWhiteLogo({commit}) {
		bucket.getSingleMedia({
			id: '624d6bc9354d6f0e475d4d41',
			props: 'url,original_name'
		}).then(response => commit('storeWhiteLogo', response.media));
	},
	fetchFooterContent({commit}, payload) {
		bucket.getObjects({
			query: {
				type: 'contact',
				slug: 'contact'
			},
			props: payload.props
		}).then(response => commit('storeFooterData', response.objects[0]));
	},
	sendEmail({commit}, payload) {
		const data = new FormData();
		data.append('name', payload.name);
		data.append('email', payload.email);
		data.append('subject', payload.subject);
		data.append('message', payload.message);
		this.$axios.post('/process.php', data).then(res => res.data, err => console.log(err.message))
		.then(res => {
			commit('saveResponse', res);
			if(res.status === 'success') (window.$nuxt || EventBus || this.$EventBus).$emit('resetForm');
		})
		.catch(err => console.log(err.message));
	},
	register({commit}, payload) {
		const data = new FormData();
		data.append('name', payload.name);
		data.append('phone', payload.phone);
		data.append('members', payload.members);
		this.$axios.post('/registration.php', data).then(res => res.data, err => console.log(err.message))
		.then(res => {
			commit('saveRegistration', res);
			if(res.status === 'success') (window.$nuxt || EventBus || window.$EventBus).$emit('resetRegistrationForm');
		})
		.catch(err => console.log(err.message));
	}
};

export const getters = {
	objData(state) {
		return state.objData;
	},
	logo(state) {
		return state.logo;
	},
	whiteLogo(state) {
		return state.whiteLogo;
	},
	homepageObjData(state) {
		return state.homepageObjData;
	},
	response(state) {
		return state.response;
	},
	events(state) {
		return state.events;
	},
	registration(state) {
		return state.registration;
	},
	footerData(state) {
		return state.footerData;
	}
};
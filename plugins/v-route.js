export default ({ app, store }) => {
   app.router.afterEach(() => {
		if(store.getters.response) store.commit('resetResponse');
		if(store.getters.registration) store.commit('resetRegistration');
   })
}
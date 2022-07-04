import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import GmapCluster from 'vue2-google-maps/dist/components/cluster';


Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyCBmUXYXi_Zufpz1rKucKIT1dsU9yIdx_Y',
	}
});
Vue.component('GmapCluster', GmapCluster);
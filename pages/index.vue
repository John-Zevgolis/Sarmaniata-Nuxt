<template>
	<div>
		<transition name="fade">
			<loader v-show="loading"></loader>
		</transition>
		<div v-if="objData && logo && whiteLogo">
			<the-header ref="header" :obj-data="objData" :logo="logo"></the-header>
			<home-wrapper :header-height="headerHeight" :logo="whiteLogo" :obj-data="objData"></home-wrapper>
		</div>
		<ShareNetwork
			class="share-btns position-fixed"
			network="facebook"
			url="https://sarmaniata.gr">
			<span class="share-facebook d-flex justify-content-center align-items-center">
				<font-awesome-icon icon="fa-brands fa-facebook-f" />
			</span>
		</ShareNetwork>
	</div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';
import HomeWrapper from '../components/HomeWrapper.vue';
import Loader from '../components/Loader.vue';
import { EventBus } from '../plugins/v-event-bus.js';

export default {
	components: {
		Loader,
		TheHeader,
		HomeWrapper
	},
	data() {
		return {
			loading: false,
			headerHeight: null
		};
	},
	head: {
		meta: [
			{
				property: 'og:url',
			},
			{
				property: 'og:title', 
				content: 'Sarmaniata'
			},
			{
				property: 'og:description', 
				content: 'Ομάδα για τη φύση και τον πολιτισμό της Σαμαρίνας'
			},
			{	
				property: 'og:image', 
				content: 'https://sarmaniata.gr/sarmaniata.jpg'
			},
			{
				property: 'og:image:alt', 
				content: 'Ομάδα για τη φύση και τον πολιτισμό της Σαμαρίνας'
			},
			{
				property: 'og:image:secure_url',
				content: 'https://sarmaniata.gr/sarmaniata.jpg'
			},
			{
				property: 'og:image:type', 
				content: 'image/jpg'
			},
			{
				property: 'twitter:card', 
				content: 'summary_large_image'
			},
			{
				property: 'twitter:title', 
				content: 'Sarmaniata'
			},
			{
				property: 'twitter:description', 
				content: 'Ομάδα για τη φύση και τον πολιτισμό της Σαμαρίνας'
			},
			{
				property: 'twitter:url'
			},
			{
				property: 'twitter:image',
				content: 'https://sarmaniata.gr/sarmaniata.jpg'
			}
		]
	},
	methods: {
		fetchLogo() {
			this.$store.dispatch('fetchLogo');
		},
		fetchWhiteLogo() {
			this.$store.dispatch('fetchWhiteLogo');
		},
		fetchData() {
			this.$store.dispatch('fetchHomepage', {
				id: '622e0cef23ee59000927c017',
				props: 'metadata'
			});
		}
    },
	async created() {
		this.loading = true;
		await this.fetchLogo();
		await this.fetchWhiteLogo();
		await this.fetchData();
		(this.$nuxt || EventBus || this.$EventBus).$on('header-height', value => this.headerHeight = value);
		this.loading = false;
	},
	computed: {
		logo() {
			return this.$store.getters['logo'];
		},
		whiteLogo() {
			return this.$store.getters['whiteLogo'];
		},
		objData() {
			return this.$store.getters['homepageObjData'];
		}
	}
};
</script>

<template>
	<div>
		<home-carousel :header-height="headerHeight" ref="home" :obj-data="objData"></home-carousel>
		<sarmaniata ref="sarmaniata" :obj-data="objData"></sarmaniata>
		<samarina :header-height="headerHeight" ref="samarina" :obj-data="objData"></samarina>
		<events ref="events" :obj-data="objData"></events>
		<photos ref="photos" :obj-data="objData"></photos>	
		<the-footer ref="contact" :obj-data="objData" :logo="logo"></the-footer>
	</div>
</template>

<script>
import HomeCarousel from '../components/HomeCarousel.vue';
import Sarmaniata from '../components/Sarmaniata.vue';
import Samarina from '../components/Samarina.vue';
import Events from '../components/Events.vue';
import Photos from '../components/Photos.vue';
import TheFooter from '../components/TheFooter.vue';
import { EventBus } from '../plugins/v-event-bus.js';

export default {
	props: ['obj-data', 'logo', 'header-height'],
	components: {
		HomeCarousel,
		Sarmaniata,
		Samarina,
		Events,
		Photos,
		TheFooter
	},
	methods: {
		animations() {
			const gsap = this.$gsap;
			const elements = gsap.utils.toArray(".animated");
			const interval = setInterval(() => {
				if(elements && elements.length) {
					elements.forEach((item) => {
						gsap.to(item, {
							scrollTrigger: {
								start: "top 80%",
								trigger: item,
								onEnter: () => item.classList.add('fire')
							}
						});
					});
					clearInterval(interval);
				}
			}, 50);
		},
		scrollSpy() {
			const gsap = this.$gsap;
			const sections = this.$refs;
			const header = this.$parent.$refs.header;
			const interval = setInterval(() => {
				if(sections && Object.keys(sections).length && header) {
					for(const prop in sections) {
						gsap.to(this.$refs[prop].$el, {
							scrollTrigger: {
								start: `top ${this.headerHeight + 5}px`,
								end: `bottom ${this.headerHeight + 5}px`,
								trigger: this.$refs[prop].$el,
								onEnter: () => {
									header.$el.querySelector(`.menu-link[href="#${prop}"]`).classList.add('active');
								},
								onLeave: () => {
									header.$el.querySelector(`.menu-link[href="#${prop}"]`).classList.remove('active');
								},
								onEnterBack: () => {
									header.$el.querySelector(`.menu-link[href="#${prop}"]`).classList.add('active');
								},
								onLeaveBack: () => {
									header.$el.querySelector(`.menu-link[href="#${prop}"]`).classList.remove('active');
								}
							}
						});
					}
					clearInterval(interval);
				}
			}, 50);
		}
	},
	mounted() {
		this.animations();
	},
	created() {
		(this.$nuxt || EventBus || this.$EventBus).$on('layout-complete', () => {
			this.scrollSpy();
		});
	}
}
</script>
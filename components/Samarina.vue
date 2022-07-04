<template>
	<section id="samarina" class="section samarina">
		<div class="parallax position-relative">
			<div class="parallax-img position-absolute w-100 h-100 bg-img" v-lazy:background-image="samarina.thumbnail"></div>
			<div class="container-fluid px-0 position-relative">
				<div class="row gx-0">
					<div class="col-xl-6 offset-xl-6">
						<div class="parallax-content">
							<h3 v-if="samarina.title" class="from-bottom animated section-title underline">{{samarina.title}}</h3>
							<div v-if="samarina.content" v-html="samarina.content"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="map position-relative bg-white" :class="{active: showFilters}">
			<transition name="infobox-animation">
				<div class="infobox d-flex position-absolute px-0" :class="{loading: infoLoading}" v-if="showInfoBox">
					<button aria-label="CloseFilters" @click="closeInfobox" class="close-btn border-0 position-absolute d-flex justify-content-center align-items-center bg-white">
						<span>&#10006;</span>
					</button>
					<div class="project-box w-100 d-flex flex-column">
						<div v-if="infoboxContent.img" class="bg-img field" v-lazy:background-image="infoboxContent.img"></div>
						<div class="box-content d-flex align-items-start flex-column bg-white p-4 flex-grow-1">
							<h5 class="title field mb-2" v-if="infoboxContent.title">
								<span>{{infoboxContent.title}}</span>
							</h5>
							<p v-if="infoboxContent.text" class="field mb-0">{{infoboxContent.text}}</p>
							<div class="mt-auto">
								<a v-if="infoboxContent.lat && infoboxContent.lon" class="btn custom-btn shadow-none rouded-0 px-3 py-2 mt-4" target="_blank" :href="`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${infoboxContent.lat}%2C${infoboxContent.lon}`">Οδηγίες</a>
							</div>
						</div>
					</div>
				</div>
			</transition>
			<button aria-label="OpenFilters" class="filters-btn position-absolute" @click="showFilters = true">
                <div class="filter-wrapper w-100 h-100 d-flex justify-content-center align-items-center position-absolute">
                    <div class="filter">
                        <div class="filter-line d-flex justify-content-center align-items-center">
                            <div class="filter-line-inner-long"></div>
                            <div class="filter-line-inner-thick"></div>
                            <div class="filter-line-inner-short"></div>
                        </div>
                        <div class="filter-line d-flex justify-content-center align-items-center">
                            <div class="filter-line-inner-short"></div>
                            <div class="filter-line-inner-thick"></div>
                            <div class="filter-line-inner-long"></div>
                        </div>
                        <div class="filter-line d-flex justify-content-center align-items-center">
                            <div class="filter-line-inner-long"></div>
                            <div class="filter-line-inner-thick"></div>
                            <div class="filter-line-inner-short"></div>
                        </div>
                    </div>
                </div>
            </button>
			<GmapMap :center="{lat: 10, lng: 10}" :options="options" id="map" ref="Map">
				<GmapCluster :zoomOnClick="true" :styles="clusterStyles">
					<GmapMarkerWithLabel
						v-for="marker in samarina.metadata.locations" 
						:key="marker.id" 
						:position="{'lat':marker.lat, 'lng': marker.lon}"
						:icon="{url: getMarkers(marker)}"
						:clickable="true"
						:label-content="marker.label ? marker.label : marker.title"
						:label-class="markerClass"
						@click="infobox({
							title: marker.title,
							position: $event.latLng,
							id: marker.id,
							lat: marker.lat,
							lon: marker.lon,
							img: marker.image,
							text: marker.text
						})"
					/>
				</GmapCluster>
			</GmapMap>
			<div class="filters h-100 position-absolute">
				<transition name="filters-animation">
					<div id="filters" class="py-5 flex-column h-100" v-show="showFilters">
						<div class="d-flex justify-content-end px-4">
							<button @click="closeFilters" :class="{'animate-btn': animateBtn}" class="close-btn position-relative"></button>
						</div>
						<div class="p-4">
							<div class="filters-scroll">
								<ul class="list-unstyled mb-0">
									<li v-for="(item, index) in filters" :key="index">
										<a href="#" :class="[{active: item.category.active}, item.category.value]" @click.prevent="filterMarkers(item)" class="d-flex align-items-center p-2 rounded border border-white">
											<span class="d-block me-3">
												<img class="item-icon" :src="item.icon">
											</span>
											{{item.category.text}}
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div class="text-center mt-auto">
							<button class="custom-btn btn shadow-none rouded-0 px-4 py-3" :class="{disabled: disabled}" :disabled="disabled" @click="resetMarkers">ΑΚΥΡΩΣΗ ΦΙΛΤΡΩΝ</button>
						</div>
					</div>
				</transition>
			</div>  
		</div>
	</section>
</template>

<script>
import { gmapApi } from 'vue2-google-maps';
import GmapMarkerWithLabel from './markerWithLabel.vue';

export default {
	props: ['obj-data', 'header-height'],
	components: {
		GmapMarkerWithLabel
	},
	data() {
		return {
			showInfoBox: false,
			infoLoading: false,
			infoboxContent: null,
			selectedMarker: null,
			infoboxTimeout: null,
			filtersTimeout: null,
			closeBtnTimeout: null,
			bounds: null,
			showFilters: false,
			animateBtn: false,
			locations: null,
			disabled: true,
			categories: [],
			timeout: null,
			markerClass: 'marker-position',
			options: {
				fullscreenControl: false,
				styles: [
					{
					"featureType": "administrative.locality",
					"elementType": "all",
					"stylers": [
					{
					"hue": "#0049ff"
					},
					{
					"saturation": 7
					},
					{
					"lightness": 19
					},
					{
					"visibility": "on"
					}
					]
					},
					{
					"featureType": "landscape",
					"elementType": "all",
					"stylers": [
					{
					"hue": "#ff0000"
					},
					{
					"saturation": -100
					},
					{
					"lightness": 100
					},
					{
					"visibility": "simplified"
					}
					]
					},
					{
					"featureType": "poi",
					"elementType": "all",
					"stylers": [
					{
					"hue": "#ff0000"
					},
					{
					"saturation": -100
					},
					{
					"lightness": 100
					},
					{
					"visibility": "off"
					}
					]
					},
					{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
					{
					"hue": "#008eff"
					},
					{
					"saturation": -93
					},
					{
					"lightness": 31
					},
					{
					"visibility": "simplified"
					}
					]
					},
					{
					"featureType": "road",
					"elementType": "labels",
					"stylers": [
					{
					"hue": "#008eff"
					},
					{
					"saturation": -93
					},
					{
					"lightness": 31
					},
					{
					"visibility": "on"
					}
					]
					},
					{
					"featureType": "road.arterial",
					"elementType": "labels",
					"stylers": [
					{
					"hue": "#bbc0c4"
					},
					{
					"saturation": -93
					},
					{
					"lightness": -2
					},
					{
					"visibility": "simplified"
					}
					]
					},
					{
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [
					{
					"hue": "#007fff"
					},
					{
					"saturation": -90
					},
					{
					"lightness": -16
					},
					{
					"visibility": "simplified"
					}
					]
					},
					{
					"featureType": "transit",
					"elementType": "all",
					"stylers": [
					{
					"hue": "#007fff"
					},
					{
					"saturation": 10
					},
					{
					"lightness": 69
					},
					{
					"visibility": "on"
					}
					]
					},
					{
					"featureType": "water",
					"elementType": "all",
					"stylers": [
					{
					"visibility": "on"
					},
					{
					"color": "#4683b9"
					},
					{
					"lightness": "30"
					}
					]
					}
				]
			},
			clusterStyles: [
				{
					textColor: '#fff',
					url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAxCAYAAACYq/ofAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZjhjN2I4NC1mMGZhLWNkNDEtODgzOS02ZDM0M2UyNzYzZDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NERFMDUxRTlCMzI1MTFFQ0FDNjM5M0RFMEEyNjQxMjciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NERFMDUxRThCMzI1MTFFQ0FDNjM5M0RFMEEyNjQxMjciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjdDQzM4QTlGRkM2MTFFOUJBNDFGQkFBMjExOUE2QzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjdDQzM4QUFGRkM2MTFFOUJBNDFGQkFBMjExOUE2QzEiLz4gPC9yZGY6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',
					height: 50,
					width: 49
				}
			]
		}
	},
	created() {
		this.locations = this.samarina.metadata.locations;
	},
	mounted() {
		this.createMap();
		this.parallax();
	},
	methods: {
		parallax() {
			const gsap = this.$gsap;
			const elements = gsap.utils.toArray(".parallax-img");
			const interval = setInterval(() => {
				if(elements && elements.length && this.headerHeight) {
					elements.forEach(img => {
						gsap.to(img, {
							y: innerHeight / 4,
							ease: "sine.out",
							scrollTrigger: {
								trigger: img,
								start: `top ${this.headerHeight}`, 
								end: `bottom ${this.headerHeight}`,
								scrub: true
							}
						});
					});
					clearInterval(interval);
				}
			}, 50);
		},
		resetMarkers() {
			this.disabled = true;
			this.samarina.metadata.locations = this.locations;

			this.categories = [];

			this.filters.forEach(item => {
				item.category.active = false;
			});

			if(this.showInfoBox) this.showInfoBox = false;

			this.selectedMarker = null;

			this.createMap();
		},
		filterMarkers(item) {
			item.category.active = !item.category.active;
			if(this.filters.some(item => {
				return item.category.active === true;
			})) {
				this.disabled = false;
			}

			if(item.category.active) {
				if(this.categories.indexOf(item.category.value) === -1) {
					this.categories.push(item.category.value);
				}
				this.deactivateMarker();
			} else {
				if(this.categories.indexOf(item.category.value) > -1) {
					this.categories = this.categories.filter(item2 => {
						return item2 !== item.category.value;
					})
				}
				this.deactivateMarker();
			}
			
			this.samarina.metadata.locations = this.locations.filter(item => {
				if(this.categories.find(item2 => {
					return item2 === item.category.value;
				})) {
					return item;
				}
			});

			if(!this.samarina.metadata.locations.length) this.samarina.metadata.locations = this.locations;
			
			this.createMap();
		},
		deactivateMarker() {
			if(this.selectedMarker) {
				const activeMarker = this.locations.find(item2 => {
					return item2.id === this.selectedMarker;
				});
				if(!this.categories.find(item2 => {
					return item2 === activeMarker.category.value;
				})) {
					this.showInfoBox = false;
					this.selectedMarker = null;
				}
			}
		},
		infobox({ title, position, id, lat, lon, img, text }) {
			if(this.selectedMarker === id) return;
			this.showInfoBox = true;
			this.infoLoading = true;
			this.selectedMarker = id;
			this.infoboxContent = {
				title,
				position,
				lat,
				lon,
				img,
				text
			}
			this.$refs.Map.panTo(this.infoboxContent.position);
		},
		closeFilters() {
			this.animateBtn = true;
			if(this.filtersTimeout) {
				clearTimeout(this.filtersTimeout);
			}
			this.filtersTimeout = setTimeout(() => {
				this.showFilters = false;
			}, 300);
		},
		closeInfobox() {
			this.showInfoBox = false;
			this.selectedMarker = null;
		},
		getMarkers(marker) {
			if (this.selectedMarker === marker.id) return marker.activeIcon;
			return marker.icon;
		},
		createMap() {
			if(this.$refs.Map) {
				this.$refs.Map.$mapPromise.then(() => {
					this.bounds = new this.google.maps.LatLngBounds();
					this.samarina.metadata.locations.map(marker => {
						const loc = new this.google.maps.LatLng(marker.lat, marker.lon);
						this.bounds.extend(loc);
					});
					this.$refs.Map.panToBounds(this.bounds);
					this.$refs.Map.fitBounds(this.bounds);
				});
			}
		}
	},
	computed: {
		google: gmapApi,
		samarina() {
			const items = [];
			for (const prop in this.objData.metadata) {
				items.push(this.objData.metadata[prop]);
			}
			return items.find(item => {
				return item.id === '622e1f58bbb43300095a3892';
			});
		},
		filters() {
			return this.locations.filter((item, index, array) => {
				return array.findIndex(item2 => {
					return item2.category.value === item.category.value;
				}) === index;
			});
		}
	},
	watch: {
		infoLoading() {
			if(this.infoboxTimeout) {
				clearTimeout(this.infoboxTimeout);
			}
			this.infoboxTimeout = setTimeout(() => {
				this.infoLoading = false;
			}, 350);
		},
		showFilters(value) {
			if(!value) {
				if(this.closeBtnTimeout) {
					clearTimeout(this.closeBtnTimeout);
				}
				this.closeBtnTimeout = setTimeout(() => {
					this.animateBtn = false;
				}, 300);
			}
		}
	}
};
</script>

<style lang="scss">
.samarina {
	.parallax {
		.parallax-img {
			top: 0;
			left: 0;

			@media (max-width: 1199.98px) {
				transform: none !important;
			}
		}

		.parallax-content {
			padding: 9.5% 6.5% 6% 6.5%;
			background-color: rgba(255,255,255,0.8);
			min-height: 775px;

			p {
				font-style: italic;
				font-family: "GFS Didot", serif;
				text-align: justify;
			}

			@media (max-width: 1199.98px) {
				min-height: auto;
			}

			@media (max-width: 575.98px) {
				padding-left: 15px;
				padding-right: 15px;
			}	
		}
	}

	.map {
		#map {
			height: 700px;
			width: 100%;
			transition: all .3s;
		}

		&.active {
			#map {
				width: calc(100% - 360px);

				@media (max-width: 991.98px) {
					width: 100%;
				}
			}

			.filters {
				pointer-events: all;
			}
		}

		.infobox {
			left: 5%;
			top: 50%;
			transform: translate(0, -50%);
			z-index: 1;
			box-shadow: 0px 2px 57px 0px rgba(0, 0, 46, .1);
			width: 400px;
			max-width: 400px;
			min-width: 400px;
			max-height: 90%;
			overflow: auto;

			&::-webkit-scrollbar {
				width: 5px;
			}

			&::-webkit-scrollbar-track {
				background: #f1f1f1;
			}

			&::-webkit-scrollbar-thumb {
				background: #181818;
			}

			@media (max-width: 400px) {
				left: 1rem;
				right: 1rem;
				width: auto;
				max-width: none;
				min-width: auto;
			}

			.bg-img {
				padding-top: 66.99999%;
			}

			.box-content {
				p {
					font-size: .75rem;
					line-height: 16px;
				}

				.custom-btn {
					font-size: 0.875rem;
				}
			}

			.close-btn {
				top: 0;
				right: 0;
				font-size: 1.3rem;
				color: #181818;
			}

			&.loading {
				.field {
					color: transparent;
					background-image: linear-gradient(90deg, #F4F4F4 0px, rgba(229, 229, 229, 0.8) 40px, #F4F4F4 80px) !important;
					background-size: 100%;
					animation: shine-lines .5s infinite ease-out;
				}
			}
		}

		.filters-btn {
			background-color: transparent;
			border: none;
			cursor: pointer;
			outline: none;
			width: 100px;
			height: 100px;
			z-index: 5;
			top: 55px;
			right: 0;

			@media (max-width: 575.98px) {
				width: 80px;
				height: 80px;
			}

			.filter-wrapper {
				top: 0;
				left: 0;
				background: #fff;
				transition: all .4s;
			}

			.filter-line {
				width: 38px;
				height: 10px;
				margin: 1px 0;

				& > div {
					background: #181818;
					transition: all .4s;
				}
			}

			.filter-line-inner-long {
				width: 22px;
				height: 3px;
			}

			.filter-line-inner-thick {
				width: 6px;
				height: 6px;
				border-radius: 100%;
			}

			.filter-line-inner-short {
				width: 7px;
				height: 3px;
			}

			&:hover {
				.filter-line-inner-long {
					width: 7px;
					height: 3px;
				}

				.filter-line-inner-short {
					width: 22px;
					height: 3px;
				}
			}
		}

		.filters {			
			right: 0;
			top: 0;
			z-index: 5;
			pointer-events: none;

			@media (max-width: 575.98px) {
				width: 100%;
			}

			#filters {
				background-color: #fff;
				width: 100%;
				min-width: 360px;
				max-width: 360px;
				box-shadow: -10px 10px 30px 0px rgba(0,0,0,0.1);
				display: flex;

				@media (max-width: 575.98px) {
					min-width: auto;
					max-width: none;
					box-shadow: none;
				}

				.filters-scroll {
					max-height: calc(700px - (17px + 6rem + 50px + 3rem));
					overflow: auto;

					&::-webkit-scrollbar {
						width: 7px;
					}

					&::-webkit-scrollbar-track {
						background: #f1f1f1;
					}

					&::-webkit-scrollbar-thumb {
						background: #181818;
					}
				}

				ul {
					li {
						a {
							color: #181818;

							.item-icon {
								min-width: 48px;
							}

							&.active {
								&.ekklisies {
									background: rgba(165, 39, 20, .1);
								}

								&.ktiria {
									background: rgba(173, 82, 113, .1);
								}

								&.vryses {
									background: rgba(44, 88, 125, .1);
								}

								&.topothesies {
									background: rgba(149, 177, 105, .1);
								}
							}
						}
					}
				}
			}

			.close-btn {
				border: none;
				outline: none;
				background-color: transparent;
				cursor: pointer;
				display: block;
				width: 17px;
				height: 17px;

				&:before,
				&:after{
					content: '';
					width: 17px;
					height: 2px;
					background: #181818;
					position: absolute;
					top: 0;
					left: 0;
					transform: rotate(-45deg);
					transition: all 0.3s;
				}

				&:after{
					transform: rotate(45deg);
					transition: all 0.3s;
				}

				&.animate-btn {
					&:before,
					&:after {
						transform: rotate(180deg);
					}
				}
			}
		}
	}
}

@keyframes shine-lines {
    0% {
        background-position: -100px;
    }

    40%, 100% {
        background-position: 140px;
    }
}

.infobox-animation-enter,
.infobox-animation-leave-to {
  opacity: 0;
  transform: translate(-100%, -50%) !important;
}

.infobox-animation-enter-active {
  transition: all .3s ease-out;
}

.infobox-animation-leave-active {
  transition: all .3s ease-in;
}

.filters-animation-enter,
.filters-animation-leave-to {
  transform: translateX(calc(-100%/2));
  opacity: 0;
}

.filters-animation-enter-active {
  transition: all .3s ease-out;
}

.filters-animation-leave-active {
  transition: all .3s ease-in;
}

</style>
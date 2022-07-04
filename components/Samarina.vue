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
						v-for="marker in locations" 
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
			allLocations: null,
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
			],
			filters: [
				{
					"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAACiaAAAomgEXOiGyAAAKDWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmNjg5NmMxNy0yOTA4LTFmNDgtODllNi01YmIzOGQyNjEwYjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGUxZDI0YjctZmUxZC0xMTQ0LWFiZWQtNDc2YjkyZmEzZGM5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjBCQzNBNkMyMjBGOURCNjg3RDU0OTdBRTZFOUVCNzI0IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDYtMjdUMTg6NTM6MDYrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTA2LTI3VDIwOjAzOjM0KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA2LTI3VDIwOjAzOjM0KzAyOjAwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGJjOTU1M2MtYzA0ZC1jMTQ5LTgxZWQtYjk1MGZkYTExYmM4IiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDIwOjAzOjE2KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL2pwZWcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDBiODAyZWUtM2EzOC03NDRhLTg2NmEtMTE0N2RjNWMxMzA0IiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDIwOjAzOjE2KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ3MzRkMWM2LWNhMmYtYmI0MC04NWJjLWUxOGI5Mjk2ZGZiYyIgc3RFdnQ6d2hlbj0iMjAyMi0wNi0yN1QyMDowMzozNCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4ZTFkMjRiNy1mZTFkLTExNDQtYWJlZC00NzZiOTJmYTNkYzkiIHN0RXZ0OndoZW49IjIwMjItMDYtMjdUMjA6MDM6MzQrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDczNGQxYzYtY2EyZi1iYjQwLTg1YmMtZTE4YjkyOTZkZmJjIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQwYjgwMmVlLTNhMzgtNzQ0YS04NjZhLTExNDdkYzVjMTMwNCIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSIwQkMzQTZDMjIwRjlEQjY4N0Q1NDk3QUU2RTlFQjcyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgiBoIEAABKXSURBVGiBtZp5eNTVucc/5/f7zZJJMplM9o2EkEAIAYSwCyIgKCK4VUQqrRbEa1ut16pV66O1Xqla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",
					"category": {
						"value": "ekklisies",
						"text": "Χώροι θρησκευτικού περιεχομένου / Εκκλησίες",
						"active": false
					}
				},
				{
					"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAACiaAAAomgEXOiGyAAAKDWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1MGY5OTlmNy01NGY0LTdmNDEtYTYwOC1iNWZmYjE0NzliMDEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDZjOGJhNDgtZTVkZC0xMjQ2LWEyM2EtZjdlNTQyMzFjNTAzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjBCQzNBNkMyMjBGOURCNjg3RDU0OTdBRTZFOUVCNzI0IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDYtMjdUMTg6NTM6MDYrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTA2LTI3VDIwOjAyOjAzKzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA2LTI3VDIwOjAyOjAzKzAyOjAwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWY2ODIxM2EtMzlmNi1jZDQ1LTllNDktYjJiM2ExZDg3MTQyIiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDIwOjAxOjM1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL2pwZWcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWQ0MjU0OTYtMTU3Yy1mMDQyLWJhN2MtMzY2OTE2YmZlMDM0IiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDIwOjAxOjM1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI5OTM2MjlkLTYzN2UtNDY0ZC05YzM2LTllM2RiNWNjY2Y5NyIgc3RFdnQ6d2hlbj0iMjAyMi0wNi0yN1QyMDowMjowMyswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNmM4YmE0OC1lNWRkLTEyNDYtYTIzYS1mN2U1NDIzMWM1MDMiIHN0RXZ0OndoZW49IjIwMjItMDYtMjdUMjA6MDI6MDMrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Yjk5MzYyOWQtNjM3ZS00NjRkLTljMzYtOWUzZGI1Y2NjZjk3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVkNDI1NDk2LTE1N2MtZjA0Mi1iYTdjLTM2NjkxNmJmZTAzNCIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSIwQkMzQTZDMjIwRjlEQjY4N0Q1NDk3QUU2RTlFQjcyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmGyg3sAABY/SURBVGiBvZpnlF3Vled/N7ycX71YuVQqVamUJVAAAQJLDiAMHreHMabpNmsM7mXPTI9T24xpppPt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",
					"category": {
						"value": "ktiria",
						"text": "Κτίρια / Εγκαταστάσεις",
						"active": false
					}
				},
				{
					"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAACiaAAAomgEXOiGyAAAKDWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMWY2Yjg2Ni00Y2Q1LTgyNGMtYmY3Yy1mMWQxYWU5ZGE0OGEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MWZlNDBjNzYtNDA2NC00YzQ5LWFhMzktMWEyYzJkM2JkNmFiIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjBCQzNBNkMyMjBGOURCNjg3RDU0OTdBRTZFOUVCNzI0IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDYtMjdUMTg6NTM6MDYrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTA2LTI3VDE5OjU4OjQ4KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA2LTI3VDE5OjU4OjQ4KzAyOjAwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWE0NmNmZDYtYmRlNi1jYjQxLTk0ZWUtMDEyNGYzODRmY2UyIiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDE5OjU4OjA3KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL2pwZWcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGUxYzk1ODEtY2U3Mi04YjQ4LTk1MWItMmYzMThkM2JmNTFjIiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDE5OjU4OjA3KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzY2IwMzc0LTgzNjctYTQ0OS1iN2ViLTE3ZTcyNTk5MzY3OSIgc3RFdnQ6d2hlbj0iMjAyMi0wNi0yN1QxOTo1ODo0OCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxZmU0MGM3Ni00MDY0LTRjNDktYWEzOS0xYTJjMmQzYmQ2YWIiIHN0RXZ0OndoZW49IjIwMjItMDYtMjdUMTk6NTg6NDgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNjYjAzNzQtODM2Ny1hNDQ5LWI3ZWItMTdlNzI1OTkzNjc5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhlMWM5NTgxLWNlNzItOGI0OC05NTFiLTJmMzE4ZDNiZjUxYyIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSIwQkMzQTZDMjIwRjlEQjY4N0Q1NDk3QUU2RTlFQjcyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtPgNbMAABQ1SURBVGiBvZl5fFxXlee/975Xr3bVIpV2S7JkeZUtx07sxGQzxIZsEJKh+xPSEJbuBnqmIXxgSDMN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",
					"category": {
						"value": "vryses",
						"text": "Βρύσες",
						"active": false
					}
				},
				{
					"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAACiaAAAomgEXOiGyAAAKDWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMDQ5OGEyYy1jZjhhLWI2NGMtYmI3Ny1mOWYxMGIxNjA3MmEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MWFkNmFkN2MtNmFlNy1hZjRmLWJkYzYtYzU4NTI1ZTJhNWQ1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjBCQzNBNkMyMjBGOURCNjg3RDU0OTdBRTZFOUVCNzI0IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDYtMjdUMTg6NTM6MDYrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTA2LTI3VDIwOjA2OjExKzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA2LTI3VDIwOjA2OjExKzAyOjAwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmI5YzM0ZTUtNjBiNy0wYTQzLTkxMGEtOTUwNGQxY2NiNmM5IiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDIwOjA0OjUwKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL2pwZWcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODkwOWJhZWYtOTI3OC02ZjRjLTljZmEtYjgxMmFjNjU2ZTU0IiBzdEV2dDp3aGVuPSIyMDIyLTA2LTI3VDIwOjA0OjUwKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmU4NTY0ZWFhLWM0MjktOTQ0NC1hOWIwLWQyMTZkNDJmMGMwZCIgc3RFdnQ6d2hlbj0iMjAyMi0wNi0yN1QyMDowNjoxMSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxYWQ2YWQ3Yy02YWU3LWFmNGYtYmRjNi1jNTg1MjVlMmE1ZDUiIHN0RXZ0OndoZW49IjIwMjItMDYtMjdUMjA6MDY6MTErMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZTg1NjRlYWEtYzQyOS05NDQ0LWE5YjAtZDIxNmQ0MmYwYzBkIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5MDliYWVmLTkyNzgtNmY0Yy05Y2ZhLWI4MTJhYzY1NmU1NCIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSIwQkMzQTZDMjIwRjlEQjY4N0Q1NDk3QUU2RTlFQjcyNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi6jWLgAABVBSURBVGiBvZl3lF3Vfe8/+5Tb69Q7vUiakdCo0iQZEKIZEBiME3BsszDE69m4PBPbISS4vCROsZPn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",
					"category": {
						"value": "topothesies",
						"text": "Τοποθεσίες",
						"active": false
					}
				}
			]
		}
	},
	created() {
		this.locations = this.samarina.metadata.locations;
		this.allLocations = this.samarina.metadata.locations
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
			this.locations = this.allLocations;

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

			if(this.filters.every(item => {
				return item.category.active === true;
			})) {
				this.disabled = true;
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

			this.locations = this.allLocations.filter(item => {
				if(this.categories.find(item2 => {
					return item2 === item.category.value;
				})) {
					return item;
				}
			});

			if(!this.locations.length) this.locations = this.allLocations;
			
			this.createMap();
		},
		deactivateMarker() {
			if(this.selectedMarker) {
				const activeMarker = this.allLocations.find(item2 => {
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
					this.locations.map(marker => {
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
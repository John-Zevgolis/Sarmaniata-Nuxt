<template>
	<section class="section photos pt-3 pt-md-5" id="photos">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h3 v-if="photos.title" class="from-bottom animated section-title underline">{{photos.title}}</h3>
					<div v-if="photos.content" class="from-bottom animated" v-html="photos.content"></div>
					<ul class="nav justify-content-end filters">
						<li v-for="(value, key, index) in options.getFilterData" :key="index">
							<button :class="{active: activeClass === index}" @click="filter(key, index)">{{key === 'ΠΕΤΡΑ' ? 'ΠΕΤΡΑ & ΝΕΡΟ' : key}}</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<LightBox @close="active = null" :index="active" :items="fancybox"/>
		<isotope ref="grid" class="grid" :options='options' :list="photos.metadata.gallery" @filter="layoutComplete" v-images-loaded:on.progress="layout">
			<div class="col-md-6 col-lg-3" v-for="(item, index) in photos.metadata.gallery" :key="index">
				<img width="100%" height="100%" :alt="item.title" :src="item.thumbnail" @click="findIndex(item)">
			</div>
		</isotope>
	</section>
</template>

<script>
import { EventBus } from '../plugins/v-event-bus.js';

export default {
	props: ['obj-data'],
	data() {
		return {
			options: {
				itemSelector: ".element-item",
				getFilterData: {
					ΟΛΕΣ() {
						return true;
					},
					ΠΕΤΡΑ(el) {
						return el.metadata.category === "ΠΕΤΡΑ"
					},
					ΓΗ(el) {
						return el.metadata.category === "ΓΗ";
					},
					ΖΩΗ(el) {
						return el.metadata.category === "ΖΩΗ";
					}
				},
			},
			active: null,
			fancybox: null,
			activeClass: 0
		};
	},
	methods: {
		findIndex(item) {
			if(this.fancybox.indexOf(item.thumbnail) > -1) {
				this.active = this.fancybox.indexOf(item.thumbnail);
			}
		},
		layoutComplete() {
			(this.$nuxt || EventBus || this.$EventBus).$emit('layout-complete');
		},
		layout() {
			console.log('s')
            this.$refs.grid.layout('masonry');
            (this.$nuxt || EventBus || this.$EventBus).$emit('layout-complete');
        },
		filter(key, index) {
			this.activeClass = index;
			if(key !== 'ΟΛΕΣ') {
				this.fancybox = this.photos.metadata.gallery.filter(item => {
					return item.metadata.category === key;
				}).map(item => {
					return item.thumbnail;
				});
			} else {
				this.fancybox = this.photos.metadata.gallery.map(item => {
					return item.thumbnail;
				});
			}

			this.$refs.grid.filter(key);
		}
	},
	computed: {
		photos() {
			const items = [];
			for (const prop in this.objData.metadata) {
				items.push(this.objData.metadata[prop]);
			}
			return items.find(item => {
				return item.id === '623389982651f90009d1b508';
			});
		}
	},
	watch: {
		photos: {
			immediate: true,
			handler(value) {
				this.fancybox = value.metadata.gallery.map(item => {
					return item.thumbnail;
				});
			}
		}
	}
};
</script>

<style lang="scss">
.photos {
	p {
		font-style: italic;
		font-family: "GFS Didot", serif;
	}

	.filters {
		margin: 3.125rem 0 3.75rem;

		li {
			button {
				font-size: 0.625rem;
				line-height: 32px;
				letter-spacing: 2px;
				padding: 0 0.8125rem;
				display: inline-block;
				margin: 6px 5px;
				border: 1px solid #e2e2e2;
				background: transparent;
				transition: all .3s;

				&:hover {
					border-color: #181818;
				}

				&.active {
					background: #181818;
					color: #fff;
					border-color: transparent;
				}
			}
		}
	}

	.grid {
		img {
			cursor: pointer;
		}
	}
}
</style>
<template>
	<main id="home" class="section home-carousel position-relative">
		<VueSlickCarousel v-bind="settings">
			<div v-for="(item, index) in home.metadata.carousel" :key="index">
				<div class="bg-img h-100 d-flex justify-content-center align-items-center" :style="`background-image: url(${item.thumbnail});`">
					<div class="position-relative box text-center">
						<div v-if="item.title">
							<h1 v-if="index === 0" class="mb-2 underline">{{item.title}}</h1>
							<h2 v-else class="mb-2 underline">{{item.title}}</h2>
						</div>
						<div v-if="item.content" v-html="item.content"></div>
					</div>
				</div>
			</div>
		</VueSlickCarousel>
		<div class="bar-left position-absolute text-center d-none d-md-block">PREVIOUS</div>
		<div class="bar-right position-absolute text-center d-none d-md-block">NEXT</div>
		<button class="position-absolute scroll-down bg-transparent border-0 p-0" @click="moveToFirstSection">
			<span class="d-block discovery">DISCOVERY</span>
			<img class="position-absolute" alt="discovery" src="data:image/png;base64,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">
			<span class="d-block line position-relative"></span>
		</button>
	</main>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

export default {
	components: {
		VueSlickCarousel,
	},
	props: ['obj-data', 'header-height'],
	data() {
		return {
			settings: {
				"lazyLoad": "ondemand",
				"fade": true,
				"infinite": true,
				"speed": 500,
				"slidesToShow": 1,
				"autoplay": true,
				"autoplaySpeed": 6000,
				"pauseOnHover": false
			}
		}
	},
	methods: {
		moveToFirstSection() {
			const y = this.$parent.$refs.sarmaniata.$el.offsetTop - this.headerHeight;
			window.scrollTo({top: y, behavior: 'smooth'});
		}
	},
	computed: {
		home() {
			const items = [];
			for (const prop in this.objData.metadata) {
				items.push(this.objData.metadata[prop]);
			}
			return items.find(item => {
				return item.id === '622e1ed3f1322f0009f67fbe'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.home-carousel {
	margin-top: 115px;

	@media (max-width: 1399.98px) {
		margin-top: 97.5px;
	}

	@media (max-width: 991.98px) {
		margin-top: 96.55px;
	}

	.bar-left,
	.bar-right {
		top: 50%;
		transform: translateY(-50%);
		border-bottom: 1px dashed rgba(255,255,255,0.6);
		min-width: 220px;
		color: #fff;
		font-size: .75rem;
		padding-bottom: 0.625rem;
		font-family: 'Montserrat', sans-serif;
		line-height: 1.42857143;
		letter-spacing: 2px;
		margin-top: -10px;

		@media (max-width: 1399.98px) {
			top: auto;
			transform: none;
			bottom: 55px;
		}

		&:after {
			content: '';
			position: absolute;
			border-radius: 100%;
			width: 5px;
			height: 5px;
			background: #fff;
			bottom: -2.5px;
		}
	}

	.bar-left {
		left: calc(40px + 75px);

		@media (max-width: 1399.98px) { 
			left: calc(40px + 25px);
		}

		&:after {
			left: 100%;
		}
	}

	.bar-right {
		right: calc(40px + 75px);

		@media (max-width: 1399.98px) { 
			right: calc(40px + 25px);
		}

		&:after {
			right: 100%;
		}
	}

	.scroll-down {
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;

		.discovery {
			color: #fff;
			letter-spacing: 2px;
			font-size: 0.6875rem;
		}

		img {
			left: 50%;
			top: calc(16.5px + 5px + 10px);
			transform: translateX(-50%);
		}

		.line {
			height: 75px;
			width: 0;
			border-right: 1px dashed rgba(255,255,255,0.6);
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;

			&:after {
				content: '';
				border-radius: 100%;
				bottom: 100%;
				width: 5px;
				height: 5px;
				background: #fff;
				display: block;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
}
</style>
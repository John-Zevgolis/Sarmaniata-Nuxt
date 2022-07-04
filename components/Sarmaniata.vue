<template>
	<section id="sarmaniata" class="section sarmaniata">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div v-if="sarmaniata.thumbnail" class="bg-img-wrapper ps-lg-4 mb-4 mb-lg-0">
						<div class="bg-img position-relative" v-lazy:background-image="sarmaniata.thumbnail">
							<div class="overlay position-absolute w-100 h-100 animated" ref="overlay"></div>
						</div>
					</div>
					<span v-if="sarmaniata.content" v-html="sarmaniata.content"></span>
				</div>
			</div>
		</div>	
	</section>	
</template>

<script>
export default {
	props: ['obj-data'],
	computed: {
		sarmaniata() {
			const items = [];
			for (const prop in this.objData.metadata) {
				items.push(this.objData.metadata[prop]);
			}
			return items.find(item => {
				return item.id === '622e1c0764eb9d00090f4ff9';
			});
		}
	}
};
</script>

<style lang="scss">
.sarmaniata {
	padding: 7.5rem 0;

	@media (max-width: 991.98px) {
		padding: 4.0625rem 0;
	}

	.bg-img-wrapper {
		float: right;
		width: 100%;
		max-width: 50%;
		

		@media (max-width: 991.98px) {
			float: none;
			max-width: none;
		}

		.bg-img {
			padding-top: 123.64959%;
		}

		.overlay {
			background: #fff;
		}
	}

	p {
		font-style: italic;
		font-family: 'GFS Didot', serif;
	}
}
</style>
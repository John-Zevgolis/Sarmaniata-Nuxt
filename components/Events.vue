<template>
	<section id="events" class="section events">
		<div class="py-5">
			<div class="container py-5">
				<div class="row">
					<div class="col-12 text-center">
						<h3 v-if="events.title" class="underline section-title mb-5 from-bottom animated">{{events.title}}</h3>
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-xl-10 col-xxl-9">
						<div class="row">
							<div class="col-sm-6 col-md-3 mb-4 mb-md-0 text-center" v-for="(event, index) in events.metadata.icons" :key="index">
								<nuxt-link class="d-inline-block opacity-0 animated" :to="`${event.slug}`">
									<span class="icon position-relative d-flex justify-content-center align-items-center rounded-circle mx-auto animated scale">
										<i class="bi bi-camera-reels-fill" v-if="event.slug === 'provoles'"></i>
										<i class="bi bi-puzzle-fill" v-if="event.slug === 'paixnidi'"></i>
										<i class="bi bi-chat-dots-fill" v-if="event.slug === 'syzitiseis'"></i>
										<font-awesome-icon icon="fa-brands fa-atlassian" v-if="event.slug === 'alles-ekdilwseis'" />
									</span>
									<span class="d-block mt-3 title">{{event.title}}</span>
								</nuxt-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container-fluid px-0">
			<div class="row gx-0">
				<div class="col-12">
					<img v-if="events.thumbnail" v-lazy="events.thumbnail">
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	props: ['obj-data'],
	computed: {
		events() {
			const items = [];
			for (const prop in this.objData.metadata) {
				items.push(this.objData.metadata[prop]);
			}
			return items.find(item => {
				return item.id === '622e1ef3bbb43300095a3890'
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.events {
	h3 {
		&:after {
			margin-left: auto;
			margin-right: auto;
		}
	}

	a {
		color: #fff;

		.icon {
			width: 120px;
			height: 120px;
			background: #181818;
			transition: all .3s;
			
			&:after {
				content: '';
				opacity: 0;
				transform: scale3d(1.2, 1.2, 1);
				z-index: 1;
				border-radius: inherit;
				pointer-events: none;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				transition: all 0.3s;
				transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
				border: 2px solid #181818;
			}

			i,svg {
				font-size: 40px;
			}

			&:hover {
				background: transparent;
				color: #181818;
				&:after {
					opacity: 1;
					transform: scale3d(1, 1, 1);
				}
			}
		}

		.title {
			color: #181818;
		}
	}
}
</style>
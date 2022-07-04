<template>
	<header ref="header" class="fixed-top mx-auto py-1 py-lg-0" :class="{active: show}">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<nav class="d-flex flex-wrap flex-lg-nowrap align-items-center navbar-expand-lg px-1 px-xl-3">
						<nuxt-link class="d-block logo" to="/" aria-label="Home">
							<img :src="logo.url" :alt="logo.original_name">
						</nuxt-link>
						<div class="d-none d-lg-block">
							<nav class="social mx-2 mx-xxl-4">
								<ul class="nav align-items-center">
									<li class="px-3">
										<a href="#" aria-label="Twitter" target="_blank">
											<font-awesome-icon icon="fa-brands fa-twitter" />
										</a>
									</li>
									<li class="px-3">
										<a href="https://www.facebook.com/groups/sarmaniata/?ref=share" aria-label="Facebook" target="_blank">
											<font-awesome-icon icon="fa-brands fa-facebook-f" />
										</a>
									</li>
								</ul>
							</nav>
						</div>
						<nav class="main-menu ms-auto d-flex align-items-center justify-content-center" v-click-outside="closeMenu">
							<ul class="nav flex-nowrap flex-lg-wrap flex-column flex-lg-row text-center text-xl-start w-100">
								<li>
									<nuxt-link to="/" exact class="d-block bg-transparent menu-link position-relative">ΑΡΧΙΚΗ</nuxt-link>
								</li>
								<li v-for="(event, index) in events.metadata.icons" :key="index">
									<nuxt-link :to="`/${event.slug}`" class="d-block bg-transparent menu-link position-relative">{{event.title}}</nuxt-link>
								</li>
								<li class="d-lg-none mt-3">
									<nav class="social">
										<ul class="nav justify-content-center align-items-center">
											<li class="px-3">
												<a href="#" aria-label="Twitter" target="_blank">
													<font-awesome-icon icon="fa-brands fa-twitter" />
												</a>
											</li>
											<li class="px-3">
												<a href="https://www.facebook.com/groups/sarmaniata/?ref=share" aria-label="Facebook" target="_blank">
													<font-awesome-icon icon="fa-brands fa-facebook-f" />
												</a>
											</li>
										</ul>
									</nav>
								</li>
							</ul>
						</nav>
						<button aria-label="Hamburger" class="ms-auto hamburger shadow-none p-0 hamburger--collapse hamburger--collapse navbar-toggler" :class="{'is-active': show}" type="button" @click.stop="show = !show">
							<span class="hamburger-box">
								<span class="hamburger-inner"></span>
							</span>						
						</button>
					</nav>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
	props: ['logo', 'events'],
	directives: {
		ClickOutside
	},
	data() {
		return {
			show: false,
			timeout: null
		};
	},
	mounted() {
		this.handleResize();
		window.addEventListener('resize', () => {
			if(this.timeout) clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.handleResize(); 
			}, 150);
		});
	},
	methods: {
		closeMenu() {
			if(this.show) {
				this.show = false;
			}
		},
		handleResize() {
			if(window.matchMedia('(min-width: 992px)').matches) {
				if(this.show === true) {
					this.show = false;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
header {
	background: #fff;
	border-bottom: 1px solid #e2e2e2;
	max-width: 1920px;

	.hamburger {
		line-height: 1;

		.hamburger-box {
			width: 35px;

			.hamburger-inner, .hamburger-inner:after, .hamburger-inner:before {
				height: 2px;
				width: 35px;
			}
		}
     
      &.is-active:hover, &:hover {
        opacity: 1;
      }
    }

	nav {
		ul {
			li {
				a {
					color: #181818;
					transition: color .3s ease;
				}
			}
		}

		&.social {
			ul {
				li {
					border-right: 1px solid;

					&:last-child {
						border: 0;
					}

					a {
						&:hover {
							color: #999;
						}

						@media (max-width: 991.98px) {
							color: #999;

							&:hover {
								color: #fff;
							}
						}
					}
				}
			}
		}

		&.main-menu {
			& > ul {
				& > li {
					& > a {
						letter-spacing: 2px;
						font-size: 0.75rem;
						padding: 3rem 1.875rem;
						font-family: 'Open Sans';
						border: 0;

						&:after {
							content: '';
							position: absolute;
							top: 100%;
							left: 0;
							width: 100%;
							height: 1px;
							background: #181818;
							transform: scaleX(0);
							transition: all .3s;
						}

						&:hover {
							color: #999;
						}

						&.active {
							&:after {
								transform: none;
							}
						}
					}
				}
			}

			@media (max-width: 1399.98px) {
				& > ul {
					& > li {
						& > a {
							font-size: 0.6875rem;
							padding: 2.5rem 1.5rem;
						}
					}
				}
			}

			@media (max-width: 991.98px) {
				width: 100%;
				position: absolute;
				transition: transform .5s ease;
				top: 96.55px;
				background: #181818;
				max-width: 295px;
				min-height: calc(100vh - 96.55px);
				max-height: calc(100vh - 96.55px);
				right: -295px;	

				& > ul {
					max-height: calc(100vh - 96.55px);
					overflow: auto;
					padding: 1.5625rem;

					& > li {
						& > a {
							padding: 1rem 0;
							color: #999;
							border-bottom: 1px solid #222;
							font-size: 0.75rem;
							width: 100%;

							&:after {
								display: none;
							}

							&.active,&:hover {
								color: #fff;
							}
						}
					}
				}
			}
		}
	}

	@media (max-width: 991.98px) {
		&.active {
			.main-menu {
				transform: translateX(-295px);
				
				& > ul {
					&::-webkit-scrollbar {
						width: 7px;
					}

					&::-webkit-scrollbar-track {
						background: #181818;
					}

					&::-webkit-scrollbar-thumb {
						background: #fff;
					}
				}
			}
		}
	}
}
</style>
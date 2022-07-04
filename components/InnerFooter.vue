<template>
	<footer class="section" id="contact">
		<div class="footer-top position-relative">
			<div class="container">
			<div class="row justify-content-center">
				<div class="col-xxl-11">
					<div class="row">
						<div class="col-lg-5">
							<div class="mb-4 logo">
								<img :src="logo.url" :alt="logo.original_name">
							</div>
							<div class="description" v-html="objData.content"></div>
							<div class="address">
								<ul class="list-unstyled mb-0">
									<li v-for="(item, index) in objData.metadata.contact_info" :key="index">
										<span v-if="item.address" class="d-inline-flex align-items-center">
											<span class="icon-square me-4 text-center d-inline-block">
												<font-awesome-icon icon="fa-solid fa-location-dot" />
											</span>
											{{item.address}}
										</span>
										<a :href="`tel:${trimWhiteSpaces(item.phone)}`" v-if="item.phone" class="d-inline-flex align-items-center">
											<span class="icon-square me-4 text-center d-inline-block">
												<font-awesome-icon icon="fa-solid fa-phone" />
											</span>
											{{item.phone}}
										</a>
										<a :href="`mailto:${trimWhiteSpaces(item.email)}`" v-if="item.email" class="d-inline-flex align-items-center">
											<span class="icon-square me-4 text-center d-inline-block">
												<font-awesome-icon icon="fa-solid fa-envelope" />
											</span>
											{{item.email}}
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div class="col-lg-5 offset-lg-2">
							<div class="contact mt-4 mt-lg-0">
								<h3 class="pb-3 underline text-white">{{objData.title}}</h3>
								<div class="subtitle">
									<p>Για να επικοινωνήσετε μαζί μας, συμπληρώστε την παρακάτω φόρμα.</p>
									<p><small>* Δεχόμαστε μηνύματα και στη βλαχική</small> <i class="bi bi-emoji-wink"></i></p>
								</div>
							</div>
							<div class="form">
								<form @submit.prevent="submitForm" novalidate>
									<div>
										<input :disabled="response && response.status === 'success'" :class="{error: response && response.status === 'error' && errorMessage('name', response)}" class="form-control rounded-0" placeholder="Ονοματεπώνυμο" v-model="name" name="name" type="text">
										<span class="d-block error text-danger" v-if="response && response.status === 'error' && errorMessage('name', response)">{{errorMessage('name', response)}}</span>
									</div>
									<div>
										<input :disabled="response && response.status === 'success'" :class="{error: response && response.status === 'error' && errorMessage('email', response)}" class="form-control rounded-0" placeholder="Email" v-model="email" name="email" type="email">
										<span class="d-block error text-danger" v-if="response && response.status === 'error' && errorMessage('email', response)">{{errorMessage('email', response)}}</span>
									</div>
									<div>
										<input :disabled="response && response.status === 'success'" :class="{error: response && response.status === 'error' && errorMessage('subject', response)}" class="form-control rounded-0" placeholder="Θέμα" v-model="subject" name="subject" type="text">
										<span class="d-block error text-danger" v-if="response && response.status === 'error' && errorMessage('subject', response)">{{errorMessage('subject', response)}}</span>
									</div>
									<div>
										<textarea :disabled="response && response.status === 'success'" :class="{error: response && response.status === 'error' && errorMessage('message', response)}" class="form-control rounded-0" placeholder="Μήνυμα" v-model="message" name="message"></textarea>
										<span class="d-block error text-danger" v-if="response && response.status === 'error' && errorMessage('message', response)">{{errorMessage('message', response)}}</span>
									</div>
									<div class="mt-4 d-flex justify-content-end">
										<button :class="{disabled: response && response.status === 'success'}" :disabled="response && response.status === 'success'" class="form-control btn shadow-none rounded-0 my-0 w-auto">ΑΠΟΣΤΟΛΗ</button>
									</div>
								</form>
								<div class="alert alert-success mb-0 mt-4" v-if="response && response.status === 'success'" role="alert">{{response.text}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</div>
		</div>
		<div class="footer-bottom py-3 py-md-4">
			<div class="container">
				<div class="row align-items-end">
					<div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
						<p class="d-block copyright">© {{year}} - ALL RIGHTS RESERVED</p>
					</div>
					<div class="col-md-6">
						<div class="d-md-flex justify-content-md-end align-items-md-end text-center text-md-start">
							<nav class="social mx-2 mx-xxl-4 mb-3 mb-md-0">
								<ul class="nav justify-content-center justify-content-md-end align-items-center">
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
							<p>MADE WITH <i class="bi bi-balloon-heart-fill text-danger"></i></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script>
import { EventBus } from '../plugins/v-event-bus.js';

export default {
	props: ['logo', 'obj-data'],
	data() {
		return {
			name: '',
			email: '',
			subject: '',
			message: ''
		};
	},
	created() {
		(this.$nuxt || EventBus || this.$EventBus).$on('resetForm', () => {
			this.name = '';
			this.email = '';
			this.subject = '';
			this.message = '';
		});
	},
	methods: {
		errorMessage(field, res) {
			const error = res.errors.find(item => {
				return item.field === field;
			});
			if(error) {
				return error.text;
			}
		},
		trimWhiteSpaces(value) {
			return value.trim().replace(/\s/g, "");
		},
		submitForm() {
			this.$store.dispatch('sendEmail', {
				name: this.name,
				email: this.email,
				subject: this.subject,
				message: this.message
			});
		}
	},
	computed: {
		year() {
			return new Date().getFullYear();
		},
		response() {
			return this.$store.getters['response'];
		}
	}
};
</script>

<style lang="scss">
footer {
	background: #181818;
	margin-top: -1px;

	.description, p {
		color: #696969;
		line-height: 24px;
		margin: 0;
	}

	.footer-top {
		padding: 7.9375rem 0 5.4375rem;

		@media (max-width: 991.98px) {
			padding: 3.75rem 0;
		}

		@media (max-width: 575.98px) {
			padding-bottom: 2.5rem;
		}

		&:after {
			content: '';
			display: block;
			height: 100%;
			width: 1px;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			background-color: #222;

			@media (max-width: 991.98px) {
				display: none;
			}
		}

		.description {
			&:after {
				content: '';
				display: block;
				width: 35px;
				height: 2px;
				margin-top: 1.5rem;
				background: #fff;
			}

			p {
				padding-bottom: 1.0625rem;
				letter-spacing: .1px;
				margin-bottom: 0.3125rem;
				font-family: 'GFS Didot', serif;

				&:before {
                    content: "“";
                }
                
                &:after {
                    content:"”"
                }
			}
		}

		.address {
			ul {
				padding: 2.5rem 0 2.8125rem;

				li,a {
					color: #fff;
					font-size: 0.625rem;
					line-height: 24px;
					letter-spacing: 2px;
					margin-bottom: 1rem;

					&:last-child {
						margin-bottom: 0;
					}

					.icon-square {
						width: 31px;
						min-width: 31px;
						max-width: 31px;
						height: 31px;
						border: 1px solid #222;

						svg {
							path {
								fill: #383838;
								transition: fill .3s ease;
							}
						}
					}

					&:hover {
						.icon-square {
							svg {
								path {
									fill: #fff;
								}
							}
						}
					}
				}
			}
		}

		.contact {
			@media (max-width: 991.98px) {
				padding-top: 1.875rem;
				border-top: 1px solid #222;
			}

			h3 {
				letter-spacing: 4px;
				line-height: 24px;
				margin-bottom: 0.625rem;

				&:after {
					background: #fff;
				}
			}

			p {
				font-size: 1.125rem;

				@media (max-width: 767.98px) {
					font-size: 1.0625rem;
				}

				@media (max-width: 575.98px) {
					font-size: 1rem;
				}

				small {
					font-size: .75rem;
				}

				i,svg {
					font-size: 1.5rem;
					color: #fff;
				}
			}
		}

		.form {
			margin-top: 3.75rem;

			.form-control,
			.form-control:-webkit-autofill,
			.form-control:-webkit-autofill:hover, 
			.form-control:-webkit-autofill:focus, 
			.form-control:-webkit-autofill:active {
				height: 46px;
				line-height: 44px;
				border: 1px solid #222;
				background: transparent;
				-webkit-text-fill-color: #fff;
				-webkit-box-shadow: 0 0 0px 1000px #181818 inset;
				color: #585858;
				padding: 0 1.125rem;
				margin: 0.46875rem 0;

				&::-webkit-input-placeholder { /* Edge */
					color: #585858;
				}

				&:-ms-input-placeholder { /* Internet Explorer 10-11 */
					color: #585858;
				}

				&::placeholder {
					color: #585858;
				}

				&:focus:not(button) {
					border-color: #999;
				}

				&.error {
					color: #842029;
					background: #f8d7da;
					border-color: #f5c2c7;
					-webkit-text-fill-color: #842029;
					-webkit-box-shadow: 0 0 0px 1000px #f8d7da inset;
				}
			}

			textarea.form-control {
				height: 194px;
				resize: none;
				line-height: 1.42857143;
				padding-top: 1.125rem;
				padding-bottom: 1.125rem;
			}

			button.form-control {
				font-size: 0.75rem;
				line-height: 37px;
				padding: 0 1.40625rem;
				letter-spacing: 2px;
				border: 2px solid #222;
				transition: all .3s;
				background: transparent;

				&:hover {
					background: #222;
				}
			}

			span.error {
				font-size: 0.75rem;
			}
		}
	}

	.footer-bottom {
		border-top: 1px solid #222;

		p {
			font-size: 0.625rem;
			letter-spacing: 2px;

			i {
				font-size: 1.5rem;
			}
		}

		.social {
			ul {
				li {
					border-right: 1px solid #3c3c3c;

					&:last-child {
						border: 0;
					}

					a {
						transition: color .3s ease;
						color: #696969;

						&:hover {
							color: #fff;
						}
					}
				}
			}
		}
	}
}
</style>
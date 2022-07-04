<template>
	<div>
		<transition name="fade">
			<loader v-show="loading"></loader>
		</transition>
		<div v-if="objData && logo && events && footerData && whiteLogo">
			<inner-header ref="header" :events="events" :logo="logo"></inner-header>
			<section class="inner-page pt-4 pb-5">
				<div class="container-fluid">
					<div class="row align-items-center">
						<div class="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
							<div class="bg-img" v-if="objData.metadata.banner" v-lazy:background-image="objData.metadata.banner.url"></div>
						</div>
						<div v-if="objData.metadata" class="col-xl-2 info mt-3 mt-xl-0 text-center text-xl-start">
							<p v-if="objData.metadata.location"><strong>τοποθεσία:</strong> {{objData.metadata.location}}</p>
							<p v-if="objData.metadata.date"><strong>ημερομηνία:</strong> {{objData.metadata.date}}</p>
							<p v-if="objData.metadata.time"><strong>ώρα:</strong> {{objData.metadata.time}}</p>
							<p v-if="objData.metadata.organization"><strong>διοργάνωση:</strong> {{objData.metadata.organization}}</p>
						</div>
					</div>
				</div>
				<div class="container">
					<div class="row">
						<div class="col-12">
							<h1 class="section-title underline mt-4 mt-xl-0 mb-4 text-center">{{objData.title}}</h1>
						</div>
					</div>
					<div class="row">
						<div class="col-12 text-center" v-html="objData.content"></div>
					</div>
					<div class="row mt-4 mt-md-5 mb-4" v-if="objData.metadata">
						<div class="col-lg-7 mb-5 mb-lg-0">
							<img alt="Χάρτης Τοποθεσιών" v-if="objData.metadata.map" v-lazy="objData.metadata.map.url">
						</div>
						<div class="col-lg-5">
							<h3 class="pb-3 underline section-title mb-0">ΦΟΡΜΑ ΣΥΜΜΕΤΟΧΗΣ</h3>
							<div v-if="objData.metadata.form_text" v-html="objData.metadata.form_text"></div>
							<div class="form mt-4">
								<form @submit.prevent="submitForm" novalidate>
									<div class="mb-3">
										<input :disabled="registration && registration.status === 'success'" class="form-control rounded-0" placeholder="Ονοματεπώνυμο" v-model="name" name="name" type="text">
										<span class="d-block error text-danger" v-if="registration && registration.status === 'error' && errorMessage('name', registration)">{{errorMessage('name', registration)}}</span>
									</div>
									<div class="mb-3">
										<input @keypress="validateNumber" minlength="10" maxlength="10" :disabled="registration && registration.status === 'success'" class="form-control rounded-0" placeholder="Τηλέφωνο" v-model="phone" name="phone" type="text">
										<span class="d-block error text-danger" v-if="registration && registration.status === 'error' && errorMessage('phone', registration)">{{errorMessage('phone', registration)}}</span>
									</div>
									<div class="mb-3 error">
										<Select2 
											:disabled="registration && registration.status === 'success'" 
											:options="values" 
											v-model="members" 
											name="members"
											placeholder="Αριθμός Ατόμων"
											:settings=" {minimumResultsForSearch: -1, selectionCssClass:'filters-selection', dropdownCssClass: 'filters-dropdown', theme: 'filters', width: '100%'}">
										</Select2>
										<span class="d-block error text-danger" v-if="registration && registration.status === 'error' && errorMessage('members', registration)">{{errorMessage('members', registration)}}</span>
									</div>
									<div class="mt-4 d-flex justify-content-end">
										<button :class="{disabled: registration && registration.status === 'success'}" :disabled="registration && registration.status === 'success'" class="form-control btn shadow-none rounded-0 my-0 w-auto">ΑΠΟΣΤΟΛΗ</button>
									</div>
								</form>
								<div class="alert alert-success mb-0 mt-4" v-if="registration && registration.status === 'success'" role="alert">{{registration.text}} <i class="bi bi-emoji-wink"></i></div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<inner-footer ref="contact" :obj-data="footerData" :logo="whiteLogo"></inner-footer>
			<modal :objData="objData"></modal>
		</div>
		<ShareNetwork
			class="share-btns position-fixed"
			network="facebook"
			url="https://sarmaniata.gr/paixnidi">
			<span class="share-facebook d-flex justify-content-center align-items-center">
				<font-awesome-icon icon="fa-brands fa-facebook-f" />
			</span>
		</ShareNetwork>
	</div>
</template>

<script>
import Loader from '../components/Loader.vue';
import InnerHeader from '../components/InnerHeader.vue';
import { EventBus } from '../plugins/v-event-bus.js';
import Modal from '../components/Modal.vue';
import InnerFooter from '../components/InnerFooter.vue';

export default {
	components: {
		Loader,
		InnerHeader,
		Modal,
		InnerFooter
	},
	data() {
		return {
			name: '',
			phone: '',
			members: null,
			title: '',
			loading: false,
			values: [
				{
					id: 1,
					text: '1 άτομο'
				},
				{
					id: 2,
					text: '2 άτομα'
				},
				{
					id: 3,
					text: '3 άτομα'
				},
				{
					id: 4,
					text: '4 άτομα'
				},
				{
					id: 5,
					text: '5 άτομα'
				},
			]
		};
	},
	head() {
		return {
			titleTemplate: `%s | ${this.title}`,
			meta: [
				{
					property: 'og:url',
				},
				{
					property: 'og:title', 
					content: 'Sarmaniata | Παιχνίδι'
				},
				{
					property: 'og:description', 
					content: 'Ομάδα για τη φύση και τον πολιτισμό της Σαμαρίνας'
				},
				{	
					property: 'og:image', 
					content: 'https://sarmaniata.gr/summer.jpg'
				},
				{
					property: 'og:image:alt', 
					content: 'Ομάδα για τη φύση και τον πολιτισμό της Σαμαρίνας'
				},
				{
					property: 'og:image:secure_url',
					content: 'https://sarmaniata.gr/summer.jpg'
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
					content: 'Sarmaniata | Παιχνίδι'
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
					content: 'https://sarmaniata.gr/summer.jpg'
				}
			]
		}
	},
	created() {
		(this.$nuxt || EventBus || this.$EventBus).$on('resetRegistrationForm', () => {
			this.name = '';
			this.phone = '';
			this.members = [];
		});
	},
	async created() {
		this.loading = true;
		await this.fetchData();
		await this.fetchEventsData();
		await this.fetchLogo();
		await this.fetchFooterData();
		await this.fetchWhiteLogo();
		this.loading = false;
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
		submitForm() {
			this.$store.dispatch('register', {
				name: this.name,
				phone: this.phone,
				members: this.members
			});
		},
		validateNumber(event) {
			const theEvent = event || window.event;

			// Handle paste
			if (theEvent.type === 'paste') {
				key = event.clipboardData.getData('text/plain');
			} else {
				// Handle key press
				var key = theEvent.keyCode || theEvent.which;
				key = String.fromCharCode(key);
			}
			const regex = /[0-9]|\./;
			if( !regex.test(key) ) {
				theEvent.returnValue = false;
				if(theEvent.preventDefault) theEvent.preventDefault();
			}
		},
		fetchData() {
			this.$store.dispatch('fetchContent', {
				id: '62496e991ce5640009e3c000',
				props: 'title,content,thumbnail,metadata'
			});   
		},
		fetchLogo() {
			this.$store.dispatch('fetchLogo');
		},
		fetchEventsData() {
			this.$store.dispatch('fetchEvents', {
				id: '622e1ef3bbb43300095a3890',
				props: 'metadata'
			});   
		},
		fetchFooterData() {
			this.$store.dispatch('fetchFooterContent', {
				props: 'title,content,metadata'
			});   
		},
		fetchWhiteLogo() {
			this.$store.dispatch('fetchWhiteLogo');
		}
	},
	computed: {
		registration() {
			return this.$store.getters['registration'];
		},
		objData() {
			return this.$store.getters['objData'];
		},
		logo() {
			return this.$store.getters['logo'];
		},
		events() {
			return this.$store.getters['events'];
		},
		footerData() {
			return this.$store.getters['footerData'];
		},
		whiteLogo() {
			return this.$store.getters['whiteLogo'];
		}
	},
	watch: {
		objData(value) {
			this.title = value.title;
		}
	}
};
</script>

<style lang="scss">
p a, p a:hover {
	color: inherit;
}

.form {
	.form-control,
	.form-control:-webkit-autofill,
	.form-control:-webkit-autofill:hover, 
	.form-control:-webkit-autofill:focus, 
	.form-control:-webkit-autofill:active {
		height: 46px;
		line-height: 44px;
		border: 1px solid #181818;
		background: transparent;
		-webkit-text-fill-color: #181818;
		-webkit-box-shadow: 0 0 0px 1000px #fff inset;
		color: #181818;
		padding: 0 1.125rem;

		&::-webkit-input-placeholder { /* Edge */
			color: #181818;
		}

		&:-ms-input-placeholder { /* Internet Explorer 10-11 */
			color: #181818;
		}

		&::placeholder {
			color: #181818;
		}

		&:focus:not(button) {
			border-color: #999;
		}
	}

	button.form-control {
		font-size: 0.75rem;
		line-height: 37px;
		padding: 0 1.40625rem;
		letter-spacing: 2px;
		border: 1px solid #222;
		transition: all .3s;
		background: transparent;
		-webkit-text-fill-color: #181818;

		&:hover {
			background: #222;
			color: #fff;
			-webkit-text-fill-color: #fff;
		}
	}

	input[type=number]::-webkit-inner-spin-button, 
	input[type=number]::-webkit-outer-spin-button {
		opacity: 1;
	}

	span.error {
		font-size: 0.75rem;
		margin-top: 0.46875rem;
	}
}

.select2-container--filters {
    .select2-selection--single {
        height: 46px;

        .select2-selection__rendered {
            padding-left: 1.125rem;
            padding-right: calc(17px + (1.125rem * 2));
            border-radius: 4px;
            color: #181818;
            border: 1px solid #181818;
            padding-top: 0;
            padding-bottom: 0;
            border-radius: 0;
            line-height: 46px
        }

        .select2-selection__arrow {
            top: 50%;
            transform: translateY(-50%);
            right: 1.125rem;
            pointer-events: none;
            color: #014257;
            font-size: 1.0625rem;
            position: absolute;

            &:before {
                content: "\f282";
                display: inline-block;
                font-family: bootstrap-icons !important;
                font-style: normal;
                font-weight: normal !important;
                font-variant: normal;
                text-transform: none;
                line-height: 1;
                vertical-align: -0.125em;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }
    }

    .filters-dropdown {
        border-color: #181818;
        border-radius: 0;
        z-index: 1000;
        background-color: #fff !important;

        .select2-results__options {
            .select2-results__option {
                color: #181818;
                padding: 6px 1.125rem !important;

                &.select2-results__option--highlighted {
                    color: #fff;
                    background-color: #181818;
                }
            }
        }
    }
}
</style>
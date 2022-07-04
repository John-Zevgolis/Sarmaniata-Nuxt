export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'el',
      prefix: 'og: http://ogp.me/ns#'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Ομάδα για τη φύση και τον πολιτισμό της Σαμαρίνας. Sots tr loclu si tr politizmolu di Samarina. Since 2022...' },
      { hid: 'keywords', name: 'keywords', content: 'sarmaniata, samarina, festival, σαμαρινα, φεστιβαλ' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preload', as: 'font', type: 'font/woff', href: '/fonts/OpenSans-Bold.woff', crossorigin: 'anonymus' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/OpenSans-Bold.woff2', crossorigin: 'anonymus' },
      { rel: 'preload', as: 'font', type: 'font/woff', href: '/fonts/OpenSans-Regular.woff', crossorigin: 'anonymus' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/OpenSans-Regular.woff2', crossorigin: 'anonymus' },
      { rel: 'preload', as: 'font', type: 'font/woff', href: '/fonts/GFSDidot-Regular.woff', crossorigin: 'anonymus' },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/GFSDidot-Regular.woff2', crossorigin: 'anonymus' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/css/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/v-event-bus.js',
    '~plugins/v-route.js',
    { src: '~plugins/v-isotope.js', ssr: false },
    { src: '~plugins/v-imagesLoaded.js', ssr: false },
    { src: '~plugins/v-lightbox.js', ssr: false },
    { src: '~plugins/v-lazyload.js', ssr: false },
    { src: '~plugins/v-social-sharing.js', ssr: false },
    { src: '~plugins/v-select2.js', ssr: false },
    { src: '~plugins/v-bootstrap-modal.js', ssr: false },
    { src: '~plugins/v-google-maps.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/fontawesome',
    'nuxt-gsap-module'
  ],

  gsap: {
    extraPlugins: {
      scrollTrigger: true
    }
  },

  fontawesome: {
    icons: {
      brands: ['faFacebookF', 'faTwitter', 'faAtlassian'],
      solid: ['faLocationDot', 'faPhone', 'faEnvelope']
    }
  },

  styleResources: {
    scss: [
      '~assets/scss/mixins.scss',
      '~assets/scss/variables.scss'
    ]
  },

  modules: [
    '@nuxtjs/google-gtag',
    '@nuxtjs/axios'
  ],

  'google-gtag': {
    id: 'G-277J88E107',
    debug: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  },

  router: {
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    base: process.env.BASE_URL
  },

  axios: {
    baseURL: '/'
  }
}

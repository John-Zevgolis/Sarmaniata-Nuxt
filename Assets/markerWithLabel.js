import {
  MapElementFactory
} from 'vue2-google-maps'
import
MarkerWithLabel
  from 'markerwithlabel'

export default MapElementFactory({
  name: 'markerWithLabel',
  ctr: function ctr () {
    if (typeof MarkerWithLabel === 'undefined') {
      /* eslint-disable no-console */
      console.error('MarkerWithLabel is not installed! require() it or include it from https://www.npmjs.com/package/markerwithlabel')
      throw new Error('MarkerWithLabel is not installed! require() it or include it from https://www.npmjs.com/package/markerwithlabel')
    }
    return MarkerWithLabel(window.google.maps)
  },
  //// The following is optional, but necessary if the constructor takes multiple arguments
  //// e.g. for GroundOverlay
  // ctrArgs: (options, otherProps) => [options],
  events: ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'],

  // Mapped Props will automatically set up
  //   this.$watch('propertyName', (v) => instance.setPropertyName(v))
  //
  // If you specify `twoWay`, then it also sets up:
  //   google.maps.event.addListener(instance, 'propertyName_changed', () => {
  //     this.$emit('propertyName_changed', instance.getPropertyName())
  //   })
  //
  // If you specify `noBind`, then neither will be set up. You should manually
  // create your watchers in `afterCreate()`.
  mappedProps: {
    animation: {
      twoWay: true,
      type: Number
    },
    attribution: {
      type: Object
    },
    clickable: {
      type: Boolean,
      twoWay: true,
      default: true
    },
    cursor: {
      type: String,
      twoWay: true
    },
    draggable: {
      type: Boolean,
      twoWay: true,
      default: false
    },
    icon: {
      twoWay: true
    },
    label: {},
    labelAnchor: {
      type: Object,
      noBind: true
    },
    labelClass: {
      type: String,
      noBind: true
    },
    labelContent: {
      type: String,
      noBind: true
    },
    labelInBackground: {
      type: Boolean,
      noBind: true,
      default: false
    },
    labelStyle: {
      type: Object,
      noBind: true
    },
    labelVisible: {
      type: Boolean,
      noBind: true,
      default: true
    },
    opacity: {
      type: Number,
      default: 1
    },
    options: {
      type: Object
    },
    place: {
      type: Object
    },
    position: {
      type: Object,
      twoWay: true
    },
    shape: {
      type: Object,
      twoWay: true
    },
    title: {
      type: String,
      twoWay: true
    },
    zIndex: {
      type: Number,
      twoWay: true
    },
    visible: {
      twoWay: true,
      default: true
    }
    //// If you have a property that comes with a `_changed` event,
    //// you can specify `twoWay` to automatically bind the event, e.g. Map's `zoom`:
    // zoom: {type: Number, twoWay: true}
  },
  // Inject function
  inject: {
    '$clusterPromise': {
      default: null
    }
  },
  props: {},
  // Any other properties you want to bind. Note: Must be in Object notation
  // Actions you want to perform before creating the object instance using the
  // provided constructor (for example, you can modify the `options` object).
  // If you return a promise, execution will suspend until the promise resolves
  render (h) {
    if (!this.$slots.labelContent) {
      return ''
    } else if (this.$slots.labelContent.length === 1) {
      return this.$slots.labelContent[0]
    }

    if (!this.$slots.default || this.$slots.default.length === 0) {
      return ''
    } else if (this.$slots.default.length === 1) { // So that infowindows can have a marker parent
      return this.$slots.default[0]
    } else {
      return h(
        'div',
        this.$slots.default
      )
    }
  },

  destroyed () {
    if (!this.$markerWithLabelObject) {
      return
    }

    if (this.$clusterObject) {
      // Repaint will be performed in `updated()` of cluster
      this.$clusterObject.removeMarker(this.$markerWithLabelObject, true)
    } else {
      this.$markerWithLabelObject.setMap(null)
    }
  },

  mounted () {
    const el = this.$refs.flyawayMWL
    el.parentNode.removeChild(el)
  },

  beforeCreate (options) {
    if (this.$slots.labelContent) {
      options.labelContent = this.$refs.flyawayMWL
    }

    if (this.$clusterPromise) {
      options.map = null
    }
    return this.$clusterPromise
  },

  methods: {
    _labelAnchor () {
      if (this.labelAnchor) {
        /* Thanks to: https://stackoverflow.com/questions/25165511/how-we-set-marker-label-content-by-javascript-in-google-map-api */
        this.$markerWithLabelObject.set('labelAnchor', this.labelAnchor)
      }
    },
    _labelContent () {
      if (this.labelContent) {
        this.$markerWithLabelObject.set('labelContent', this.labelContent)
      }
    },
    _labelClass () {
      if (this.labelClass) {
        this.$markerWithLabelObject.set('labelClass', this.labelClass)
      }
    },
    _labelInBackground () {
      if (this.labelInBackground) {
        this.$markerWithLabelObject.set('labelInBackground', this.labelInBackground)
      }
    },
    _labelStyle () {
      if (this.labelStyle) {
        this.$markerWithLabelObject.set('labelStyle', this.labelStyle)
      }
    },
    _labelVisible () {
      if (this.labelVisible) {
        this.$markerWithLabelObject.set('labelVisible', this.labelVisible)
      }
    }
  },

  afterCreate (inst) {
    if (this.$clusterPromise) {
      this.$clusterPromise.then((co) => {
        co.addMarker(inst)
        this.$clusterObject = co
      })
    }
    this.$watch('labelAnchor', () => {
      this._labelAnchor()
    })
    this.$watch('labelClass', () => {
      this._labelClass()
    })
    this.$watch('labelContent', () => {
      this._labelContent()
    })
    this.$watch('labelInBackground', () => {
      this._labelInBackground()
    })
    this.$watch('labelStyle', () => {
      this._labelStyle()
    })
    this.$watch('labelVisible', () => {
      this._labelVisible()
    })
  }
})
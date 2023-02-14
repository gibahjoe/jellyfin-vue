import Vue from 'vue';
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import draggable from 'vuedraggable';
// @ts-expect-error - target typing doesn't exist as we declared it in params.
import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Swiper from 'swiper';
import 'swiper/css/swiper.css';
import {VueKeyboardTrapDirectivePlugin} from '@pdanpdan/vue-keyboard-trap';

declare module 'vue/types/vue' {
  interface Vue {
    $swiper: Swiper;
  }
}
Vue.use(VueAwesomeSwiper);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('Draggable', draggable);
Vue.component('DynamicScroller', DynamicScroller);
Vue.component('DynamicScrollerItem', DynamicScrollerItem);
Vue.use(VueKeyboardTrapDirectivePlugin, {
  // snake-case name of the directive (without `v-` prefix)
  // name: 'kbd-trap',

  // CSS selector for focusable elements
  focusableSelector: [
    ':focus',
    'a[href]',
    'a[href]:not([tabindex^="-"])',
    'area[href]:not([tabindex^="-"])',
    'input:not([disabled]):not([tabindex^="-"])',
    'select:not([disabled]):not([tabindex^="-"])',
    'textarea:not([disabled]):not([tabindex^="-"])',
    'button:not([disabled]):not([tabindex^="-"])',
    'iframe:not([tabindex^="-"])',
    '[tabindex]:not([tabindex^="-"])',
    '[contenteditable]:not([tabindex^="-"]):not([contenteditable="false"])',
    '[class*="focusable"]:not([disabled]):not([tabindex^="-"])'
  ].join(','),

  // CSS selector for elements that should not respond to roving key navigation
  rovingSkipSelector: [
    '.top-carousel > *', // exclude top carousel
    '.v-menu__content', // Exclude menu content
    'input:not([disabled]):not([type="button"]):not([type="checkbox"]):not([type="file"]):not([type="image"]):not([type="radio"]):not([type="reset"]):not([type="submit"])',
    'select:not([disabled])',
    'select:not([disabled]) *',
    'textarea:not([disabled])',
    '[contenteditable]:not([contenteditable="false"])',
    '[contenteditable]:not([contenteditable="false"]) *'
  ].join(','),
  // CSS selector that will be applied in .roving.grid mode to exclude elements - must be a series of :not() selectors
  gridSkipSelector: [
    '.top-carousel > *',
    ':not([disabled])',
    ':not([tabindex^="-"])'
  ].join(''),

  // CSS selector for the elements that should be autofocused
  autofocusSelector: [
    '[autofocus]:not([disabled]):not([autofocus="false"])',
    '[data-autofocus]:not([disabled]):not([data-autofocus="false"])'
  ].join(','),

  // tabIndex value to be used when trap element has a tabIndex of -1 and has no `tabindex` attribute
  trapTabIndex: -9999
});

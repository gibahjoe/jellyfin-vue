import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import draggable from 'vuedraggable';
// @ts-expect-error - target typing doesn't exist as we declared it in params.
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Swiper from 'swiper';
import 'swiper/css/swiper.css';

// @ts-expect-error - target typing doesn't exist in npm
import vjsn from 'vue-js-spatial-navigation';

declare module 'vue/types/vue' {
  interface Vue {
    $swiper: Swiper;
  }
}

const config = {
  // selector: 'a[href]',
  straightOnly: false,
  straightOverlapThreshold: 0.5,
  rememberSource: false,
  disabled: false,
  defaultElement: '',
  enterTo: '',
  leaveFor: null,
  restrict: 'self-first',
  tabIndexIgnoreList:
    'a, input, select, textarea, button, iframe, [contentEditable=true]',
  navigableFilter: (e: HTMLElement): boolean => {
    if (e?.parentElement?.parentElement?.classList?.contains('card-overlay')) {
      return false;
    }

    return true;
  },
  scrollOptions: { behavior: 'smooth', block: 'center' }
};

Vue.use(vjsn, config);
Vue.use(VueAwesomeSwiper);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('Draggable', draggable);
Vue.component('DynamicScroller', DynamicScroller);
Vue.component('DynamicScrollerItem', DynamicScrollerItem);

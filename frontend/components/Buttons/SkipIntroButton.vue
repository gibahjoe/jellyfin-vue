<template>
  <div>
    <v-btn
      v-show="show"
      ref="skipIntro"
      v-focus
      icon
      outlined
      rounded
      large
      min-width="12em"
      class="fill-on-hover my-2 py-2"
      @click="skipIntro()"
    >
      <span>Skip Intro <v-icon size="32">mdi-skip-next</v-icon></span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapStores } from 'pinia';
import { playbackManagerStore } from '~/store';
import { IntroSkipperResponse } from '~/plugins/nuxt/apiPlugin';

export default Vue.extend({
  props: {
    intro: {
      type: Object as PropType<IntroSkipperResponse>,
      required: true
    }
  },
  data() {
    return {
      skipIntroClicked: false
    };
  },
  computed: {
    ...mapStores(playbackManagerStore),
    show(): boolean {
      if (this.skipIntroClicked) {
        return false;
      }

      if (!this.intro) {
        return false;
      }

      return (
        (this.playbackManager?.currentTime || 0) >=
          this.intro.ShowSkipPromptAt &&
        (this.playbackManager?.currentTime || 0) <= this.intro.HideSkipPromptAt
      );
    }
  },
  watch: {},
  methods: {
    skipIntro() {
      this.skipIntroClicked = true;
      this.playbackManager.changeCurrentTime(this.intro.IntroEnd);
    }
  }
});
</script>

<style lang="scss" scoped>
.fill-on-hover {
  position: relative;
  overflow: hidden;
}

.fill-on-hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  transition: width ease-out;
}

.fill-on-hover:hover::before {
  width: 100%;
  transition-duration: 3s;
}

.fill-on-hover span {
  position: relative;
  z-index: 1;
}
</style>

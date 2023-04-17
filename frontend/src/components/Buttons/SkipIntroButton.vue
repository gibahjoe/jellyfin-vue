<template>
  <v-slide-y-reverse-transition>
    <v-btn
      v-if="show"
      ref="btn"
      variant="outlined"
      :size="props.large ? 'large' : 'small'"
      :style="{
        '--transition-duration': `${visibleDuration}s`,
        '--fade-duration': `1s`,
        bottom: props.large ? '21%' : '8%'
      }"
      class="skip-intro"
      :class="{
        'mr-10': props.large,
        'ma-4': props.large,
        'ma-1': !props.large
      }"
      @click="skipIntro()"
      @mouseenter="onMouseEnter()"
      @mouseleave="onMouseLeave()">
      Skip Intro
      <template v-if="props.large" #append>
        <v-icon size="32"> <i-mdi-skip-next /></v-icon>
      </template>
    </v-btn>
  </v-slide-y-reverse-transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { playbackManagerStore } from '@/store';
import { PlaybackStatus } from '@/store/playbackManager';
import { IntroSkipperResponse } from 'types/global/plugins';

const playbackManager = playbackManagerStore();
const btn = ref<HTMLElement | undefined>(undefined);

// props
const props = defineProps<{
  intro: IntroSkipperResponse;
  large?: boolean;
}>();

// vars
let hover = ref(false);
let visibleDuration =
  (props.intro?.HideSkipPromptAt || 0) - (props.intro?.ShowSkipPromptAt || 0);

// computed
const visibleDurationLeft = computed((): number => {
  return props.intro.HideSkipPromptAt - (playbackManager?.currentTime || 0);
});
const show = computed((): boolean => {
  if (!props.intro) {
    return false;
  }

  if (hover.value) {
    return (playbackManager?.currentTime || 0) < props.intro.IntroEnd;
  }

  return (
    (playbackManager?.currentTime || 0) >= props.intro.ShowSkipPromptAt &&
    (playbackManager?.currentTime || 0) <= props.intro.HideSkipPromptAt
  );
});

watch(show, () => {
  if (show.value) {
    animate();
  } else {
    unanimate();
  }
});

watch(
  () => playbackManager.status,
  (state) => {
    switch (state) {
      case PlaybackStatus.Playing: {
        if (show.value && !hover.value) {
          animate();
        }

        break;
      }
      case PlaybackStatus.Stopped: {
        unanimate();
        break;
      }
    }
  }
);

// methods
const skipIntro = (): void => {
  playbackManager.currentTime = props.intro.IntroEnd;
};
const animate = (): void => {
  setTimeout(() => {
    const button = btn.value;

    button?.style?.setProperty(
      '--transition-duration',
      visibleDurationLeft.value + 's'
    );
    button?.classList?.remove('deanimate');
    button?.classList?.add('animate');
  }, 500);
};
const unanimate = (): void => {
  const button = btn.value;

  button?.classList?.remove('animate');
  button?.classList?.add('deanimate');
};
const onMouseEnter = (): void => {
  unanimate();
  hover.value = true;
};
const onMouseLeave = (): void => {
  animate();
  hover.value = false;
};
</script>

<style lang="scss" scoped>
.skip-intro {
  overflow: hidden;
  z-index: 9999;
  right: 3%;
  position: absolute;
}

.skip-intro::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  opacity: 0.9 !important;
  height: 100%;
  background-color: var(--v-primary-base);
  transition: width ease-out;
}

.skip-intro.animate::before {
  width: 100%;
  transition-duration: var(--transition-duration);
}

.skip-intro.deanimate::before {
  width: 0;
  transition-duration: var(--fade-duration);
}

/* Media query for screen sizes up to 600px (sm) */
@media (max-width: 600px) {
  .skip-intro {
    bottom: 25%;
  }
}
</style>

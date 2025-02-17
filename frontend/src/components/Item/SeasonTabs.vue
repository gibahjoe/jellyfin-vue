<template>
  <div>
    <v-tabs
      v-model="currentTab"
      v-focus-section:season-tab="{
        leaveFor: { down: '@season-episodes', left: '@nav' }
      }"
      class="mb-3"
      bg-color="transparent">
      <v-tab v-for="season in seasons" :key="season.Id" v-focus>
        {{ season.Name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="currentTab" class="bg-transparent">
      <v-window-item v-for="season in seasons" :key="season.Id">
        <v-list
          v-if="seasonEpisodes && season.Id"
          v-focus-section:season-episodes="{
            leaveFor: { up: '@season-tab', down: '@season-tab', left: '@nav' }
          }"
          :lines="false"
          bg-color="transparent">
          <v-list-item
            v-for="episode in seasonEpisodes[season.Id]"
            :key="episode.Id"
            v-focus
            @click="viewDetails($router, episode)">
            <v-row align="center" class="my-4">
              <v-col
                :class="{ 'py-1': $vuetify.display.smAndDown }"
                cols="12"
                md="4">
                <card
                  :class="{ 'mx-8 mt-8': $vuetify.display.smAndDown }"
                  :item="episode" />
              </v-col>
              <v-col
                :class="{ 'py-1': $vuetify.display.smAndDown }"
                cols="12"
                md="8">
                <v-list-item-title class="text-wrap">
                  {{ episode.IndexNumber }}. {{ episode.Name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-wrap">
                  {{ episode.Overview }}
                </v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import {
  BaseItemDto,
  BaseItemPerson,
  ItemFields
} from '@jellyfin/sdk/lib/generated-client';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api';
import { getTvShowsApi } from '@jellyfin/sdk/lib/utils/api/tv-shows-api';
import { ref, watch } from 'vue';
import { Router } from 'vue-router';
import { getItemDetailsLink } from '@/utils/items';
import { useRemote } from '@/composables';

interface TvShowItem {
  /**
   * seasons: Stores an array of all seasons
   */
  seasons: BaseItemDto[];
  /**
   * seasonEpisodes: Stores an array for each season containing all the season episodes
   */
  seasonEpisodes: { [key: string]: BaseItemDto[] };
}

const props = defineProps<{ item: BaseItemDto }>();
const remote = useRemote();
const currentTab = ref(0);
const seasons = ref<BaseItemDto[] | null | undefined>([]);
const seasonEpisodes = ref<TvShowItem['seasonEpisodes']>({});

/**
 * Fetch component data
 */
async function fetch(): Promise<void> {
  if (!props.item.Id) {
    return;
  }

  seasons.value = (
    await remote.sdk.newUserApi(getTvShowsApi).getSeasons({
      userId: remote.auth.currentUserId,
      seriesId: props.item.Id
    })
  ).data.Items;

  if (seasons.value) {
    for (const season of seasons.value) {
      if (season.Id) {
        const episodes = (
          await remote.sdk.newUserApi(getItemsApi).getItems({
            userId: remote.auth.currentUserId,
            parentId: season.Id,
            fields: [ItemFields.Overview, ItemFields.PrimaryImageAspectRatio]
          })
        ).data;

        if (episodes.Items) {
          seasonEpisodes.value[season.Id] = episodes.Items;
        }
      }
    }
  }
}

/**
 * Navigates to the episode details.
 */
function viewDetails(router: Router, item: BaseItemDto | BaseItemPerson): void {
  router.push(getItemDetailsLink(item));
}

await fetch();
watch(props, async () => {
  await fetch();
});
</script>
<style lang="scss" scoped>
button.v-tab:focus,
button.v-tab:focus-visible {
  outline: none !important;
  color: white !important;
  background-color: rgb(var(--v-theme-primary)) !important;
}
</style>

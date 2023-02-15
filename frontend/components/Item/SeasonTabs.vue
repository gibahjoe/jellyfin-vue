<template>
  <div>
    <v-tabs v-model="currentTab" class="mb-3" background-color="transparent">
      <v-tab v-for="season in seasons" :key="season.Id" v-focus>
        {{ season.Name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentTab" class="transparent">
      <v-tab-item v-for="season in seasons" :key="season.Id">
        <DynamicScroller
          :items="seasonEpisodes[season.Id]"
          :key-field="'Id'"
          :min-item-size="350"
          class="list-container"
        >
          <template #default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
            >
              <v-list-item
                :key="item.Id"
                v-focus
                class="flex-column flex-md-row"
                nuxt
                :to="getItemDetailsLink(item)"
              >
                <v-list-item-avatar tile width="20em" height="12em">
                  <blurhash-image
                    v-if="item.ImageTags && item.ImageTags.Primary"
                    :item="item"
                    :alt="item.Name"
                  />
                  <watched-indicator v-if="item.UserData.Played" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-wrap">
                    {{ item.IndexNumber }}. {{ item.Name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    {{ item.Overview }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import {BaseItemDto, ItemFields} from '@jellyfin/client-axios';
import Vue from 'vue';
import {authStore} from '~/store';
import {getItemDetailsLink} from '~/utils/items';

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

export default Vue.extend({
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentTab: 0,
      breakpoints: {
        600: {
          visibleSlides: 2
        },
        960: {
          visibleSlides: 3
        },
        1264: {
          visibleSlides: 4
        },
        1904: {
          visibleSlides: 5
        }
      },
      seasons: [] as BaseItemDto[],
      seasonEpisodes: {} as TvShowItem['seasonEpisodes']
    };
  },
  async fetch() {
    const auth = authStore();
    const seasons = (
      await this.$api.tvShows.getSeasons({
        userId: auth.currentUserId,
        seriesId: this.item.Id
      })
    ).data.Items;

    const seasonEpisodes = {} as TvShowItem['seasonEpisodes'];

    if (seasons) {
      for (const season of seasons) {
        if (season.Id) {
          const episodes = (
            await this.$api.items.getItems({
              userId: auth.currentUserId,
              parentId: season.Id,
              fields: [ItemFields.Overview, ItemFields.PrimaryImageAspectRatio]
            })
          ).data;

          if (episodes.Items) {
            seasonEpisodes[season.Id] = episodes.Items;
          }
        }

        this.seasons = seasons;
        this.seasonEpisodes = seasonEpisodes;
      }
    }
  },
  methods: {
    getItemDetailsLink
  }
});
</script>

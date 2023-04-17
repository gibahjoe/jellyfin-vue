import 'vue-router';
// eslint-disable-next-line no-restricted-imports
import { RemotePlugin } from '@/plugins/remote/types';
import enUS from '@/../locales/en-US.json';
import 'vue-i18n';

/**
 * The object that represents RouteMeta is defined at @/plugins/vue/router/middleware/meta
 */
interface BackdropPayload {
  blurhash?: string;
  opacity?: number;
}
interface RouteTransition {
  enter: string;
  leave?: string;
}
declare module 'vue-router' {
  interface RouteMeta {
    readonly layout: string;
    transparentLayout?: boolean;
    transition?: RouteTransition;
    readonly admin: boolean;
    title?: string | null;
    backdrop: BackdropPayload;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    readonly $remote: RemotePlugin;
  }
}

declare module 'vue-i18n' {
  type messages = typeof enUS;
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefineLocaleMessage extends messages {}
}

export interface IntroSkipperResponse {
  EpisodeId: string;
  Valid: boolean;
  IntroStart: number;
  IntroEnd: number;
  ShowSkipPromptAt: number;
  HideSkipPromptAt: number;
}


/**
 * This is important: https://stackoverflow.com/a/64189046
 * https://www.typescriptlang.org/docs/handbook/modules.html
 */

export {};

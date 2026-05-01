import { defineAsyncComponent } from 'vue';

import VPLTheme from './tanaab-theme-core.js';
import TanaabLayout from './layout/TanaabLayout.vue';
import TMSBox from './components/TMSBox.vue';
import TMSGrid from './components/TMSGrid.vue';
import TMSHero from './components/TMSHero.vue';
import TMSList from './components/TMSList.vue';
import TMSLogo from './components/TMSLogo.vue';
import TMSSection from './components/TMSSection.vue';
import './styles/theme.scss';

const TMSComponentPlayground = defineAsyncComponent(
  () => import('./components/TMSComponentPlayground.vue'),
);

export default {
  ...VPLTheme,
  Layout: TanaabLayout,
  async enhanceApp(ctx) {
    if (typeof VPLTheme.enhanceApp === 'function') {
      await VPLTheme.enhanceApp(ctx);
    }

    ctx.app.component('TMSBox', TMSBox);
    ctx.app.component('TMSComponentPlayground', TMSComponentPlayground);
    ctx.app.component('TMSGrid', TMSGrid);
    ctx.app.component('TMSHero', TMSHero);
    ctx.app.component('TMSList', TMSList);
    ctx.app.component('TMSLogo', TMSLogo);
    ctx.app.component('TMSSection', TMSSection);
  },
};

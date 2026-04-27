import VPLTheme from './tanaab-theme-core.js';
import TanaabLayout from './layout/TanaabLayout.vue';
import TMSComponentDocDemo from './components/TMSComponentDocDemo.vue';
import TMSLogo from './components/TMSLogo.vue';
import TMSSection from './components/TMSSection.vue';
import './styles/theme.scss';

export default {
  ...VPLTheme,
  Layout: TanaabLayout,
  async enhanceApp(ctx) {
    if (typeof VPLTheme.enhanceApp === 'function') {
      await VPLTheme.enhanceApp(ctx);
    }

    ctx.app.component('TMSComponentDocDemo', TMSComponentDocDemo);
    ctx.app.component('TMSLogo', TMSLogo);
    ctx.app.component('TMSSection', TMSSection);
  },
};

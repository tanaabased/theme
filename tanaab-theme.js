import VPLTheme from './tanaab-theme-core.js';
import TanaabLayout from './layout/TanaabLayout.vue';
import TMSLogo from './components/TMSLogo.vue';
import './styles/theme.scss';

export default {
  ...VPLTheme,
  Layout: TanaabLayout,
  async enhanceApp(ctx) {
    if (typeof VPLTheme.enhanceApp === 'function') {
      await VPLTheme.enhanceApp(ctx);
    }

    ctx.app.component('TMSLogo', TMSLogo);
  },
};

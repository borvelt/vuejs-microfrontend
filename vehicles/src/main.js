import Vue from 'vue';
import VueRouter from 'vue-router';
import lowerCase from 'lodash/lowerCase';
import App from './App';
import Home from '@/components/Home';
// import VIP from '@/components/VIP';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const mountFrame = (frameName = 'vehicles', containerID = 'app') => {
  return new Vue({
    name: lowerCase(frameName),
    el: `#${containerID}`,
    router: new VueRouter({
      mode: 'history',
      base: '/vehicles',
      routes: [
        { path: '/home', component: Home },
        { path: '/vip', component: () => import('@/components/VIP') },
        // { path: '/vip', component: VIP },
      ],
    }),
    render() {
      return <App />;
    },
  })
};

if (process.env.NODE_ENV !== 'production') {
  mountFrame();
}

export default {
  mountVehiclesFrame: mountFrame,
};

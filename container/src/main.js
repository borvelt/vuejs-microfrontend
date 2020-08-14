import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import Frame from '@/frame';
import Home from '@/components/Home';
import LoadAsync from '@/components/LoadAsync';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const {
  VUE_APP_VEHICLES_HOST: vehiclesHost,
} = process.env;

new Vue({
  el: '#app',
  router: new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
      { path: '/', component: Home },
      { path: '/test*', component: LoadAsync },
      { path: '/vehicles*', component: () => Frame('vehicles', vehiclesHost) },
    ],
  }),
  render() {
    return <App />
  }
});

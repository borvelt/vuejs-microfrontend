import Vue from 'vue'
import VueRouter from 'vue-router';

export default () => new Promise(resolve => {
    console.log('loadAsync');
    const newInstanceOptions = {
      router: new VueRouter({
        mode: 'history',
        base: '/test',
        routes: [{
            path: '/oops',
            component: { render () { return <router-view /> } },
            children: [{
              path: 'first',
              component: { render () { return <div> first ooops </div>; } }
            }],
        }],
      }),
      render() {
        return <router-view />;
      }
    };
    const component = {
      mounted() {
        const newInstance = new Vue(newInstanceOptions);
        console.log(`$mount('#newInstance')`);
        this.$nextTick(() => newInstance.$mount('#newInstance'));
        console.log(`'/test' route mounted`);
      },
      destroyed () {
        console.log(`'/test' route destroyed`);
      },
      render () {
        console.log(`'/test' route rendered`);
        return <main> <div id="newInstance" /> </main>
      },
    };
    setTimeout(() => resolve(component), 500);
  });
  
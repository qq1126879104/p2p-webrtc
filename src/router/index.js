import Vue from 'vue';
import Router from 'vue-router';
import Room from '../views/Room';
import admin from '../views/admin';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'room',
      component: Room,
    },
		{
		  path: '/admin',
		  name: 'admin',
		  component: admin,
		},
  ],
});

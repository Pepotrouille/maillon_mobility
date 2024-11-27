// vue.config.js file to be placed in the root of your repository
import { createRouter, createWebHashHistory } from 'vue-router'

import Main from '@/components/Main.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {path: publicPath, name: 'Main', component: Main},
    //...
  ],
  mode: 'hash',
})

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/maillon_mobility/'
    : '/'
  }

<template>
  <div id="app">
    <code>
      <router-link
        to="/"
      >HOME</router-link> | 
      <router-link
        to="/vehicles/home"
      >VEHICLES</router-link> | 
      <router-link
        to="/test/oops/first"
      >TEST</router-link>
    </code>
    <pre class="router-view">
      <router-view />
    </pre>
  </div>
</template>

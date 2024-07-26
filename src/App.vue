<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.confirmButton {
  background-color: #de5757 !important;
  border-color: #ffecec !important;
}
.cancelButton {
  &:hover,
  &:focus {
    color: #ff4a40 !important;
    border-color: #ffc6c6 !important;
    background-color: #ffecec !important;
  }

  &:active {
    color: #e63a3a;
    border-color: #e63a3a;
    outline: 0;
  }
}
</style>

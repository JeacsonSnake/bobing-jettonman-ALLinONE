<template>
  <div class="homePage">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    ddd
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../style/variables.scss";
.homePage {
  --heightRate: calc(100vh / #{$base-height});
  --widthRate: calc(100vw / #{$base-width});

  nav {
    width: calc(var(--widthRate) * 1920);
    height: calc(var(--heightRate) * 56);
    background: rgba(204, 204, 204, 0);

    border-bottom: 1px solid rgba(0, 0, 0, 1);
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
}
</style>
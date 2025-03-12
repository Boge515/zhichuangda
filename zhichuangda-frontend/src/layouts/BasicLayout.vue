<template>
  <div id="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header"><GlobalHeader /></a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/Boge515" target="_blank">
          > text by BoGe
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import GlobalHeader from "@/components/GlobalHeader.vue";

export default {
  name: "BasicLayout",
  components: { GlobalHeader },
};
</script>

<style scoped>
#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
  padding: 16px;
}
#basicLayout .header {
  margin-bottom: 16px;
  background: #fff;
  padding: 0 16px;
  box-shadow: #eee 2px 2px 6px;
}
.footer {
  text-align: center;
  background: #f0f0f0;
  padding: 16px;
}
</style>

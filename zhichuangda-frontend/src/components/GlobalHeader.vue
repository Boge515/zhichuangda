<template>
  <div>
    <a-row id="globalHeader" align="center">
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="titleBar">
              <img class="logo" src=".././assets/logo.png" />
              <div class="title">智创答AI应用平台</div>
            </div>
          </a-menu-item>
          <a-menu-item
            v-for="item in visibleRoutes"
            :key="item.path"
            @click="doMenuClick(item.path)"
          >
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="100px">
        <div v-if="loginUserStore.loginUser.id">
          {{ loginUserStore.loginUser.userName ?? "无名" }}
        </div>
        <div v-else>
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";

const loginUserStore = useLoginUserStore();

//跳转路由，点击菜单到对应跳转页面
const router = useRouter();
// 当前选中的菜单项

const selectedKeys = ref(["/"]);
// 路由跳转时，自动更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
// 展示在菜单栏的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});
</script>

<style scoped>
.titleBar {
  display: flex;
}
.title {
  margin-left: 16px;
  margin-top: 8px;
  color: black;
  text-align: center;
}
.logo {
  height: 48px;
}
</style>

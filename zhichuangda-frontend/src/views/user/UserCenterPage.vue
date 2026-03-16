<template>
  <div id="userCenterPage">
    <h2 style="margin-bottom: 24px">个人中心</h2>
    <a-form
      :model="form"
      :style="{ width: '600px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="用户头像">
        <div style="display: flex; align-items: center; gap: 16px; width: 100%">
          <a-avatar :size="64" :image-url="form.userAvatar">
            <template #trigger-icon>
              <!-- <a-upload
                :show-file-list="false"
                :custom-request="handleAvatarUpload"
                accept="image/*"
              >
                <a-button type="outline" size="mini">更换</a-button>
              </a-upload> -->
            </template>
          </a-avatar>
          <div style="flex: 1">
            <!-- <div style="font-size: 14px; color: var(--color-text-2)">
              支持 JPG、PNG 格式，大小不超过 2MB
            </div> -->
            <a-input
              v-model="form.userAvatar"
              placeholder="请输入头像URL或上传图片"
              style="margin-top: 8px; width: 100%"
            />
          </div>
        </div>
      </a-form-item>
      
      <a-form-item field="userName" label="用户名" :rules="[{ required: true, message: '请输入用户名' }]">
        <a-input v-model="form.userName" placeholder="请输入用户名" style="width: 100%" />
      </a-form-item>
      
      <a-form-item field="userProfile" label="个人简介">
        <a-textarea
          v-model="form.userProfile"
          placeholder="请输入个人简介"
          :auto-size="{ minRows: 3, maxRows: 6 }"
        />
      </a-form-item>
      
      <a-form-item label="账号信息">
        <div style="background: var(--color-fill-2); padding: 12px; border-radius: 4px; width: 100%">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px">
            <span style="color: var(--color-text-2)">用户ID：</span>
            <span>{{ userInfo.id }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px">
            <span style="color: var(--color-text-2)">注册时间：</span>
            <span>{{ formatDate(userInfo.createTime) }}</span>
          </div>
          <div style="display: flex; justify-content: space-between">
            <span style="color: var(--color-text-2)">用户角色：</span>
            <span>{{ getUserRoleText(userInfo.userRole) }}</span>
          </div>
        </div>
      </a-form-item>
      
      <a-form-item>
        <div style="display: flex; gap: 12px; justify-content: center">
          <a-button type="primary" html-type="submit" :loading="loading" style="width: 120px">
            保存修改
          </a-button>
          <a-button @click="handleCancel">取消</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import { updateMyUserUsingPost } from "@/api/userController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";

const loginUserStore = useLoginUserStore();
const router = useRouter();
const loading = ref(false);

// 用户信息
const userInfo = ref({
  id: 0,
  userName: "",
  userAvatar: "",
  userProfile: "",
  userRole: "",
  createTime: "",
});

// 表单数据
const form = reactive({
  userName: "",
  userAvatar: "",
  userProfile: "",
});

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return "未知";
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 获取用户角色文本
const getUserRoleText = (role?: string) => {
  switch (role) {
    case ACCESS_ENUM.ADMIN:
      return "管理员";
    case ACCESS_ENUM.USER:
      return "普通用户";
    case ACCESS_ENUM.NOT_LOGIN:
      return "未登录";
    default:
      return role || "未知";
  }
};

// 初始化用户数据
const initUserData = () => {
  const user = loginUserStore.loginUser;
  userInfo.value = {
    id: user.id || 0,
    userName: user.userName || "",
    userAvatar: user.userAvatar || "",
    userProfile: user.userProfile || "",
    userRole: user.userRole || "",
    createTime: user.createTime || "",
  };
  
  form.userName = user.userName || "";
  form.userAvatar = user.userAvatar || "";
  form.userProfile = user.userProfile || "";
};

// 头像上传处理
const handleAvatarUpload = (options: any) => {
  const { file } = options;
  // 这里可以添加文件上传逻辑
  // 暂时只显示文件名
  message.info(`已选择文件: ${file.name}`);
  // 在实际项目中，这里应该调用文件上传接口
  // form.userAvatar = uploadedUrl;
  return Promise.resolve();
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await updateMyUserUsingPost({
      userName: form.userName,
      userAvatar: form.userAvatar,
      userProfile: form.userProfile,
    });
    
    if (res.data.code === 0) {
      message.success("个人信息更新成功");
      // 更新本地存储的用户信息
      await loginUserStore.fetchLoginUser();
      // 保存成功后返回上一页
      router.back();
    } else {
      message.error("更新失败：" + res.data.message);
    }
  } catch (error) {
    message.error("更新失败，请稍后重试");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 取消按钮
const handleCancel = () => {
  router.back();
};

// 组件挂载时初始化数据
onMounted(() => {
  initUserData();
});
</script>

<style scoped>
#userCenterPage {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
</style>
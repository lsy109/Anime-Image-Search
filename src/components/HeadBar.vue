<template>
  <div class="HeadBar text-center py-3">
    <h1 class="mb-4">动漫图片搜寻网站</h1>
    <nav class="navbar navbar-light" style="background-color: #e3f2fd">
      <!-- Navbar content -->
      <div class="container d-flex justify-content-between">
        <div class="left-section d-flex align-items-center">
          <input
            type="text"
            class="form-control me-2"
            v-model="childOneData"
            placeholder="搜索..."
            @keyup.enter="sendDataToParent"
          />
          <button class="btn btn-secondary me-2 w-50" @click="sendDataToParent">
            搜索
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="right-section">
          <!-- Dropdown menu -->
          <div class="btn-group me-2">
            <button
              type="button"
              class="btn btn-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              热门动漫
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">动漫1</a></li>
              <li><a class="dropdown-item" href="#">动漫2</a></li>
              <li><a class="dropdown-item" href="#">动漫3</a></li>
              <!-- 添加更多动漫选项 -->
            </ul>
          </div>
          <button class="btn btn-secondary">关于</button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HeadBar",
  data() {
    return {
      childOneData: "",
    };
  },

  methods: {
    sendDataToParent() {
      console.log("shuru", this.childOneData);
      this.$emit("sendData", this.childOneData);
    },
  },
};
</script>

<style scoped>
.HeadBar {
  background-color: #f8f9fa; /* 设置背景颜色 */
}
</style>

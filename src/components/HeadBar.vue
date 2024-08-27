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
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="handleDropdownClick('Demon Slayer')"
                  >鬼灭之刃 (Demon Slayer)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="handleDropdownClick('Attack on Titan')"
                  >进击巨人 (Attack on Titan)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="handleDropdownClick('Spy x Family')"
                  >间谍家家酒 (Spy x Family)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="handleDropdownClick('Jujutsu Kaisen')"
                  >咒术回战 (Jujutsu Kaisen)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="
                    handleDropdownClick('The Rising of the Shield Hero')
                  "
                  >盾之勇者成名录 (The Rising of the Shield Hero)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="handleDropdownClick('Fullmetal Alchemist')"
                  >钢之炼金术师 (Fullmetal Alchemist)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="
                    handleDropdownClick('Assassination Classroom')
                  "
                  >暗杀教室 (Assassination Classroom)</a
                >
              </li>
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
      // console.log("shuru", this.childOneData);
      this.$emit("sendData", this.childOneData);
    },
    handleDropdownClick(animeName) {
      // console.log("选择的动漫:", animeName);
      this.$emit("animeSelected", animeName); // 触发事件，传递选择的动漫信息
    },
  },
};
</script>

<style scoped>
.HeadBar {
  background-color: #f8f9fa; /* 设置背景颜色 */
}
</style>

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
          <button
            class="btn btn-secondary me-2 w-50"
            @click="getTagImg('toplist')"
          >
            Toplist
            <i class="bi bi-search"></i>
          </button>
          <button
            class="btn btn-secondary me-2 w-50"
            @click="getTagImg('random')"
          >
            Random
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="right-section">
          <!-- Dropdown menu -->
          <div class="btn-group me-2">
            <!-- <label class="switch-label">
              <input
                class="mui-switch mui-switch-animbg"
                type="checkbox"
                v-model="isRotating"
                @change="toggleRotation"
              />
              <span class="switch-text">{{
                isRotating ? "停止旋转" : "旋转"
              }}</span>
            </label> -->
            <button
              type="button"
              class="btn btn-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              热门动漫
            </button>

            <ul class="dropdown-menu">
              <!-- Dropdown menu items -->
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
              <!-- Add more items as needed -->
            </ul>
          </div>

          <button class="btn btn-secondary" @click="aboutClick">关于</button>
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
      isRotating: false, // 默认关闭状态
    };
  },

  methods: {
    sendDataToParent() {
      this.$emit("sendData", this.childOneData);
    },
    handleDropdownClick(animeName) {
      this.$emit("animeSelected", animeName);
    },
    toggleRotation() {
      this.$emit("rollButtonState", this.isRotating ? "开始旋转" : "停止旋转");
    },
    //傳入標簽選項
    getTagImg(Tag) {
      console.log("tag點擊");
      this.$emit("TagFromHead", Tag); //將選項傳入圖片區塊
    },
    //关于点击
    aboutClick() {
      console.log("About");
      this.$emit("aboutClick");
    },
  },
};
</script>

<style scoped>
.HeadBar {
  background-color: #f8f9fa; /* 设置背景颜色 */
}
.switch-label {
  display: inline-flex;
  align-items: center;
  margin-right: 10px; /* 添加一些右边距，以便内容间有间隙 */
}
.switch-text {
  margin-left: 5px; /* 调整开关和文字之间的间距 */
  min-width: 80px; /* 预留足够的空间以防文本变化 */
  text-align: left;
}
.mui-switch {
  width: 52px;
  height: 31px;
  position: relative;
  border: 1px solid #dfdfdf;
  background-color: #fdfdfd;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  border-radius: 20px;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;
}
.mui-switch:before {
  content: "";
  width: 29px;
  height: 29px;
  position: absolute;
  top: 0px;
  left: 0;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.mui-switch:checked {
  border-color: #64bd63;
  box-shadow: #64bd63 0 0 0 16px inset;
  background-color: #64bd63;
}
.mui-switch:checked:before {
  left: 21px;
}
</style>

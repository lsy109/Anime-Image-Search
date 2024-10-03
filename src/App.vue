<template>
  <div id="app1">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- 使用 Count 组件 -->
    <!-- <CounterComponent />  -->
    <HeadBar
      @sendData="receiveDataFromChildOne"
      @animeSelected="sendDataToImageGallery"
      @rollButtonState="sendRollButtonToImageGallery"
      @TagFromHead="sendTagToImageGallery"
      @aboutClick="toggleComponent"
    />
    <NewImageGallery
      v-if="currentComponent === 'NewImageGallery'"
      :receiveDataFromChildOne="dataFromHeadBar"
      :sendDataToImageGallery="dataFromAnimeButton"
      :TagFromHeader="TagFromHead"
    />
    <About v-else-if="currentComponent === 'About'" />
  </div>
</template>

<script>
// import CounterComponent from './components/CounterComponent.vue' // 导入 Count 组件
import HeadBar from "./components/HeadBar.vue";
// import ImageGallery from "./components/ImageGallery.vue";
import NewImageGallery from "./components/NewImageGallery.vue";
import About from "./components/About.vue";
export default {
  name: "App",
  components: {
    // 注册组件
    // CounterComponent,
    HeadBar,
    NewImageGallery,
    About,
  },

  data() {
    return {
      dataFromHeadBar: null,
      dataFromAnimeButton: null,
      rollButtonFromHead: null,
      TagFromHead: null, //這是傳輸標簽的
      currentComponent: "NewImageGallery", // 默认显示 NewImageGallery
    };
  },

  methods: {
    receiveDataFromChildOne(data) {
      this.dataFromHeadBar = data;
    },
    sendDataToImageGallery(data) {
      this.dataFromAnimeButton = data;
    },
    sendRollButtonToImageGallery(state) {
      this.rollButtonFromHead = state;
    },
    //這裏將標簽傳入圖片
    sendTagToImageGallery(data) {
      this.TagFromHead = data;
    },
    //切换组件
    toggleComponent() {
      this.currentComponent =
        this.currentComponent === "NewImageGallery"
          ? "About"
          : "NewImageGallery";
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  min-height: 100%;
}
#app1 {
  height: 100%;
}
.ImgBody {
  height: 50px;
}
</style>

<template>
  <div id="app1">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- 使用 Count 组件 -->
    <!-- <CounterComponent />  -->
    <HeadBar
      @sendData="receiveDataFromChildOne"
      @animeSelected="sendDataToImageGallery"
    />
    <ImageGallery
      :receiveDataFromChildOne="dataFromHeadBar"
      :sendDataToImageGallery="dataFromAnimeButton"
    />
  </div>
</template>

<script>
// import CounterComponent from './components/CounterComponent.vue' // 导入 Count 组件
import HeadBar from "./components/HeadBar.vue";
import ImageGallery from "./components/ImageGallery.vue";

export default {
  name: "App",
  components: {
    // 注册组件
    // CounterComponent,
    HeadBar,

    ImageGallery,
  },

  data() {
    return {
      dataFromHeadBar: null,
      dataFromAnimeButton: null,
    };
  },

  methods: {
    receiveDataFromChildOne(data) {
      console.log("搜索框：", data);
      this.dataFromHeadBar = data;
    },
    sendDataToImageGallery(data) {
      console.log("动漫选项", data);
      this.dataFromAnimeButton = data;
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

<template>
  <div>
    <!-- 旋转照片墙 Image Photo Wall -->
    <!-- 有四个鼠标事件，鼠标点击，松开鼠标，鼠标左右移动，鼠标离开 -->
    <div class="ImagePhotoWall"></div>
    <!-- 正常照片显示 Image Show Part -->
    <div class="ImageBox">
      <div
        v-for="(image, index) in displayImages"
        :key="index"
        class="image-item"
        @click.stop="handleImageClick(image)"
      >
        <img :src="image.thumbs.small" alt="Image" class="border" />
        <!-- 新增的信息欄位 -->
        <div class="image-info">
          <p>{{ image.resolution }}</p>
        </div>
      </div>
    </div>
    <!-- 點擊放大圖片 -->
    <div v-if="isImageOpen" class="image-modal" @click="closeImage">
      <img
        :src="selectedImage"
        alt="Fullscreen Image"
        class="modal-image"
        :style="{ transform: `scale(${scale})` }"
        @error="cheackImageError(selectedImage)"
      />
    </div>
  </div>
</template>

<script>
// 导入api请求
import axios from "axios";
export default {
  name: "NewImageGallery", //导出组件的名称
  props: {
    //组件传入值
    receiveDataFromChildOne: {
      type: String,
      default: null,
    },
    sendDataToImageGallery: {
      type: String,
      default: null,
    },
  },
  mounted() {
    this.FristTimeFetchImage("anime", 1);
    window.addEventListener("scroll", this.checkIfNearBottom); //組件挂載完後觸發滾輪檢查
  },

  computed: {
    displayImages() {
      return this.images;
      // return this.images.map((item) => item.thumbs.small); // 仅显示已加载的图片
    },
    boxStyle() {
      return {
        transform: `perspective(1000px) rotateY(${this.currentYRotation}deg)`,
      };
    },
  },
  watch: {
    receiveDataFromChildOne(newTag) {
      if (newTag) {
        this.images = []; //初始化請求的圖
        this.imageindex = 0; //初始化圖片的數量
        this.input = null; //初始化輸入的内容
        this.imagepage = 0; //初始化圖片的頁數
        for (let i = 0; i < this.getImage; i++) {
          this.FristTimeFetchImage(newTag, i + 1);
        }
      }
    },
    //熱門選項
    sendDataToImageGallery(newTag) {
      if (newTag) {
        this.images = [];
        this.imageindex = 0;
        this.input = null;
        this.imagepage = 0;
        for (let i = 0; i < this.getImage; i++) {
          this.FristTimeFetchImage(newTag, i + 1);
        }
      }
    },
  },
  data() {
    return {
      images: [], //储存图片的数组
      getImage: 2, //每次请求次数，每次24张，（限制）
      imageindex: 0, //記錄圖片的index
      isImageOpen: false, //是否點擊放大圖片
      selectedImage: null, //儲存點擊的圖片
      nearBottomTriggered: false, // 控制是否已经触发过
      input: null, //儲存輸入的内容
      imagepage: 0, //儲存獲取的頁數
    };
  },

  methods: {
    //组件function

    // 初次收索的function
    async FristTimeFetchImage(tag, page) {
      try {
        this.input = tag;
        this.imagepage += 1;
        const response = await axios.get("http://localhost:3000/api/images", {
          params: { tag, page },
        });
        const responseData = response.data.data;

        if (responseData) {
          this.images = this.images.concat(responseData);
          this.imageindex = this.images.length;
        } else {
          console.error("API response data is empty");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    //增加图片的function
    async SecondTimeFetchImage() {
      try {
        const page = this.imagepage;
        const tag = this.input;
        const response = await axios.get("http://localhost:3000/api/images", {
          params: { tag, page },
        });
        const responseData = response.data.data;

        if (responseData) {
          this.images = this.images.concat(responseData);
          this.imageindex = this.images.length;
        } else {
          console.error("API response data is empty");
        }
        this.imagepage += 1;
        this.nearBottomTriggered = false;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    //鼠標點擊圖片function
    handleImageClick(e) {
      const url = e; //鼠標點擊圖片，傳入的圖片的small網址
      // const foundItem = this.images.find((item) => item.thumbs.small === url); //在images中尋找點擊圖片的數據
      this.selectedImage = url.path; //獲取大圖片的網址
      this.isImageOpen = true;
      window.addEventListener("wheel", this.preventScroll, { passive: false }); //圖片放大時無法滾輪移動
      console.log(e);
    },
    //點擊圖片放大后，再次點擊，關閉圖片的function
    closeImage() {
      this.isImageOpen = false;
      this.selectedImage = null;
      // Enable scroll
      window.removeEventListener("wheel", this.preventScroll);
    },
    //點擊圖片放大后取消滾輪事件
    preventScroll(event) {
      event.preventDefault();
    },
    //滾輪檢查網頁是否到底
    checkIfNearBottom() {
      if (this.nearBottomTriggered) return; // 如果已经触发过，则直接返回
      const scrollTop = window.scrollY; // 当前的垂直滚动位置
      const windowHeight = window.innerHeight; // 可见窗口的高度
      const documentHeight = document.documentElement.scrollHeight; // 文档的总高度
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 500; // 100 是一个阈值
      if (isNearBottom) {
        console.log("滚轮快到底部了");
        this.nearBottomTriggered = true; // 设置为已触发
        this.SecondTimeFetchImage();
      }
    },

    //檢查圖片是否正常顯示
    cheackImageError(img) {
      console.log("顯示失敗", img);
      this.selectedImage = `http://localhost:3000/proxy-image?url=${img}`;

      // const foundItem = this.images.find((item) => item.path === img); //在images中尋找點擊圖片的數據
      // this.selectedImage = `http://localhost:3000/api/proxy-image?url=${encodeURIComponent(
      //   img
      // )}`;
    },
  },
};
</script>
<style scoped>
.ImagePhotoWall {
  margin-top: 5%;
}

.box {
  position: relative;
  width: 200px;
  height: 180px;
  transform-style: preserve-3d;
  margin: auto;
  cursor: grab;
}

.box span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform-style: preserve-3d;
  transform: rotateY(calc(var(--i) * 45deg)) translateZ(400px);
}

.no-pointer-events {
  pointer-events: none;
}

.box span img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ImageBox {
  margin: 5%;

  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: 20%;
  padding: 5px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, z-index 0.3s ease;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.image-item:hover img {
  transform: translateY(-10px) scale(1.1); /* 图片上移并放大 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* 添加阴影效果，使图片看起来浮起 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加阴影过渡效果 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}
.image-item:hover .image-info {
  opacity: 1; /* 当 hover 时显示 */
  transform: translateY(0); /* 移动至显示位置 */
}
.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 20%;
  width: 100%;
  background: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  color: white;
  padding: 10px;
  opacity: 0; /* 初始不可见 */
  transform: translateY(100%); /* 初始位置在下方，完全隐藏 */
  transition: opacity 0.3s ease, transform 0.3s ease; /* 平滑的显示过渡效果 */
}
.image-info p {
  font-family: "Arial", sans-serif; /* 设置字体，优先使用 Arial，没有时用系统默认的 sans-serif 字体 */
  font-size: 10px; /* 设置字体大小 */
  font-weight: Thin; /* 设置字体粗细 */
  color: #fff; /* 设置文字颜色 */
  text-align: center; /* 文本居中 */
  margin: 0; /* 去除默认的 p 标签上下边距 */
}
.image-item:hover {
  z-index: 10;
}

/* Fullscreen Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
  z-index: 1000;
}

.modal-image {
  max-width: 90%; /* 设置图片的最大宽度 */
  max-height: 90%; /* 设置图片的最大高度 */
  width: auto; /* 保持图片宽高比 */
  height: auto; /* 保持图片宽高比 */
  transition: transform 0.3s ease; /* 添加过渡效果 */
}
</style>

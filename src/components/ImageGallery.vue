<template>
  <div>
    <!-- Photo Wall -->
    <div
      class="ImageShow"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @mousemove="onDrag"
      @mouseleave="stopDrag"
    >
      <div class="box" :style="boxStyle">
        <span
          v-for="(image, index) in displayImages"
          :key="index"
          :style="`--i:${index + 1}`"
        >
          <img :src="image" alt="image" class="no-pointer-events" />
        </span>
      </div>
    </div>

    <!-- Image Display Area -->
    <div class="ImageBox">
      <div
        v-for="(image, index) in otherImages"
        :key="index"
        class="image-item"
      >
        <img :src="image" alt="image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImageShow",
  data() {
    return {
      images: [],
      isDragging: false,
      startX: 0,
      currentYRotation: 0,
      startYRotation: 0,
      rotationSpeed: 0.1, // 旋转速度
      animationFrameId: null, // 用于存储 requestAnimationFrame 的 ID
      isAnimating: true, // 控制动画状态
    };
  },

  props: {
    receiveDataFromChildOne: {
      type: String,
      default: "",
    },
  },

  computed: {
    displayImages() {
      // 只取前 8 张图片用于照片墙
      return this.images.slice(0, 8);
    },
    otherImages() {
      // 剩余图片
      return this.images.slice(8);
    },
    boxStyle() {
      return {
        transform: `perspective(1000px) rotateY(${this.currentYRotation}deg)`,
      };
    },
  },

  watch: {
    receiveDataFromChildOne(newVal) {
      this.fetchImages(newVal);
      this.logData(newVal);
    },
  },

  methods: {
    async fetchImages(tag) {
      try {
        const ImgDB = `https://api.waifu.pics/sfw/${tag}`;

        // 创建多个并行请求
        const requests = Array.from({ length: 20 }, () => axios.get(ImgDB));

        // 并行发送所有请求
        const responses = await Promise.all(requests);

        // 提取图片 URL
        this.images = responses.map((response) => response.data.url);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },

    logData(data) {
      console.log("输入", data);
    },

    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startYRotation = this.currentYRotation;
      document.body.style.cursor = "grabbing"; // Change cursor when dragging starts

      // 禁用默认的选择行为
      document.body.style.userSelect = "none";

      // 停止动画循环
      this.isAnimating = false;
      cancelAnimationFrame(this.animationFrameId);
    },

    stopDrag() {
      this.isDragging = false;
      document.body.style.cursor = "default"; // Change cursor when dragging stops

      // 恢复默认的选择行为
      document.body.style.userSelect = "auto";

      // 启动旋转动画
      this.isAnimating = true;
      this.startRotation();
    },

    onDrag(event) {
      if (!this.isDragging) return;

      const deltaX = event.clientX - this.startX;
      this.currentYRotation = this.startYRotation + deltaX * 0.2; // Adjust sensitivity as needed
    },

    startRotation() {
      const rotate = () => {
        if (this.isAnimating) {
          this.currentYRotation += this.rotationSpeed;
          // 限制旋转角度在 360 度以内
          if (this.currentYRotation >= 360) {
            this.currentYRotation -= 360;
          }
        }
        this.animationFrameId = requestAnimationFrame(rotate);
      };
      rotate();
    },
  },

  mounted() {
    this.startRotation(); // 启动旋转动画
  },

  beforeUnmount() {
    cancelAnimationFrame(this.animationFrameId); // 清除动画循环
  },
};
</script>

<style scoped>
.ImageShow {
  margin-top: 5%; /* Move the entire component 200px down */
}

.box {
  position: relative;
  width: 400px; /* Adjust the width and height as needed */
  height: 200px;
  transform-style: preserve-3d;
  margin: auto;
  cursor: grab; /* Change cursor to indicate draggable element */
}

.box span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform-style: preserve-3d;
  transform: rotateY(calc(var(--i) * 45deg)) translateZ(300px); /* Adjusted translateZ */
}

.no-pointer-events {
  pointer-events: none; /* Disable all mouse events on the image */
}

.box span img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Scale down while keeping the aspect ratio */
  display: block;
  transform: scale(0.8); /* Adjust scale as needed */
}

.ImageBox {
  margin-top: 20px; /* Add spacing between photo wall and image display area */
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: 20%;
  padding: 5px;
}

.image-item img {
  width: 100%;
  height: auto;
  object-fit: contain; /* Ensure images fit well within their containers */
}
</style>

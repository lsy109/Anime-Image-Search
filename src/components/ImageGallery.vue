<template>
  <div>
    <!-- Photo Wall -->
    <div
      class="ImageShow"
      @mousedown="startDrag"
      @mouseup="handleMouseUp"
      @mousemove="onDrag"
      @mouseleave="stopDrag"
    >
      <div class="box" :style="boxStyle">
        <span
          v-for="(image, index) in displayImages"
          :key="index"
          :style="`--i:${index + 1}`"
        >
          <img
            :src="image.path"
            alt="image"
            class="no-pointer-events"
            @error="handleImageError"
            @click.stop="handleImageClick(image.path)"
          />
        </span>
      </div>
    </div>

    <!-- Image Display Area -->
    <div class="ImageBox">
      <div
        v-for="(image, index) in displayImages"
        :key="index"
        class="image-item"
        @click.stop="handleImageClick(image.path)"
      >
        <img :src="image.path" alt="image" class="border" />
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <div v-if="isImageOpen" class="image-modal" @click="closeImage">
      <img :src="selectedImage" alt="Fullscreen Image" class="modal-image" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ImageGallery",
  props: {
    receiveDataFromChildOne: {
      type: String,
      default: null,
    },
    sendDataToImageGallery: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      images: [], // 所有图片的数组
      loadedImagesCount: 15, // 初始加载的图片数量
      isDragging: false,
      startX: 0,
      startY: 0,
      startTime: 0,
      currentYRotation: 0,
      startYRotation: 0,
      rotationSpeed: 0.1,
      animationFrameId: null,
      isAnimating: true,
      isImageOpen: false,
      selectedImage: null,
      isFetching: false, // 是否正在加载更多图片
      clickThreshold: 200, // Adjust this value based on observed click duration
    };
  },
  computed: {
    displayImages() {
      return this.images.slice(0, this.loadedImagesCount); // 仅显示已加载的图片
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
        for (let i = 0; i < this.getImage; i++) {
          this.FristTimeFetchImage(newTag);
        }
      }
    },
    sendDataToImageGallery(newTag) {
      if (newTag) {
        for (let i = 0; i < this.getImage; i++) {
          this.FristTimeFetchImage(newTag);
        }
      }
    },
  },
  mounted() {
    if (this.receiveDataFromChildOne) {
      this.fetchImages(this.receiveDataFromChildOne);
    } else {
      this.fetchImages("anime");
    }
    this.startRotation();
    window.addEventListener("scroll", this.loadMoreImages); // 监听滚动事件
  },
  beforeUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener("scroll", this.loadMoreImages); // 解除滚动监听
  },
  methods: {
    async fetchImages(tag) {
      try {
        this.images = []; // 确保每次都清空之前的图片
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const ImgDB = `${proxyUrl}https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(
          tag
        )}&categories=100&purity=100&sorting=popular&order=desc&page=1&per_page=50`; // 调整每次请求的图片数量

        const response = await axios.get(ImgDB);
        const responseData = response.data.contents;

        if (responseData) {
          let data;
          try {
            data = JSON.parse(responseData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return;
          }

          if (data && data.data) {
            this.images = data.data.map((item) => ({
              path: item.path,
            }));
          } else {
            console.error("Unexpected API response structure:", data);
          }
        } else {
          console.error("API response data is empty");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    async loadMoreImages() {
      if (this.isFetching) return; // 防止重复请求

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // 当用户滚动到页面底部附近时触发加载
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        this.isFetching = true;
        this.loadedImagesCount += 10; // 每次加载10张图片
        console.log("加载更多图片，当前总数:", this.loadedImagesCount);
        this.isFetching = false;
      }
    },
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.startYRotation = this.currentYRotation;
      this.startTime = Date.now(); // Record start time
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      this.isAnimating = false;
      cancelAnimationFrame(this.animationFrameId);
    },
    handleMouseUp(event) {
      if (this.isDragging) {
        this.stopDrag();
      } else {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        console.log(`Click duration: ${duration}ms`);
        if (duration < this.clickThreshold) {
          // Treat it as a click event if the duration is below the threshold
          this.handleImageClick(event.target.src);
        }
      }
    },
    stopDrag() {
      this.isDragging = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.startRotation();
      }
    },
    onDrag(event) {
      if (!this.isDragging) return;
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Only rotate if horizontal drag is more significant
        this.currentYRotation = this.startYRotation + deltaX * 0.2;
      }
    },
    startRotation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      const rotate = () => {
        if (this.isAnimating) {
          this.currentYRotation += this.rotationSpeed;
          if (this.currentYRotation >= 360) {
            this.currentYRotation -= 360;
          }
        }
        this.animationFrameId = requestAnimationFrame(rotate);
      };
      rotate();
    },
    handleImageError(event) {
      console.error("Image failed to load:", event.target.src);
    },
    handleImageClick(imagePath) {
      this.selectedImage = imagePath;
      this.isImageOpen = true;
      // Disable scroll
      window.addEventListener("wheel", this.preventScroll, { passive: false });
    },
    closeImage() {
      this.isImageOpen = false;
      this.selectedImage = null;
      // Enable scroll
      window.removeEventListener("wheel", this.preventScroll);
    },
    preventScroll(event) {
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
.ImageShow {
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
  margin-top: 100px;
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
  transform: translateY(-10px);
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
  max-width: 90%;
  max-height: 90%;
}
</style>

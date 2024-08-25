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
          <img
            :src="image.path"
            alt="image"
            class="no-pointer-events"
            @error="handleImageError"
          />
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
        <img :src="image.path" alt="image" class="border" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImageGallery",
  props: {
    receiveDataFromChildOne: {
      type: String, // Assuming the data is a string. Adjust type if necessary.
      default: null,
    },
  },
  data() {
    return {
      images: [],
      isDragging: false,
      startX: 0,
      currentYRotation: 0,
      startYRotation: 0,
      rotationSpeed: 0.1,
      animationFrameId: null,
      isAnimating: true,
    };
  },
  computed: {
    displayImages() {
      return this.images.slice(0, 8);
    },
    otherImages() {
      return this.images.slice(8);
    },
    boxStyle() {
      return {
        transform: `perspective(1000px) rotateY(${this.currentYRotation}deg)`,
      };
    },
  },
  watch: {
    receiveDataFromChildOne(newTag) {
      // Fetch new images when the prop changes

      if (newTag) {
        this.fetchImages(newTag);
      }
    },
  },
  mounted() {
    // Initialize with a default tag or the prop value if available
    if (this.receiveDataFromChildOne) {
      this.fetchImages(this.receiveDataFromChildOne);
    } else if (!this.receiveDataFromChildOne) {
      this.fetchImages("anime");
    }
    this.startRotation();
  },
  beforeUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    async fetchImages(tag) {
      try {
        this.images = [];
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const ImgDB = `${proxyUrl}https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(
          tag
        )}&categories=100&purity=100&sorting=popular&order=desc&page=1&per_page=20`;

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

            this.isAnimating = true;
            this.startRotation();
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
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startYRotation = this.currentYRotation;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      this.isAnimating = false;
      cancelAnimationFrame(this.animationFrameId);
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
      this.currentYRotation = this.startYRotation + deltaX * 0.2;
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
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>

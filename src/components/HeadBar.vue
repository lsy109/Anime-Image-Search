<template>
  <div class="HeadBar">
    <h1>动漫图片搜寻网站</h1>
    <input
      type="text"
      v-model="childOneData"
      placeholder="搜索..."
      @keyup.enter="sendDataToParent"
    />
    <button @click="sendDataToParent">搜索</button>
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

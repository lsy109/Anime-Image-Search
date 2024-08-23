const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// 示例：返回图片数据
app.get("/api/images", (req, res) => {
  const images = [
    { path: "image1.jpg" },
    { path: "image2.jpg" },
    // 添加更多图片路径
  ];
  res.json(images);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

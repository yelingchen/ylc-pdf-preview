<template>

  <div class="box">
    <!-- 文件上传 -->
    <div class="box-item">
      <el-upload class="upload-demo" :action="null" :auto-upload="false" accept=".pdf" :show-file-list="false"
        @change="act_handleFileUpload">
        <el-button type="primary">点击上传 PDF 文件</el-button>
      </el-upload>
    </div>

    <!-- PDF 预览区域 -->
    <div class="box-item pdf-viewer">

      <div class="controls">
        <div class="controls-item">
          <el-button @click="act_previousPage" :disabled="g_currentPage === 1">上一页</el-button>
          <el-button @click="act_nextPage" :disabled="g_currentPage === g_numPages">下一页</el-button>
        </div>

        <div class="controls-item">
          <span>第 {{ g_currentPage }} 页 / 共 {{ g_numPages }} 页</span>
        </div>

        <div class="controls-item">
          <el-button @click="act_zoomIn">放大</el-button>
          <el-button @click="act_zoomOut">缩小</el-button>
          <el-button @click="act_download">下载</el-button>
        </div>
      </div>

      <div ref="g_pdfViewer" class="pdf-content"></div>

    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import pdfFile from '@/assets/预览专用（带目录）.pdf'
import * as PDFJS from 'pdfjs-dist';

/**********************************************************
 * 全局变量区域
 * 
 * 格式：g_ + 变量名  例如： g_numPages
 **********************************************************/
// PDF预览容器
const g_pdfViewer = ref(null);
// 上传的PDF名称
const g_pdfFileName = ref('');
// 当前页码
const g_currentPage = ref(1);
// 页面总数
const g_numPages = ref(0);
// 缩放比例
const g_scale = ref(1.5);
// PDF文档实例引用
let g_pdfDocument = pdfFile;


/**********************************************************
 * 生命周期函数
 **********************************************************/
onMounted(() => {
  act_loadDefaultPdf();
});


/**********************************************************
 * 逻辑函数区域
 * 
 * 格式：act_ + 方法名  例如： act_handleFileUpload
 **********************************************************/
/**
 * 加载默认 PDF 文件
 */
const act_loadDefaultPdf = async () => {
  try {
    // 使用 fetch 获取本地 PDF 文件内容
    const response = await fetch(pdfFile);
    const arrayBuffer = await response.arrayBuffer();
    g_pdfDocument = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    g_numPages.value = g_pdfDocument.numPages;
    act_renderPage(g_currentPage.value);
  } catch (error) {
    console.error('加载默认 PDF 文件失败', error);
    ElMessage.error('加载默认 PDF 文件失败，请检查文件路径');
  }
};

/**
 * 处理文件上传
 * @param uploadFile - 上传的文件对象
 * @param uploadFiles  - 上传的文件列表
 */
const act_handleFileUpload = (uploadFile, uploadFiles) => {
  // 确保正确获取文件对象
  const file = uploadFile.raw;
  if (file) {
    g_pdfFileName.value = file.name;
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const arrayBuffer = fileReader.result;
      g_pdfDocument = await PDFJS.getDocument({ data: arrayBuffer }).promise;
      g_numPages.value = g_pdfDocument.numPages;
      act_renderPage(g_currentPage.value);
    };
    fileReader.readAsArrayBuffer(file);
  }
};

/**
 * 渲染页面
 * @param currentPage - PDF页码
 */
const act_renderPage = async (currentPage) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  // 获取 PDF 页面对象
  const pdfPage = await g_pdfDocument.getPage(currentPage);

  // 获取页面视图
  const viewport = pdfPage.getViewport({ scale: g_scale.value });
  canvas.setAttribute('style', 'position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // 渲染页面
  pdfPage.render({
    canvasContext: context,
    viewport: viewport
  });

  // 添加到 PDF 预览容器中
  if (g_pdfViewer.value) {
    while (g_pdfViewer.value.firstChild) {
      g_pdfViewer.value.removeChild(g_pdfViewer.value.firstChild);
    }
    g_pdfViewer.value.appendChild(canvas);
  }
};

/**
 * 上一页
 */
const act_previousPage = () => {
  if (g_currentPage.value > 1) {
    g_currentPage.value--;
    act_renderPage(g_currentPage.value);
  }
};

/**
 * 下一页
 */
const act_nextPage = () => {
  if (g_currentPage.value < g_numPages.value) {
    g_currentPage.value++;
    act_renderPage(g_currentPage.value);
  }
};

/**
 * 放大
 */
const act_zoomIn = () => {
  g_scale.value += 0.5;
  act_renderPage(g_currentPage.value);
};

/**
 * 缩小
 */
const act_zoomOut = () => {
  if (g_scale.value > 0.5) {
    g_scale.value -= 0.5;
    act_renderPage(g_currentPage.value);
  }
};

/**
 * 下载PDF
 */
const act_download = () => {
  if (g_pdfDocument) {
    g_pdfDocument.getData().then((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = g_pdfFileName.value || '默认文件.pdf';
      link.click();
    })
  }
}

</script>

<style scoped>
.box {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pdf-viewer {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.controls {
  margin: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pdf-content {
  position: relative;
  flex: 1 1 0;
  margin: 0 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: auto;
}
</style>
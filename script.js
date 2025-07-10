const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.getElementById("convertBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("audioInput");
  const file = fileInput.files[0];
  const status = document.getElementById("status");
  const downloadLink = document.getElementById("downloadLink");

  if (!file) {
    status.textContent = "ファイルを選んでね";
    return;
  }

  if (!ffmpeg.isLoaded()) {
    status.textContent = "FFmpegロード中...";
    await ffmpeg.load();
  }

  status.textContent = "変換中...";

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));

  await ffmpeg.run(
    "-i", file.name,
    "-ac", "2", // チャンネル数を2に（ステレオ）
    "-c:a", "libmp3lame",
    "output.mp3"
  );

  const data = ffmpeg.FS("readFile", "output.mp3");
  const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));
  downloadLink.href = url;
  downloadLink.style.display = "block";
  status.textContent = "変換完了！";
});

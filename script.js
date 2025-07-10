const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.getElementById("mergeBtn").addEventListener("click", async () => {
  const leftFile = document.getElementById("leftInput").files[0];
  const rightFile = document.getElementById("rightInput").files[0];
  const status = document.getElementById("status");
  const link = document.getElementById("downloadLink");

  if (!leftFile || !rightFile) {
    status.textContent = "両方のファイルを選んでね！";
    return;
  }

  if (!ffmpeg.isLoaded()) {
    status.textContent = "FFmpeg読み込み中...";
    await ffmpeg.load();
  }

  status.textContent = "変換中...少々お待ちを";

  // 書き込み
  ffmpeg.FS("writeFile", "left.mp3", await fetchFile(leftFile));
  ffmpeg.FS("writeFile", "right.mp3", await fetchFile(rightFile));

  // ステレオ合成
  await ffmpeg.run(
    "-i", "left.mp3",
    "-i", "right.mp3",
    "-filter_complex", "[0:a][1:a]amerge=inputs=2[stereo]",
    "-map", "[stereo]",
    "-ac", "2",
    "-c:a", "libmp3lame",
    "output.mp3"
  );

  const data = ffmpeg.FS("readFile", "output.mp3");
  const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));
  link.href = url;
  link.style.display = "inline-block";
  status.textContent = "変換完了！ダウンロードしてね🎉";
});

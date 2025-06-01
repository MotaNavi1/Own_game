document.getElementById("uploadForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const input = this.querySelector('input[type="file"]');
  const files = input.files;
  if (!files.length) return;

  for (let file of files) {
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.src = url;
      tempVideo.onloadedmetadata = function () {
        URL.revokeObjectURL(tempVideo.src);
        if (tempVideo.duration > 10) {
          alert("Видео должно быть не длиннее 10 секунд!");
        } else {
          showMedia(file);
        }
      };
    } else {
      showMedia(file);
    }
  }

  input.value = "";
});

function showMedia(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const url = event.target.result;
    const gallery = document.getElementById("gallery");
    const div = document.createElement("div");
    div.className = "media-item";

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = url;
      div.appendChild(img);
    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      div.appendChild(video);
    }

    gallery.prepend(div);
  };
  reader.readAsDataURL(file);
}


function createMediaElement(filename) {
  const url = "/uploads/" + filename;
  const div = document.createElement("div");
  div.className = "media-item";

  if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const img = document.createElement("img");
    img.src = url;
    div.appendChild(img);
  } else if (filename.match(/\.(mp4|webm)$/i)) {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    div.appendChild(video);
  }

  return div;
}

function loadGallery() {
  fetch("/media")
    .then(res => res.json())
    .then(files => {
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = "";
      files.forEach(file => {
        const el = createMediaElement(file);
        gallery.appendChild(el);
      });
    });
}

document.getElementById("uploadForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const input = this.querySelector('input[type="file"]');
  const files = input.files;
  if (!files.length) return;

  const formData = new FormData();
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
          formData.append("file", file);
          uploadFiles(formData);
        }
      };
    } else {
      formData.append("file", file);
    }
  }

  function uploadFiles(formData) {
    fetch("/upload", {
      method: "POST",
      body: formData
    }).then(() => {
      loadGallery();
      input.value = "";
    });
  }
});

window.onload = loadGallery;


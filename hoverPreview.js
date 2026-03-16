window.addEventListener("load", () => {
  const preview = document.getElementById("preview");
  const centerImage = document.getElementById("centerImage");
  const nodes = document.querySelectorAll(".node");

  const videos = {
    1: "image/preview1.mp4",
    2: "image/preview2.mp4",
    3: "image/preview3.mp4",
    4: "image/preview4.mp4",
    5: "image/preview5.mp4",
    6: "image/preview6.mp4",
    7: "image/preview7.mp4",
    8: "image/preview8.mp4",
    9: "image/preview9.mp4",
    10: "image/preview10.mp4"
  };

  function showPreview(src) {
    preview.innerHTML = `
      <video autoplay muted loop playsinline>
        <source src="${src}" type="video/mp4">
      </video>
    `;
    preview.style.display = "flex";
    preview.style.opacity = "1";
  }

  function hidePreview() {
    preview.style.opacity = "0";
    preview.style.display = "none";
    preview.innerHTML = "";
  }

  function getDayFromImageSrc(src) {
    const match = src.match(/day(\d+)\.png/i);
    return match ? Number(match[1]) : null;
  }

  nodes.forEach((node, index) => {
    const day = index + 1;

    node.addEventListener("mouseenter", () => {
      showPreview(videos[day]);
    });

    node.addEventListener("mouseleave", () => {
      hidePreview();
    });

    node.addEventListener("touchstart", () => {
      showPreview(videos[day]);
    });

    node.addEventListener("touchend", () => {
      hidePreview();
    });
  });

  centerImage.addEventListener("mouseenter", () => {
    const day = getDayFromImageSrc(centerImage.src);
    if (day && videos[day]) {
      showPreview(videos[day]);
    }
  });

  centerImage.addEventListener("mouseleave", () => {
    hidePreview();
  });

  centerImage.addEventListener("touchstart", () => {
    const day = getDayFromImageSrc(centerImage.src);
    if (day && videos[day]) {
      showPreview(videos[day]);
    }
  });

  centerImage.addEventListener("touchend", () => {
    hidePreview();
  });
});
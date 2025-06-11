document.querySelectorAll("article").forEach(article => {
    const openBtn = article.querySelector(".read-more");
    const dialog = article.querySelector("dialog");
    const closeBtn = article.querySelector(".close-dialog");
  
    if (!openBtn || !dialog || !closeBtn) {
      console.warn("Noget mangler i en artikel");
      return;
    }
  
    openBtn.addEventListener("click", () => {
      dialog.showModal();
    });
  
    closeBtn.addEventListener("click", () => {
      dialog.close();
    });
  });
  
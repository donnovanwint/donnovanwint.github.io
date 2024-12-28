// Add this to your existing JavaScript

// Image loading handler
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach((img) => {
    img.addEventListener('load', () => {
      img.parentElement.classList.add('loaded');
    });
  });

  // Optional: Lightbox functionality
  galleryItems.forEach((img) => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightbox.appendChild(lightboxImg);

      lightbox.addEventListener('click', () => {
        lightbox.remove();
      });

      document.body.appendChild(lightbox);
      lightbox.style.display = 'block';
    });
  });
});

// Optional: Infinite Scroll
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    // Load more images when near bottom
    // Implementation depends on your image loading mechanism
  }
});

// разметка DOOM

export function doRendering(array) {
  const arrayImages = array
    .map(
      el =>
        `
   <div class="photo-card">
        <a class="gallery__item" href="${el.largeImageURL}">   
          <img src="${el.largeImageURL}" alt="${el.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
           <b>Likes</b>
           ${el.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
             ${el.views}
          </p>
          <p class="info-item">
             <b>Comments</b>
              ${el.comments}
          </p>
          <p class="info-item">
             <b>Downloads</b>
              ${el.downloads}
          </p>
       </div>
   </div>
      `
    )
    .join('');
  return arrayImages;
}
// разметка DOOM

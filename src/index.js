import './sass/index.scss';
import someTemplate from './templates/template.hbs';
import { axiosSearchImages } from './axiosSearchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const infiniteScroll = require('infinite-scroll');

import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;
const formEl = document.querySelector('.search-form');
const submitFormEl = document.querySelector('.submit-form');
// const buttonLoadMore = document.querySelector('.load-more');
const galaryEl = document.querySelector('.gallery');

let nameInput;
// console.log(infiniteScroll);
// infScroll.on('error', function () {
//   Notiflix.Notify.failure(
//     'Sorry, there are no images matching your search query. Please try again.'
//   );
// });

function sendNegativeMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function sendPositiveMessage(date) {
  Notiflix.Notify.success(`Hooray! We found ${date} images.`);
}

// поиск сабмит
async function asyncRequestSubmit(value, page) {
  try {
    const promise = await axiosSearchImages(value, page);
    const data = await promise.data;
    if (data.hits.length == 0) {
      sendNegativeMessage();
      // buttonLoadMore.style.display = 'none';
      submitFormEl.textContent = 'Searh';
      galaryEl.innerHTML = '';
      return;
    }

    sendPositiveMessage(data.totalHits);
    const Array = await data.hits;
    galaryEl.innerHTML = someTemplate(Array);
    toLightBox();
    submitFormEl.textContent = 'Searh';
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
  }
}
// // поиск сабмит

formEl.addEventListener('submit', onClickForm);

function onClickForm(event) {
  // buttonLoadMore.style.display = 'none';
  submitFormEl.textContent = 'Searh...';
  event.preventDefault();
  const inputEl = formEl.elements.searchQuery;
  nameInput = inputEl.value;
  asyncRequestSubmit(nameInput, 1);

  let infScroll = new infiniteScroll('.gallery', {
    path: function () {
      {
        if (this.pageIndex == 1) {
          this.pageIndex = 2;
        }
      }
      // console.log(this.pageIndex);
      // console.log(this.loadCount);
      return `https://pixabay.com/api/?key=31270894-f030383025237e7d53b6441a5&q=${nameInput}&page=${this.pageIndex}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`;
    },
    responseBody: 'json',
    status: '.page-load-status',
    history: false,
  });

  infScroll.on('load', function (array) {
    galaryEl.insertAdjacentHTML('beforeend', someTemplate(array.hits));
    toLightBox();
  });
}

// Эффект Lightbox
function toLightBox() {
  const lightbox = new SimpleLightbox('.gallery__item', {
    captionDelay: 250,
    captionsData: 'alt',
    navText: ['\u261A', '\u261B'],
    showCounter: false,
    closeText: '\u2A37',
  });
  lightbox.refresh();
}
// Эффект Lightbox

// Your API key: 31270894-f030383025237e7d53b6441a5

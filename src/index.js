import './sass/index.scss';

import { axiosSearchImages } from './axiosSearchImages';
import { doRendering } from './doRendering';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;
const formEl = document.querySelector('.search-form');
const submitFormEl = document.querySelector('.submit-form');
const buttonLoadMore = document.querySelector('.load-more');
const galaryEl = document.querySelector('.gallery');

let counter = 1;
let nameInput;

buttonLoadMore.style.display = 'none';

// плавный скролл
function toScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
    //
  });
}
// плавный скролл

formEl.addEventListener('submit', onClickForm);

function onClickForm(event) {
  buttonLoadMore.style.display = 'none';
  submitFormEl.textContent = 'Searh...';
  event.preventDefault();
  const inputEl = formEl.elements.searchQuery;
  nameInput = inputEl.value;

  axiosSearchImages(inputEl.value, '1')
    .then(promise => promise.data)
    .then(data => {
      if (data.hits.length == 0) {
        buttonLoadMore.style.display = 'none';
        submitFormEl.textContent = 'Searh';
        galaryEl.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(data);
      buttonLoadMore.style.display = 'block';

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return data.hits;
    })
    .then(Array => {
      galaryEl.innerHTML = doRendering(Array);
      toLightBox();
      submitFormEl.textContent = 'Searh';
    });
}
buttonLoadMore.addEventListener('click', () => onClickLoadMore(nameInput));

function onClickLoadMore(value) {
  counter += 1;
  axiosSearchImages(value, counter)
    .then(promise => promise.data)
    .then(data => {
      if (data.hits.length == 0) {
        buttonLoadMore.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return data.hits;
    })
    .then(Array => {
      galaryEl.insertAdjacentHTML('beforeend', doRendering(Array));
      toScroll();
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

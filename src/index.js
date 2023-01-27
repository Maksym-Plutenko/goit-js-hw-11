// initiate variables
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector('#search-form input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const guardian = document.querySelector('.guardian');

const PICTURES_PER_PAGE = 40;

let request = '';
let currentPage = 1;
let totalHits = 0;

// create SimpleLightbox instance
const lightbox = new SimpleLightbox('a', {
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
  });

// main logick
button.addEventListener('click', event => {
    event.preventDefault();
    request = input.value.trim();

    if (request) {
        currentPage = 1;
        totalHits = 0;
        gallery.innerHTML = '';
        findPictures(request, 1);
    }
});

async function findPictures(request, page = 1) {
    try {
        const response = await pixabayAPI(request, page);

        if (page === 1) {
            totalHits = response.data.totalHits;
            observer.observe(guardian);
            if (totalHits > 0) {
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            }
        }

        const picturesArr = response.data.hits;
        let galleryMarkup = '';

        if (picturesArr.length === 0) {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
        } else {
            picturesArr.forEach(element => {
                galleryMarkup = galleryMarkup + getElementMarkup(element);
            });
        }

        gallery.insertAdjacentHTML('beforeend', galleryMarkup);
        currentPage += 1;
        lightbox.refresh();

    } catch(error) {
        Notiflix.Notify.failure(error.message);
        console.log('We are here')
    }
}

// infinity scroll
const obsOptions = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0
};

const addPictures = function(entries, observer) {
    if (entries[0].isIntersecting) {
        if ((totalHits + PICTURES_PER_PAGE - 1) > currentPage*PICTURES_PER_PAGE) {
            findPictures(request, currentPage);
        } else {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            observer.unobserve(guardian);
        }
    }
};

const observer = new IntersectionObserver(addPictures, obsOptions);

// functions
async function pixabayAPI(request, page) {
    const KEY = '33025300-4f56a11ea42b0ad7a58370454';
    return await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PICTURES_PER_PAGE}&page=${page}`);
}

function getElementMarkup(element) {
    return `
    <div class="photo-card">
        <a class="lightbox-link" href="${element.largeImageURL}">
            <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${element.likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${element.views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                ${element.comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${element.downloads}
            </p>
        </div>
    </div>
    `;
}









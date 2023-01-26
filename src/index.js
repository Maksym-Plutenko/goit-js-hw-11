// initiate variables
import axios from "axios";
import Notiflix from 'notiflix';
// import debounce from "debounce";
// import throttle from "lodash.throttle";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

console.log(SimpleLightbox);

const input = document.querySelector('#search-form input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const guardian = document.querySelector('.guardian');

const PICTURES_PER_PAGE = 40;

let currentPage = 1;
let totalHits = 0;

// create SimpleLightbox instance


var lightbox = new SimpleLightbox('a', {
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
  });


// main logick
button.addEventListener('click', event => {
    event.preventDefault();

    if (input.value) {
        currentPage = 1;
        totalHits = 0;
        gallery.innerHTML = '';
        // observer.observe(guardian);
        pixabayAPI(input.value, 1);
        // observer.observe(listener);
        // observer.observe(guardian);
    }
});

async function pixabayAPI(request, page = 1) {
    const KEY = '33025300-4f56a11ea42b0ad7a58370454';
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PICTURES_PER_PAGE}&page=${page}`);
        // console.log(response);
        // console.log(response.data.totalHits);
        if (page === 1) {
            totalHits = response.data.totalHits;
            observer.observe(guardian);
            if (totalHits > 0) {
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            }
        }

        const picturesArr = response.data.hits;
        // console.log(picturesArr);
        // console.log(picturesArr[0]);

        let galleryMarkup = '';

        if (picturesArr.length === 0) {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
        } else {
            picturesArr.forEach(element => {
                galleryMarkup = galleryMarkup + `
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
            });
        }
        console.log('main func done!')
        // gallery.innerHTML = galleryMarkup;
        gallery.insertAdjacentHTML('beforeend', galleryMarkup);
        // if (currentPage === 1) {
        //     observer.observe(guardian);
        // }
        currentPage += 1;
        // galleryLightbox.refresh();

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
    // entries.forEach(entry => {
    //     if (entry.isIntersecting) {
            
    //     }
    // })

    // if (exp < 2) {
    //     exp += 1;
    //     return;
    // }

    console.log(entries);
    console.log(entries[0].isIntersecting);

    if (entries[0].isIntersecting) {
        if ((totalHits + PICTURES_PER_PAGE - 1) > currentPage*PICTURES_PER_PAGE) {
            pixabayAPI(input.value, currentPage);
            // console.log('API called!');
        } else {
            observer.unobserve(guardian);
        }
    }


    // if ((totalHits + PICTURES_PER_PAGE - 1) > currentPage*PICTURES_PER_PAGE) {
    //     pixabayAPI(input.value, currentPage);
    //     // console.log('API called!');
    // } else {
    //     observer.unobserve(guardian);
    // }
};

// const addPicturesTrottled = throttle(addPictures, 500);
// const observer = new IntersectionObserver(addPicturesTrottled, obsOptions);
const observer = new IntersectionObserver(addPictures, obsOptions);





// var target = document.querySelector('#listItem');
// observer.observe(listener);
// const addPicturesDebounced = debounce(addPictures, 3000);

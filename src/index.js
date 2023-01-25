import axios from "axios";
import Notiflix from 'notiflix';
// import debounce from "debounce";
import throttle from "lodash.throttle";

const input = document.querySelector('#search-form input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const guardian = document.querySelector('.guardian');

const PICTURES_PER_PAGE = 40;



let exp = 0;






// console.log(listener);

let currentPage = 1;
let totalHits = 0;

button.addEventListener('click', event => {
    event.preventDefault();

    if (input.value) {
        currentPage = 1;
        totalHits = 0;
        gallery.innerHTML = '';
        pixabayAPI(input.value, 1);
        // observer.observe(listener);
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
                        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
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
        
        // gallery.innerHTML = galleryMarkup;
        gallery.insertAdjacentHTML('beforeend', galleryMarkup);
        if (currentPage === 1) {
            observer.observe(guardian);
        }
        currentPage += 1;
    } catch(error) {
        Notiflix.Notify.failure(error.message);
        console.log('We are here')
    }
}


// observer
const obsOptions = {
    root: null,
    rootMargin: '0px',
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

    if ((totalHits + 39) > currentPage*40) {
        pixabayAPI(input.value, currentPage);
        console.log('API called!');
    } else {
        observer.unobserve(guardian);
    }
};

const addPicturesTrottled = throttle(addPictures, 3000);
const observer = new IntersectionObserver(addPicturesTrottled, obsOptions);






// var target = document.querySelector('#listItem');
// observer.observe(listener);
// const addPicturesDebounced = debounce(addPictures, 3000);


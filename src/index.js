import axios from "axios";
import Notiflix from 'notiflix';

const input = document.querySelector('#search-form input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');

let page = 1;
let totalHits = 0;

// console.log(input);
// console.log(button);
// console.log(gallery);

button.addEventListener('click', event => {
    event.preventDefault();

    page = 1;

    if (input.value) {
        pixabayAPI(input.value, page);
        // console.log(input.value);
    }
})

async function pixabayAPI(request, page = 1) {
    const KEY = '33025300-4f56a11ea42b0ad7a58370454';
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
        console.log(response);
        console.log(response.data.totalHits);
        if (page === 1) {
            totalHits = response.data.totalHits;
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        // totalHits = response.data.totalHits;
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
        
        gallery.innerHTML = galleryMarkup;
        page += 1;
    } catch(error) {
        // console.log(error.message);
        Notiflix.Notify.failure(error.message);
    }
}

// pixabayAPI('cat');


// console.log("Hello!");

import Notiflix from 'notiflix';
import axios from "axios";

const input = document.querySelector('#search-form input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');

console.log(input);
console.log(button);
console.log(gallery);

// async function pixabayGetAPI() {
//     const KEY = '33025300-4f56a11ea42b0ad7a58370454';
//     const response = await fetch(`https://pixabay.com/api/?key=${KEY}&q=yellow+flowers&image_type=photo`);
//     return response.json();
// }

// const axios = require('axios');

// axios.get('https://pixabay.com/api/?key=33025300-4f56a11ea42b0ad7a58370454&q=yellow+flowers&image_type=photo')
//   .then(function (response) {
//     console.log(response);
//   })

// async function pixabayGetAPI() {
//     const KEY = '33025300-4f56a11ea42b0ad7a58370454';
//     const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=yellow+flowers&image_type=photo`);
//     return response.json();
// }

// const resp = pixabayGetAPI();
// console.log(resp);

// axios.get('https://pixabay.com/api/?key=33025300-4f56a11ea42b0ad7a58370454&q=yellow+flowers&image_type=photo')
//   .then(res => {
//     console.log(res.data);
//   });

async function pixabayAPI(request) {
    const KEY = '33025300-4f56a11ea42b0ad7a58370454';
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true`);
        console.log(response);
        const picturesArr = response.data.hits;
        console.log(picturesArr);
        console.log(picturesArr[0]);
        let galleryMarkup = '';
        galleryMarkup = picturesArr.forEach(element => {
            galleryMarkup = galleryMarkup + `
                <div class="photo-card">
                    <img src="${element.webformatURL}" alt="" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                        </p>
                    </div>
                </div>
            `;
            gallery.innerHTML = galleryMarkup;
        });
    } catch(error) {
        console.log(error.message);
    }
}

pixabayAPI('yellow+flowers');


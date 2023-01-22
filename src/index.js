console.log("Hello!");

const gallery = document.querySelector('.gallery');

async function pixabayGetAPI() {
    const KEY = '33025300-4f56a11ea42b0ad7a58370454';
    const response = await fetch(`https://pixabay.com/api/?key=${KEY}&q=yellow+flowers&image_type=photo`);
    return response.json();
}

const resp = pixabayGetAPI();
console.log(resp);

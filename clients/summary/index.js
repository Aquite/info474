const $ = (s) => document.getElementById(s);
let submitbtn = $('submitbtn');
let errors = $('errs');
let title = $('title');
let description = $('description');
let images = $('images');
let videos = $('videos');

submitbtn.addEventListener('click', (e) => {
    e.preventDefault();
    let websiteInput = $('websiteInput');
    let failed = false;
    title.innerHTML = "";
    description.innerHTML = "";
    images.innerHTML = "";
    videos.innerHTML = "";
    errors.innerHTML = "";

    fetch(`https://api.pavelsrinidhi.me/v1/summary?url=${websiteInput.value}`).then(d => {
        if (d.status >= 400) {
            // console.log(d.text())
            failed = true;
            return d.text();
        }
        return d.json();
    }).then(d => {
        if (failed) {
            throw new Error(d);
        }


        if (d.title) {
            title.innerText = d.title
        }


        if (d.description) {
            description.innerText = d.description;
        }


        if (d.images && d.images.length > 0) {
            d.images.forEach(image => {
                let imageEl = document.createElement('img');
                imageEl.src = image.url;
                images.append(imageEl);
            });
        }


        if (d.videos && d.videos.length > 0) {
            console.log(d.videos);
            d.videos.forEach(video => {
                let videoEl;
                if (video.type == "text/html") {
                    videoEl = document.createElement('iframe');
                } else if (video.type.startsWith("video/")) {
                    videoEl = document.createElement('video');
                }
                videoEl.src = video.url;
                videos.append(videlEl);
            })
        }
    }).catch(e => {
        errors.innerText = e;
    });
});

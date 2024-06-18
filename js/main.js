'use strict'

const YT_KEY = 'enter google API key here'

function onInit() {
    //default search on first load
    _playDefault()
}

function onSearch() {
    const input = document.getElementById('search-bar').value
    searchYoutube(input)
    getWikiSummary(input)
}

//use the YouTube API to find videos matching the query
function searchYoutube(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet
&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${query}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            renderResults(data.items)
        })
        .catch(error => console.log(error))
}

//render the first video and the five results on the side
function renderResults(results) {
    const searchResults = document.querySelector('.search-results')
    searchResults.innerHTML = ''

    results.forEach((video, index) => {
        const vidId = video.id.videoId
        const vidTitle = video.snippet.title
        const vidThumbnail = video.snippet.thumbnails.default.url

        const elVideo = document.createElement('div')
        elVideo.classList.add('video-item')
        elVideo.innerHTML = `<img src="${vidThumbnail}"> <h3>${vidTitle}</h3>`
        elVideo.onclick = () => playVideo(vidId)

        searchResults.appendChild(elVideo)

        //play first video automatically
        if (index === 0) playVideo(vidId)
    })
}

//focus a video to play it
function playVideo(vidId) {
    const iframe = document.querySelector('.playing-container iframe')
    iframe.src = `https://www.youtube.com/embed/${vidId}`
}

//use the WikiMedia API to find a summary of the query (if exists)
function getWikiSummary(query) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.extract) updateWikiSection(data.title, data.extract)
            else updateWikiSection('', 'No Wikipedia entry found for this search')
        })
        .catch(error => {
            console.log(error)
            updateWikiSection('', 'Failed to load Wikipedia')
        })
}

//display the text that was found (or an error if there isnt one)
function updateWikiSection(title, text) {
    document.querySelector('.wiki-title').innerText = title
    document.querySelector('.wiki-text').innerText = text
}

function _playDefault() {
    let defaultQuery = 'bbno$'
    searchYoutube(defaultQuery)
    getWikiSummary(defaultQuery)
}
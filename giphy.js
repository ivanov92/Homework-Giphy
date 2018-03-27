var buttons = document.getElementById('buttons');
var gifs = document.getElementById('gifs');
var addTopic = document.getElementById('add-topic');

var array = {
  gifs: [],
};

var fetchGifs = (q) => {
  var api_key = 'dc6zaTOxFJmzC';
  var giphyApi = 'http://api.giphy.com/v1/gifs/search';
  var url = `${giphyApi}?q=${q}&api_key=${api_key}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
};

function setGifs(gifs, mapWith, cb) {
  this.gifs = gifs.map(mapWith);
  cb(this.gifs);
}

function togglePlaying(e, cb) {
  var index = e.target.dataset.gifIndex;
  this.gifs = this.gifs.map((gif, i) => {
    if (i == index) {
      return Object.assign({}, gif, {isPlaying: !gif.isPlaying});
    }
    return gif;
  });
  cb(this.gifs);
}

var renderGif = ({ index, isPlaying, playing, still}) => {
  return `
    <div class="gif">
      <img data-gif-index="${index}" src="${isPlaying ? playing : still}" />
    </div>
  `;
};

var renderGifs = function (gifs) {
  this.innerHTML = '';
  this.innerHTML = gifs.map(renderGif).join('');
}.bind(gifs);


var transformGif = (gif, index) => {
  var id = gif.id;
  var { fixed_width, fixed_width_still } = gif.images;
  var playing = fixed_width.url;
  var still = fixed_width_still.url;

  return Object.assign({}, { isPlaying: false, playing, still, index });
};

var onFetch = gifs => setGifs.call(array, gifs, transformGif, renderGifs)

function loadGifs(query) {
  fetchGifs(query)
  .then(onFetch);
}

function topic({which, target}) {
  if (which === 13) {
    var topic = target.value;
    target.value = '';
    buttons.innerHTML += `<button>${topic}</button>`;
    
    loadGifs(topic);
  }
}

gifs.addEventListener('click', (e) => togglePlaying.call(array, e, renderGifs), false);
buttons.addEventListener('click', e => loadGifs(e.target.innerText), false);
addTopic.addEventListener('keyup', topic, false);

loadGifs('cats');
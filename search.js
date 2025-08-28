const RESULTS = document.getElementById("results");
function search() {
  const words = document.getElementById("main-area").value.split(/\s+/);
  clearResults()

  // 'posts' defined in 'get.js'
  postLoop: for (post of posts) {
    for (word of words) {
      if (!post.text.match(word)) {
        continue postLoop;
      }
      addToResults(post)
    }
  }
}


function clearResults() {
  document.getElementById("results").innerHTML = "";
}


function addToResults() {

}


function search() {
  const words = document.getElementById("query")
                        .value.toLowerCase().split(/\s+/);
  clearResults();

  // 'POSTS' defined in 'get.js'
  postLoop: for (post of POSTS) {
    for (word of words) if (!post.text.match(word)) continue postLoop;
    addToResults(post);
  }

  if (RESULTS.innerHTML == "") {
    RESULTS.innerHTML = "<b>NO RESULTS FOUND</b>"
  }
}


function clearResults() {
  RESULTS.innerHTML = "";
}


function addToResults(post) {
  const entry = document.createElement('a');
  entry.href = post.postAddress;
  entry.innerHTML = `<img src="${post.imageAddress}">`
  RESULTS.appendChild(entry);
}

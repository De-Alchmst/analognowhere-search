const parser = new DOMParser();
const posts = [];

async function main() {
   // using API for SOP reasons...
  //  computers were never supposed to be safe...
  const res = await fetch("https://api.codetabs.com/v1/proxy?quest="
    + encodeURIComponent("https://analognowhere.com/_/archive/"));

  if (!res.ok) {
    changeView("loading-error")
    return;
  }

   // I usually scrape with regex, but lets abuse the JS builtin XML parser for
  //  once

  const siteHTML = await res.text();
  const site = parser.parseFromString(siteHTML, "text/html");

  console.log(site.getElementsByClassName("archive")[0].children);

     // 'archive' is a <ul>, full of <li>, which contain <a>
    //  'href' is stored as a full address including protocol and stuff, so
   //   I need to get just the relative part
  //    match returns an array, for some reason, so that is the '[0]'
  const links = Array.from(site.getElementsByClassName("archive")[0].children)
    .map(li => li.firstChild.href.match(/\/_.+/)[0])

  await extractPosts(links);
  changeView("main")
}


async function extractPosts(links) {
  links.forEach(l => {
    console.log(l)
  })
}

main()

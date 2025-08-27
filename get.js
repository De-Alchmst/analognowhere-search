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

     // 'archive' is a <ul>, full of <li>, which contain <a>
    //  'href' is stored as a full address including protocol and stuff, so
   //   I need to get just the relative part
  //    match returns an array, for some reason, so that is the '[0]'
  const links = Array.from(site.getElementsByClassName("archive")[0].children)
    .map(li => li.firstChild.href.match(/_.+/)[0])

  await extractPosts(links.slice(0,5));
  changeView("main");
}


async function extractPosts(links) {
  for (link of links) {
    res = await fetch("https://api.codetabs.com/v1/proxy?quest="
      + encodeURIComponent("https://analognowhere.com/" + link));

    if (!res.ok) {
      changeView("loading-error")
      return;
    }

    postData = {
      title: "",
      subtitle: "",
      description: "",
      imageAddress: "",
    }
    const post = parser.parseFromString(await res.text(), "text/html");

    postData.title = post.getElementsByTagName("h1")[0].innerHTML;
    postData.subtitle = post.getElementsByClassName("desc")[0].innerHTML;

    // desc starts with <summary>, which I want gone
    // I will keep the HTML in, it doesn't really matter...
    const desc = post.getElementsByTagName("details")[0];
    if (desc != undefined) {
      desc.removeChild(desc.firstChild);
      postData.description = desc.innerHTML
    }

    postData.imageAddress = "https://analognowhere.com/"
      + post.getElementsByTagName("img")[0].src.match(/_.+/)[0];

    posts.push(postData);
  }

  console.log(posts)
}


main()

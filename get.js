const PARSER = new DOMParser();
const POSTS = [];

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
  const site = PARSER.parseFromString(siteHTML, "text/html");

     // 'archive' is a <ul>, full of <li>, which contain <a>
    //  'href' is stored as a full address including protocol and stuff, so
   //   I need to get just the relative part
  //    match returns an array, for some reason, so that is the '[0]'
  const links = Array.from(site.getElementsByClassName("archive")[0].children)
    .map(li => li.firstChild.href.match(/_.+/)[0])

  await extractPosts(links);
  changeView("main-area");
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
      text:         "",
      postAddress:  "https://analognowhere.com/" + link,
      imageAddress: "",
    }
    const post = PARSER.parseFromString(await res.text(), "text/html");

    // title
    postData.text = post.getElementsByTagName("h1")[0].innerHTML;
    // subtitle
    postData.text += " " + post.getElementsByClassName("desc")[0].innerHTML;

      // description
    const desc = post.getElementsByTagName("details")[0];
    // not all posts have description
    if (desc != undefined) {
       //  desc starts with <summary>, which I want gone
      //   I will keep the HTML in, it doesn't really matter...
      desc.removeChild(desc.firstChild);
      postData.text += " " + desc.innerHTML;
    }

    postData.text = postData.text.toLowerCase();

    postData.imageAddress = "https://analognowhere.com/"
      + post.getElementsByTagName("img")[0].src.match(/_.+/)[0];

    POSTS.push(postData);
  }

  console.log(POSTS)
}


main()

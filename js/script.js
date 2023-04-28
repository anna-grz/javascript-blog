"use strict";
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
}
const opts = {
  articleSelector: ".post",
  titleSelector: ".post-title",
  titleListSelector: ".titles",
  articleTagsSelector: ".post-tags .list",
  articleAuthorSelector: ".post-author",
  tagsListSelector: ".tags.list",
  cloudClassCount: "5",
  cloudClassPrefix: "tag-size-",
  authorsListSelector: ".authors.list"
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log("Link was clicked!");
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll(".titles a.active");

  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }

  /* [IN PROGRESS] add class 'active' to the clicked link */
  console.log("clickedElement:", clickedElement);
  this.classList.add("active");

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(".post");

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute("href");
  console.log("Article selector:", articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log("targetArticle:", targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add("active");
}


function generateTitleLinks(customSelector = "") {
  console.log(customSelector);

  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  console.log("titleList", titleList);

  titleList.innerHTML = "";

  /*Usuń wszystkie elementy <li> wewnątrz tagu <ul class="list titles">, aby pozostała lista była początkowo pusta.*/

  /*Zadeklaruj nową stałą articles i zapisz do niej odniesienie do wszystkich elementów pasujących do selektora zapisanego w stałej opts.articleSelector*/

  const articles = document.querySelectorAll(
    opts.articleSelector + customSelector
  );
  console.log(opts.articleSelector + customSelector);

  /* for each article */
  let html = "";
  for (let article of articles) {
    /* get the article id */

    const articleId = article.getAttribute("id");

    /* find the title element */

    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    console.log("linkHTMLData", linkHTMLData);
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log("linkHTML", linkHTML);

    /* insert link into titleList */

    titleList.insertAdjacentHTML("beforeend", linkHTML);

    console.log("html", html);
  }

  const links = document.querySelectorAll(".titles a");
  console.log("links", links);

  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999,
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else tags[tag] < params.min;
    {
      params.min = tags[tag];
    }
    console.log(tag + " is used " + tags[tag] + " times");
  }

  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);

  return opts.cloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object*/
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  console.log(opts.articleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(opts.articleTagsSelector);
    console.log("tagWrapper", tagWrapper);

    /* make html variable with empty string */
    let html = "";

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute("data-tags");
    console.log("articleTags:", articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(" ");
    console.log("articleTagsArray", articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      /*const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + "</a></li>";
      console.log("linkHTML", linkHTML); */

      const linkHTMLData = {id: tag, title: tag};
      console.log("linkHTMLData",linkHTMLData);
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log("linkHTML", linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags object*/
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.insertAdjacentHTML("beforeend", html);
    console.log("html", html);

    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  console.log("tagList", tagList);

  const tagsParams = calculateTagsParams(allTags);
  console.log("tagsParams", tagsParams);

  /* [NEW] create variable for all links HTML code */
  /*let allTagsHTML = ''; */
  const allTagsData = {tags: []};

  /* [NEW] START LOP: for each tag in allTags: */
  for (let tag in allTags) {
    /*[NEW] generate code od a link and add it to allTagsHTML */
    //allTagsHTML += tag + ' (' + allTags[tag] + ') ';//
    /*const tagLinkHTML = '<li><a href="tag-' + tag + '">' + tag + ' (' +allTags[tag] + ')</a></li>';*/

    const tagLinkHTML =
      '<li><a href="#tag-' +
      tag +
      '" class="' +
      calculateTagClass(allTags[tag], tagsParams) +
      '">' +
      tag +
      "</a></li>";
    console.log("tagLinkHTML:", tagLinkHTML);

    /*allTagsHTML += tagLinkHTML;*/
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /*[NEW] END LOOP:for each tag in allTags: */
  /*tagList.innerHTML = allTagsHTML;  NIE MAMY JUZ ALLTAGS*/
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log("allTagsData", allTagsData);

}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute("href");
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace("#tag-", "");
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove("active");
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  clickedElement.classList.add("active");
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add("active");
  }
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener("click", tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors() {
  /* [NEW] create object for all authors */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  console.log(opts.articleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {
    /* find author wrapper */
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    console.log("authorWrapper", authorWrapper);

    /* make html variable with empty string */
    /* let html = ''; */

    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute("data-author");
    console.log("articleAuthor:", articleAuthor);

    /* generate HTML of the link */
    /*const linkHTML =
      '<li><a href="#author-' +
      articleAuthor +
      '">' +
      articleAuthor +
      "</a></li>";
    console.log("linkHTML", linkHTML); */

    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    console.log("linkHTMLData", linkHTMLData);
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log("linkHTML", linkHTML);


    /* add generated code to html variable */

    /* check if this is NOT already in allAuthors */
    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      /*[NEW] add author to allAuthor object*/
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /* insert HTML of all the links into the authors wrapper */
    authorWrapper.insertAdjacentHTML("beforeend", linkHTML);
    console.log("linkHTML", linkHTML);
  }
  /* END LOOP: for every article: */

  /* [NEW] Find list of authors in right column */
  const authorList = document.querySelector(opts.authorsListSelector);
  console.log("authorList", authorList);

  /*[NEW] create variable for all links HTML code */
  let allAuthorsHTML = "";

  /*[NEW] START LOOP: for each author in authorList: */
  for (let author in allAuthors) {
    const authorLinkHTML =
      '<li><a href="#author-' +
      author +
      '">' +
      author +
      " (" +
      allAuthors[author] +
      ")</a></li>";

    console.log("authorLinkHTML:", authorLinkHTML);

    allAuthorsHTML += authorLinkHTML;
  }

  /*[NEW] END LOOP: for each author in allAuthors */
  authorList.innerHTML = allAuthorsHTML;
}

generateAuthors();

function authorClickHandler(event) {
  /* DONE prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* DONE make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute("href");
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace("#author-", "");
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll(
    'a.active[href^="#author-"]'
  );
  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove("active");
  }
  /* END LOOP: for each active tag link */

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks) {
    /* add class active */
    authorLink.classList.add("active");
  }
  /* END LOOP: for each found author link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to tags */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener("click", authorClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToAuthors();

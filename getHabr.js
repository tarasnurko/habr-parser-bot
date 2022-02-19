import fetch from "node-fetch";
import cheerio from "cheerio";

const mainUrl = "https://habr.com";
const url = "https://habr.com/ru/flows/develop/";

const getHTML = async () => {
  const html = await fetch(url)
    .then((res) => res.text())
    .then((html) => html);
  return html;
};

let getData = async () => {
  const html = await getHTML();
  // console.log(html);
  let data = [];
  const $ = cheerio.load(html);
  $(".tm-articles-list__item").each((i, elem) => {
    data.push({
      title: $(elem).find("h2 .tm-article-snippet__title-link span").text(),
      img: $(elem).find("img.tm-article-snippet__lead-image").attr("src"),
      text: $(elem)
        .find(".article-formatted-body.article-formatted-body_version-2 p")
        .text(),
      link: `${mainUrl}${$(elem)
        .find(".tm-article-snippet__title-link")
        .attr("href")}`,
    });
  });
  return data;
};

const getLastHabr = async () => {
  const habrs = await getData();
  const lastHabr = habrs[0];

  return lastHabr;
};

export { getLastHabr };

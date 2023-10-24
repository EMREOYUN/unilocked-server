import { htmlToText } from "../services/html-to-txt";

export function blogArticleSeo(article: any) {
  return [
    {
      property: "og:url",
      content:  process.env.APP_PATH + "/news/" + article.id,
      nodeName: "meta",
    },
    {
      property: "og:title",
      content: `${article.title} - AnimeciX`,
      nodeName: "meta",
    },
    {
      property: "og:description",
      content: htmlToText(article.body).slice(0, 200),
      nodeName: "meta",
    },
    {
      property: "keywords",
      content:
        "movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast",
      nodeName: "meta",
    },
    { property: "og:type", content: "video.movie", nodeName: "meta" },
    {
      property: "og:image",
      content: article.meta.poster,
      nodeName: "meta",
    },
    { property: "og:image:width", content: "270", nodeName: "meta" },
    { property: "og:image:height", content: "400", nodeName: "meta" },
    { property: "og:site_name", content: "AnimeciX", nodeName: "meta" },
    { name: "twitter:card", content: "summary", nodeName: "meta" },
    {
      nodeName: "link",
      rel: "canonical",
      href: process.env.APP_PATH + "/news/" + article.id,
    },
    {
      nodeName: "title",
      _text: `${article.title} - AnimeciX`,
    },
    {
      name: "description",
      content: htmlToText(article.body).slice(0, 200),
      nodeName: "meta",
    },
  ];
}

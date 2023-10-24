export function blogArticlesSeo() {
  return [
    {
      property: "og:url",
      content: "https://animecix.net/news",
      nodeName: "meta",
    },
    {
      property: "og:title",
      content: "Son Haberler - AnimeciX",
      nodeName: "meta",
    },
    {
      property: "og:description",
      content: "AnimeciX üzerinde paylaşılmış son haberlere göz atın.",
      nodeName: "meta",
    },
    {
      property: "keywords",
      content:
        "movies, films, movie database, actors, actresses, directors, stars, synopsis, trailers, credits, cast",
      nodeName: "meta",
    },
    { property: "og:type", content: "website", nodeName: "meta" },
    { property: "og:site_name", content: "AnimeciX", nodeName: "meta" },
    { name: "twitter:card", content: "summary", nodeName: "meta" },
    { nodeName: "link", rel: "canonical", href: "https://animecix.net/news" },
    { nodeName: "title", _text: "Son Haberler - AnimeciX" },
    {
      name: "description",
      content: "AnimeciX üzerinde paylaşılmış son haberlere göz atın.",
      nodeName: "meta",
    },
  ];
}

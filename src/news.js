import sa from "superagent";

function getArticles(city, country) {
  var query = `${city} ${country}`;
  console.log(`Searching news for ${query}`);
  return sa
    .get("http://localhost:3000/news")
    .query({ query })
    .then((res) => {
      return res.body;
    });
}

export { getArticles };

const API_KEY = "5baa70002ce74c1cacf4d1346c8c864b";
const BASE = "https://api.worldnewsapi.com/search-news?";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const url =
      `${BASE}api-key=${API_KEY}&text=${encodeURIComponent(query)}` +
      "&language=en&number=12";
    const res  = await fetch(url);
    const data = await res.json();
    bindData(data.news || []);       
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function bindData(articles) {
  const cardsContainer   = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.image) return;        
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg    = cardClone.querySelector("#news-img");
  const newsTitle  = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc   = cardClone.querySelector("#news-desc");

  newsImg.src         = article.image;
  newsTitle.textContent = article.title;
  newsDesc.textContent  = article.text.slice(0, 140) + "…";

  const date = new Date(article.publish_date).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  newsSource.textContent = `${article.source_domain} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText   = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

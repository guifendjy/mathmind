var quote = document.querySelector(".quote");
var author = document.querySelector(".author");

var Quotes = [
  {
    quote:
      "Without mathematics, there’s nothing you can do. Everything around you is mathematics. Everything around you is numbers.",
    author: "Shakuntala Devi, Indian writer and mental calculator",
  },
  {
    quote:
      "If I have seen further than others, it is by standing upon the shoulders of giants.",
    author: "Isaac Newton",
  },
  {
    quote: "Silence is better than unmeaning words.",
    author: "Pythagoras",
  },
  {
    quote: "A mathematician is a device for turning coffee into theorems.",
    author: "Paul Erdos",
  },
  {
    quote:
      "To address questions of scientific responsibility does not necessarily imply that one needs technical competence in a particular field (e.g. biology) to evaluate certain technical matters.",
    author: "Serge Lang",
  },
];

let randomQuote = Math.floor(Math.random() * Quotes.length);
console.log(Quotes[randomQuote]);

quote.innerHTML = Quotes[randomQuote].quote;
author.innerHTML = Quotes[randomQuote].author;

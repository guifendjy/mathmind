window.MathJax = {
  startup: {
    pageReady: function () {
      return MathJax.startup.defaultPageReady();
    },
  },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
};

//
//  Load MathJax
//
var script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
script.setAttribute("id", "MathJax-script");
document.head.appendChild(script);

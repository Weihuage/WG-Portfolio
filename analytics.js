// Analytics beacon — pings /track on page load
(function () {
  // Derive a pageId from the current path ("/" → "home")
  const path = window.location.pathname;
  const pageId =
    path === "/" || path === ""
      ? "home"
      : path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-"); // "/projects/" → "projects"

  fetch("https://gyzau16ub8.execute-api.us-east-1.amazonaws.com/prod/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageId }),
    keepalive: true, // lets the request finish even if the user navigates away
  }).catch(() => {
    /* silently ignore — analytics should never break the page */
  });
})();

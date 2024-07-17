const navigateXStep = 100;
const navigateInterval = 200;
let lastKey = null;
let holdingKey = null;

function getLinkItems() {
  const mainContentEl = document.querySelector(
    "[role=main], main, #main, #content"
  );

  const body = mainContentEl ?? document.body;

  // We could extend to include inputs, etc
  const links = [...body.querySelectorAll("a[href]")].filter(
    // Must be "items.nextElement" and be visible (offsetparent is null if it's hidden with a display property)
    (e) => typeof e.focus === "function" && e.offsetParent !== null
  );

  let activeIndex = 0;
  links.forEach((el, i) => {
    if (document.activeElement === el) {
      console.log("switching active to");
      activeIndex = i;
    }
  });

  const nextElement =
    links.length > activeIndex + 1 ? links[activeIndex + 1] : links[0];
  const prevElement =
    activeIndex == 0 ? links[links.length - 1] : links[activeIndex - 1];

  return { nextElement, prevElement };
}

function listen() {
  // Inject focus css
  const css = window.location.host.endsWith("google.com")
    ? "a:focus h3, a:focus>span { box-shadow: 0 0 0 3px hsla(220, 100%, 50%, 80%); }"
    : "a:focus { outline: red 1; }";
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.appendChild(document.createTextNode(css));

  // Listen to keys

  document.body.addEventListener("keyup", (e) => {
    // Reset key being held down
    holdingKey = null;
  });
  document.body.addEventListener("keydown", (e) => {
    if (e.target != document.body && e.target.nodeName !== "A") {
      // This event originates from a specific element (i.e. input element) that's not a link which we navigate with J/K
      // Ignore
      return;
    }

    switch (e.key) {
      case "j": {
        const interval = setInterval(() => {
          if (!holdingKey) clearInterval(interval);
          window.scrollBy({
            top: navigateXStep,
            left: 0,
            behavior: "smooth",
          });
        }, navigateInterval)
        break;
      }
      case "k": {
        const interval = setInterval(() => {
          if (!holdingKey) clearInterval(interval);
          window.scrollBy({
            top: -navigateXStep,
            left: 0,
            behavior: "smooth",
          });
        }, navigateInterval)
        break;
      }
      case "J": {
        // link forward
        const items = getLinkItems();
        items.nextElement.focus({ focusVisible: true });
        break;
      }
      case "K": {
        // link backward
        const items = getLinkItems();
        items.prevElement.focus({ focusVisible: true });
        break;
      }
      case "H": {
        // history backward
        history.back();
        break;
      }
      case "L": {
        // history forward
        history.forward();
        break;
      }
      case "g": {
        if (lastKey === 'g') {
          window.scrollTo(0, 0);
	}
	break;
      }
      case "G": {
	window.scrollTo(0, 10_000);
      }
    }

    lastKey = e.key;
  });
}

listen();

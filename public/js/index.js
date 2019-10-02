import anime from "./anime.es.js";
import { Point } from "./models/point.js";
import {
  getTopDirectionPoint,
  getBottomDirectionPoint
} from "./utils/point.js";

export const getHypotenuse = (a, b) => {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};

document.querySelectorAll(".mobile-menu-icon").forEach(element => {
  element.addEventListener("click", event => {
    document.querySelector(".mobile").setAttribute("active", true);
  });
});

document.querySelectorAll(".close-icon").forEach(element => {
  element.addEventListener("click", event => {
    document.querySelector(".mobile").removeAttribute("active");
  });
});

const width = Math.max(document.body.clientWidth);
const height = Math.max(document.body.clientHeight);

const rocketPath = document.querySelector("#rocket-path");

if (width < 750) {
  rocketPath.setAttribute("d", `M${1680} -200 C1131,915 301,1001 ${-600} 1080`);
}

const path = anime.path("#rocket-path");

const w = Math.round((window.innerWidth / 1980) * 10) / 10;
/**
 * @param {Element} element dom element
 */
const getCoordinatesOfElement = element => {
  const elementRect = element.getBoundingClientRect();
  return new Point(
    elementRect.x + elementRect.width / 2,
    elementRect.y + elementRect.height / 2
  );
};

const createSvg = (element, attributes) => {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    element
  );
  Object.keys(attributes).forEach(attribute => {
    circle.setAttribute(attribute, attributes[attribute]);
  });
  return circle;
};

const createCircle = attributes => {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  Object.keys(attributes).forEach(attribute => {
    circle.setAttribute(attribute, attributes[attribute]);
  });
  return circle;
};

let previous = null;
let i = 0;
const mask = document.querySelector("#myMask");


anime({
  targets: [".green-comet", ".yellow-comet"],
  rotate: {
    value: 45,
    duration: 0
  },
  translateY: height * 2,
  easing: "linear",
  duration: 3000,
  loop: true,
  delay: anime.stagger(1400),
  begin: animation => {
    animation.animatables.forEach(({ target }) => {
      target.style.opacity = 1;
    });
  }
});



anime({
  targets: "#rocket",
  translateX: path("x"),
  translateY: path("y"),
  rotate: path("angle"),
  easing: "linear",
  duration: 3000,
  direction: "reverse",
  begin: animation => {
    const rocket = animation.animatables[0].target;
    rocket.style.opacity = 1;
  },
  complete: animation => {
    const rocket = animation.animatables[0].target;
    rocket.style.opacity = 0;
    rocket.style.zIndex = -2;

    setTimeout(() => {
      document.querySelector(".delete").remove();
    }, 3200);
  },
  update: animation => {
    const rocket = animation.animatables[0].target;
    const rocketCoordinates = getCoordinatesOfElement(rocket);

    if (previous) {
      if (i % 3 === 0) {
        const dist = anime.random(400, 500) * w;

        const startRadius = 20 * w;

        const topDirectionPoint = getTopDirectionPoint(
          rocketCoordinates,
          previous,
          dist
        );
        const bottomDirectionPoint = getBottomDirectionPoint(
          rocketCoordinates,
          previous,
          dist
        );

        const cx = rocketCoordinates.x;
        const cy = rocketCoordinates.y - 20;

        const circleTop = createCircle({
          r: startRadius,
          cx,
          cy
        });

        const circleBottom = createCircle({
          r: startRadius,
          cx,
          cy
        });

        window.requestAnimationFrame(() => {
          const id = "top" + i;
          circleTop.setAttribute("id", id);
          mask.appendChild(circleTop);

          circleBottom.setAttribute("id", "bottom" + i);
          mask.appendChild(circleBottom);

          const r = anime.random(600, 1000) * w;

          const top = anime({
            targets: `#${id}`,
            translateX: topDirectionPoint.x - r / 3,
            translateY: topDirectionPoint.y - r / 3,
            r,
            easing: "linear",
            duration: anime.random(3000, 9000)
          });

          const bottom = anime({
            targets: "#bottom" + i,
            translateX: bottomDirectionPoint.x - r / 3,
            translateY: bottomDirectionPoint.y + r / 3,
            r,
            easing: "linear",
            duration: anime.random(3000, 9000)
          });

          setTimeout(() => {
            top.pause();
            bottom.pause();
          }, 3200);
        });
      }
    }
    previous = rocketCoordinates;
    i += 1;
  }
});

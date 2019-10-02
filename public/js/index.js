import anime from "./anime.es.js";
import { Point } from "./models/point.js";
import {
  getTopDirectionPoint,
  getBottomDirectionPoint
} from "./utils/point.js";

export const getHypotenuse = (a, b) => {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};

document.querySelector(".mobile-menu-icon").addEventListener("click", event => {
  document.querySelector(".menu").setAttribute("active", true);
});

const width = Math.max(document.body.clientWidth);
const height = Math.max(document.body.clientHeight);

console.log(width, height);

const rocketPath = document.querySelector("#rocket-path");

if (width < 750) {
  rocketPath.setAttribute("d", `M${width} 0 L ${width} 1080`);
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

const createCircle = (x, y) => {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("r", 20);
  circle.setAttribute("fill", "red");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
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
  translateY: 2000,
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
  },
  update: event => {
    const rocket = event.animatables[0].target;
    const rocketCoordinates = getCoordinatesOfElement(rocket);

    if (previous) {
      if (i % 3 === 0) {
        const dist = anime.random(400, 500);
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

        const circleTop = createCircle(
          Math.round(rocketCoordinates.x),
          Math.round(rocketCoordinates.y - 30)
        );

        const circleBottom = createCircle(
          Math.round(rocketCoordinates.x),
          Math.round(rocketCoordinates.y - 30)
        );

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
            duration: anime.random(4000, 9000)
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

import anime from "animejs";
import Parallax from "parallax-js";

import { getSizeOfScreen, getCoordinatesOfElement } from "./utils/index.js";
import {
  getTopDirectionPoint,
  getBottomDirectionPoint
} from "./utils/point.js";

import "./index.scss";

document.querySelectorAll(".mobile-menu-icon").forEach(element => {
  element.addEventListener("click", () => {
    document.querySelector(".mobile").setAttribute("active", true);
  });
});

const { width, height } = getSizeOfScreen();

const getDestination = width => {
  if (width < 500) {
    return `M${600} -200 L${600} 1080`;
  }

  if (width < 750) {
    return "M1680 -200 C1131,915 301,1201 -600 1080";
  }
  return "M-305,42.25 C640,1500 1270,210 1920, 242.25";
};

const d = getDestination(width);

const rocketPath = document.querySelector("#rocket-path");
rocketPath.setAttribute("d", d);

const w = Math.round((width / 1980) * 10) / 10;

const path = anime.path("#rocket-path");

const createCircle = attributes => {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  Object.keys(attributes).forEach(attribute => {
    element.setAttribute(attribute, attributes[attribute]);
  });
  return element;
};

const mask = document.querySelector("#myMask");

const startStarsAnimation = () => {
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
};

const startRocketAnimation = function() {
  let previous = null;
  let i = 0;

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
      }, 1000);
    },
    update: animation => {
      const rocket = animation.animatables[0].target;
      const rocketCoordinates = getCoordinatesOfElement(rocket);

      if (previous) {
        if (i % 3 === 0) {
          const dist = anime.random(400, 500) * w;

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

          const cx = rocketCoordinates.x + 15;
          const cy = rocketCoordinates.y - 20;
          const r = 20 * w;

          const circleTop = createCircle({
            r,
            cx,
            cy
          });

          const circleBottom = createCircle({
            r,
            cx,
            cy
          });

          window.requestAnimationFrame(() => {
            mask.appendChild(circleTop);
            mask.appendChild(circleBottom);
            const endRadius = anime.random(600, 1000) * w;

            const top = anime({
              targets: circleTop,
              translateX: Math.round(topDirectionPoint.x - endRadius / 3),
              translateY: Math.round(topDirectionPoint.y - endRadius / 3),
              r: endRadius,
              easing: "linear",
              duration: anime.random(3000, 9000)
            });

            const bottom = anime({
              targets: circleBottom,
              translateX: Math.round(bottomDirectionPoint.x - endRadius / 3),
              translateY: Math.round(bottomDirectionPoint.y + endRadius / 3),
              r: endRadius,
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
};

window.onload = () => {
  const oldParallaxInitialise = Parallax.prototype.initialise;
  Parallax.prototype.initialise = function(...rest) {
    this.transform2DSupport = true;
    oldParallaxInitialise.apply(this, rest);
  };

  new Parallax(document.querySelector("#scene"), {
    relativeInput: true
  });

  startStarsAnimation();
  startRocketAnimation();
};

// if (width < 750) {
//   setTimeout(() => {
//     anime({
//       targets: "#filler",
//       r: "150%",
//       easing: "linear",
//       duration: 5000
//     });
//   }, 2500);
// }

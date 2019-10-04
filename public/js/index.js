import anime from "./anime.es.js";
import { getSizeOfScreen, getCoordinatesOfElement } from "./utils/index.js";
import {
  getTopDirectionPoint,
  getBottomDirectionPoint
} from "./utils/point.js";
document.querySelectorAll(".mobile-menu-icon").forEach(element => {
  element.addEventListener("click", event => {
    document.querySelector(".mobile").setAttribute("active", true);
  });
});

let movement = 0;

let isPlaying = false;

let translateX = 0;
let translateY = 0;

document.addEventListener("mousemove", event => {
  const x = event.movementX / 10;
  const y = event.movementY / 10;

  translateX += -x;
  translateY += -y;

  if (isPlaying) {
    return;
  }

  isPlaying = true;
  let duration = 0;

  anime({
    targets: ".big-blue-planet",
    translateX,
    translateY,
    easing: "linear",
    duration: duration,
    complete: () => {
      isPlaying = false;
    }
  });

});

document.querySelectorAll(".close-icon").forEach(element => {
  element.addEventListener("click", event => {
    document.querySelector(".mobile").removeAttribute("active");
  });
});

let active = null;

document.querySelector("nav").addEventListener("click", event => {
  const parent = event.target.parentNode;
  if (!parent.classList.contains("navbar-item")) {
    return;
  }

  const duration = 250;

  const whiteCircle = parent.querySelector(".white-circle");
  const purpleCicle = parent.querySelector(".purple-circle");

  if (active !== parent && active !== null) {
    active.classList.remove("active");

    anime({
      targets: active.querySelector(".white-circle"),
      scale: 1,
      easing: "linear",
      duration
    });

    anime({
      targets: active.querySelector(".purple-circle"),
      scale: 1,
      easing: "linear",
      duration,
      complete: animation => {
        animation.animatables[0].target.style.opacity = 0;
      }
    });
  }

  active = parent;

  if (parent.classList.contains("active")) {
    parent.classList.remove("active");

    anime({
      targets: whiteCircle,
      scale: 1,
      easing: "linear",
      duration
    });

    anime({
      targets: purpleCicle,
      scale: 1,
      easing: "linear",
      duration,
      complete: animation => {
        animation.animatables[0].target.style.opacity = 0;
      }
    });
  } else {
    parent.classList.add("active");

    anime({
      targets: whiteCircle,
      scale: 2,
      easing: "linear",
      duration,
      begin: () => {
        purpleCicle.style.opacity = 1;
      }
    });

    anime({
      targets: purpleCicle,
      scale: 6,
      easing: "linear",
      duration,
      begin: () => {
        purpleCicle.style.opacity = 1;
      }
    });
  }
});

const { width, height } = getSizeOfScreen();

if (width < 500) {
  const rocketPath = document.querySelector("#rocket-path");
  rocketPath.setAttribute("d", `M${600} -200 L${600} 1080`);
} else if (width < 750) {
  const rocketPath = document.querySelector("#rocket-path");
  rocketPath.setAttribute("d", `M${1680} -200 C1131,915 301,1201 ${-600} 1080`);
}

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

let previous = null;
let i = 0;

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
    }, 4000);
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
            translateX: topDirectionPoint.x - endRadius / 3,
            translateY: topDirectionPoint.y - endRadius / 3,
            r: endRadius,
            easing: "linear",
            duration: anime.random(3000, 9000)
          });

          const bottom = anime({
            targets: circleBottom,
            translateX: bottomDirectionPoint.x - endRadius / 3,
            translateY: bottomDirectionPoint.y + endRadius / 3,
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

if (width < 750) {
  setTimeout(() => {
    anime({
      targets: "#filler",
      r: "150%",
      easing: "linear",
      duration: 5000
    });
  }, 2500);
}

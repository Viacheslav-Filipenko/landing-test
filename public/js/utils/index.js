import { Point } from "../models/point.js";

export const getSizeOfScreen = () => {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  };
};

/**
 * @param {Element} element dom element
 */
export const getCoordinatesOfElement = element => {
  const elementRect = element.getBoundingClientRect();
  return new Point(
    elementRect.x + elementRect.width / 2,
    elementRect.y + elementRect.height / 2
  );
};

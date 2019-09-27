import { Point } from "../models/point.js";

/**
 * @param {Point} point the current point
 * @param {Point} previous the previous point
 * @param {Number} dist the distance
 */
export function getTopDirectionPoint(point, previous, dist) {
  const x =
    // point.x -
    -Math.sin(
      Math.PI / 2 - Math.atan((previous.x - point.x) / (point.y - previous.y))
    ) * dist;

  const y =
    // point.y -
    -Math.cos(
      Math.PI / 2 - Math.atan((previous.x - point.x) / (point.y - previous.y))
    ) * dist;

  return new Point(x, y);
}

/**
 * @param {Point} point the current point
 * @param {Point} previous the previous point
 * @param {Number} dist the distance
 */
export function getBottomDirectionPoint(point, previous, dist) {
  const x =
    // point.x +
    Math.sin(
      Math.PI / 2 - Math.atan((previous.x - point.x) / (point.y - previous.y))
    ) * dist;

  const y =
    // point.y +
    Math.cos(
      Math.PI / 2 - Math.atan((previous.x - point.x) / (point.y - previous.y))
    ) * dist;

  return new Point(x, y);
}

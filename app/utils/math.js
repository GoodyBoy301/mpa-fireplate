import gsap from "gsap";

export function lerp(p1, p2, t) {
  return gsap.utils.interpolate(p1, p2, t);
}

export function clamp(min, max, number) {
  return gsap.utils.clamp(min, max, number);
}

export function random(min, max) {
  return gsap.utils.random(min, max);
}

export function asyncRandom(limit, timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() * limit);
    }, timeout);
  });
}

export function map(valueToMap, inMin, inMax, outMin, outMax) {
  return gsap.utils.mapRange(inMin, inMax, outMin, outMax, valueToMap);
}

export function pixelToRem(pixels, innerWidth = window.innerWidth) {
  return (innerWidth / 1512) * 10 * pixels;
}

export function snap(
  value,
  lowerLimit,
  upperLimit,
  fractStart = 0,
  fractEnd = 6
) {
  let normal = map(value, lowerLimit, upperLimit, fractStart, fractEnd);
  normal = Math.round(normal);
  const snapTo = (normal / fractEnd) * upperLimit;
  return snapTo;
}

export function snapTo(
  normal,
  upperLimit,
  lowerLimit,
  fractStart = 0,
  fractEnd = 6
) {
  if (!lowerLimit) {
    return (normal / fractEnd) * upperLimit;
  } else {
    const snapTo = (normal / fractEnd) * upperLimit;
    return map(snapTo, fractStart, upperLimit, lowerLimit, upperLimit);
  }
}

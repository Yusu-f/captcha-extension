window.onload = () => {
  const captcha_url =
    "https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAAAAMA_2879CfdnfUAZltc7A==&cid=6ZSI0uIpS~gpxjTA9XvPgBqi6z7kWTh~rqo4bitv3Lz6qlrgzUBIQJge6Dcvk5T5Ggd5UqkOnccPMxPCwG6XUKtnl4YDlBqCxbQJyfZoqRPmGYljP3MlLUAO9M6cp5x9&referer=https%3A%2F%2Fwww.idealista.it%2Fit%2Flogin.ajax&hash=AC81AADC3279CA4C7B968B717FBB30&t=fe&s=17991&e=e79907076ea0c3c57857c5dcd1384349c552f94a63911dda4b74d6127026a08b&cid=6ZSI0uIpS~gpxjTA9XvPgBqi6z7kWTh~rqo4bitv3Lz6qlrgzUBIQJge6Dcvk5T5Ggd5UqkOnccPMxPCwG6XUKtnl4YDlBqCxbQJyfZoqRPmGYljP3MlLUAO9M6cp5x9&dm=jd";
  solveDataDome(window.location.href, captcha_url, navigator.userAgent);
};

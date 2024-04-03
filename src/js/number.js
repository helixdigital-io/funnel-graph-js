const roundPoint = number => Math.round(number * 10) / 10;
const formatNumber = (number, precision = 2) => Number(number.toFixed(precision));

const outputFormatter = number => number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export { roundPoint, formatNumber, outputFormatter };

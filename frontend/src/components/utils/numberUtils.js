export const digitToComma = function(price) {
  if (!isNaN(parseInt(price))) {
    price = price ? price.toString() : "0";
    var answer = "";

    for (var i = 0; i < price.length; i++) {
      answer = answer.concat(price[i]);
      if ((price.length - 1 - i) % 3 === 0 && i < price.length - 1) {
        answer = answer.concat(",");
      }
    }

    return answer;
  }
  return price;
};
export const phoneNumberBeautifier = function(phone) {
  if (phone === 0) return "";
  let p = String(parseInt(phone));
  return p.slice(0, 3) + " " + p.slice(3, 6) + " " + p.slice(6, 11);
};

const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function enToFa(str) {
  if (!str) return "";
  str = str.toString();
  for (let i = 0; i < en.length; i++) {
    str = str.replace(new RegExp(en[i], "g"), fa[i]);
  }
  return str;
}

const comma = ",";

export function priceToPersian(price) {
  let priceString = String(+price);
  if (isNaN(priceString)) priceString = "0";
  const answer = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, comma);
  return enToFa(answer);
}

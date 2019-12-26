export const validatePaymentData = paymentObject => {
  const isValuableNumber = value =>
    !Number.isNaN(Number(value)) && Number(value) && Number(value) > 0;

  const filterMoney = ([_, value]) => isValuableNumber(value);

  const filterCashCardAmount = ([key, _]) =>
    key === "cash_amount" || key === "card_amount";

  const filterCheque = ([key, _]) =>
    key === "amount" ||
    key === "number" ||
    key === "bank" ||
    key === "issue_date" ||
    key === "expiry_date";

  if (paymentObject.type === "cash_card") {
    const output = {
      ...Object.fromEntries(
        Object.entries(paymentObject)
          .filter(filterCashCardAmount)
          .filter(filterMoney)
      ),
      type: "cash_card"
    };
    if (
      output.hasOwnProperty("cash_amount") === false &&
      output.hasOwnProperty("card_amount") === false
    )
      throw new Error(errorMsgTwoFieldIsEmpty);

    // if (
    //   output.hasOwnProperty("cash_amount") === true &&
    //   output.hasOwnProperty("card_amount") === true
    // )
    //   throw new Error(errorMsgTwoFieldIsFilled);
    return output;
  }

  if (paymentObject.type === "cheque") {
    return {
      ...Object.fromEntries(Object.entries(paymentObject).filter(filterCheque)),
      type: "cheque"
    };
  }
};

export const errorMsgTwoFieldIsFilled =
  "هر دو مقدار مبلغ نقدی و مبلغ کارت به صورت همزمان نمی‌توان پر شوند";
export const errorMsgTwoFieldIsEmpty =
  "یکی از مقدارهای مبلغ کارت یا مبلغ نقد حتما باید پر شوند.";

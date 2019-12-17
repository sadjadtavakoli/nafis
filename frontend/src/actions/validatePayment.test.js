import {
  validatePaymentData,
  errorMsgTwoFieldIsFilled,
  errorMsgTwoFieldIsEmpty
} from "./validatePayment";

describe("transform object with only usefull fields for sending to api", () => {
  test("cheque filled", () => {
    const input = {
      type: "cheque",
      cash_amount: undefined,
      card_amount: undefined,
      amount: 10000,
      number: 123123,
      bank: "melat",
      issue_date: "2019-3-21",
      expiry_date: "2019-4-21"
    };
    const output = validatePaymentData(input);

    const expectOutput = {
      type: "cheque",
      amount: 10000,
      number: 123123,
      bank: "melat",
      issue_date: "2019-3-21",
      expiry_date: "2019-4-21"
    };

    expect(output).toEqual(expectOutput);
  });

  test("chash_card filled_number_1", () => {
    const input = {
      type: "cash_card",
      cash_amount: 100000,
      card_amount: undefined,
      amount: 10000,
      number: 123123,
      bank: "melat",
      issue_date: "2019-3-21",
      expiry_date: "2019-4-21"
    };
    const output = validatePaymentData(input);

    const expectOutput = {
      type: "cash_card",
      cash_amount: 100000
    };

    expect(output).toEqual(expectOutput);
  });

  test("chash_card filled_number_2", () => {
    const input = {
      type: "cash_card",
      cash_amount: 100000,
      card_amount: undefined,
      amount: undefined,
      number: undefined,
      bank: undefined,
      issue_date: undefined,
      expiry_date: undefined
    };
    const output = validatePaymentData(input);

    const expectOutput = {
      type: "cash_card",
      cash_amount: 100000
    };

    expect(output).toEqual(expectOutput);
  });

  test("chash_card filled_number_3", () => {
    const input = {
      type: "cash_card",
      cash_amount: undefined,
      card_amount: undefined,
      amount: undefined,
      number: undefined,
      bank: undefined,
      issue_date: undefined,
      expiry_date: undefined
    };

    expect(function() {
      validatePaymentData(input);
    }).toThrowError(new Error(errorMsgTwoFieldIsEmpty));
  });

  test("chash_card filled_number_4", () => {
    const input = {
      type: "cash_card",
      cash_amount: 100000,
      card_amount: 2000,
      amount: undefined,
      number: undefined,
      bank: undefined,
      issue_date: undefined,
      expiry_date: undefined
    };

    expect(function() {
      validatePaymentData(input);
    }).toThrowError(new Error(errorMsgTwoFieldIsFilled));
  });
});

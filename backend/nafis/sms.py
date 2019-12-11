from datetime import datetime

import requests
from khayyam import JalaliDate


class SendSMS:
    username = "09391201860"
    password = "1201860"

    def group_sms(self, message, mobiles, yourMessageIds):
        api = "http://niksms.com/fa/PublicApi/GroupSms"
        now = JalaliDate.today()
        now_time = datetime.now()
        post_data = {
            'username': self.username,
            'password': self.password,
            'message': message,
            'numbers': mobiles,
            'senderNumber': "50004307",
            'sendOn': "{}/{}/{}-{}:{}".format(now.year, now.month, now.day, now_time.hour,
                                              now_time.minute),
            'yourMessageIds': yourMessageIds,
            'sendType': 1
        }
        print("here")
        result = requests.post(api, post_data)
        return result


def create_message(bill, ):
    items_part = ""
    for index, item in enumerate(bill.items.all()):
        items_part += "{}- {} | {} متر| {} تومان".format(index + 1, item.product.name, item.amount,
                                                         item.final_price)
        items_part += '\n'

    template = "«فاکتور خرید پارچه نفیس»" \
               "\n" \
               + items_part + "" \
                              "مجموع: {} تومان| تخفیف کالایی: {} تومان| تخفیف فاکتوری {} تومان".format(
        bill.price, bill.items_discount, bill.discount) + "\n" \
                                                          "قابل پرداخت: {} تومان".format(
        bill.final_price) + "\n" \
                            "از اعتماد و خرید شما \n" \
                            "اینستاگرام: instagram.com/nafisfabric" \
                            "\n" \
                            "تلگرام: t.m/Nafis_Fabric"

    return template

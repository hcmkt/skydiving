import locale

from flask import Flask, abort, request
from flask_cors import CORS
from linebot.exceptions import InvalidSignatureError
from linebot.models import FollowEvent, MessageEvent, TextMessage, TextSendMessage

import functions
from database import init_db
from init import handler, line_bot_api

app = Flask(__name__)
app.config.from_object("config.Config")
CORS(app, supports_credentials=True)

init_db(app)

locale.setlocale(locale.LC_TIME, "ja_JP.UTF-8")


@app.route("/callback", methods=["POST"])
def callback():
    # get X-Line-Signature header value
    signature = request.headers["X-Line-Signature"]

    # get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
        abort(400)

    return "OK"


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    text = event.message.text
    if text == "全件取得":
        res = functions.get_formatted_all_reservations()
    elif text == "カスタム取得":
        res = functions.get_formatted_custom_reservations(event.source.user_id, True)
    elif text == "公式":
        res = functions.get_official_site_link()
    else:
        return
    line_bot_api.reply_message(event.reply_token, TextSendMessage(text=res))


@handler.add(FollowEvent)
def handle_follow(event):
    functions.add_user(event.source.user_id)
    line_bot_api.reply_message(event.reply_token, TextSendMessage(text="こんにちは"))


if __name__ == "__main__":
    app.run()

import os

from linebot import LineBotApi, WebhookHandler

line_bot_api = LineBotApi(os.getenv("CHANNEL_ACCESS_TOKEN"))
handler = WebhookHandler(os.getenv("CHANNEL_SECRET"))

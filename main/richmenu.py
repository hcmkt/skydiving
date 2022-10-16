import os

from linebot import LineBotApi
from linebot.exceptions import LineBotApiError
from linebot.models import (
    MessageAction,
    RichMenu,
    RichMenuArea,
    RichMenuBounds,
    RichMenuSize,
    URIAction,
)

line_bot_api = LineBotApi(os.getenv("CHANNEL_ACCESS_TOKEN"))

rich_menu_list = line_bot_api.get_rich_menu_list()
for rich_menu in rich_menu_list:
    line_bot_api.delete_rich_menu(rich_menu.rich_menu_id)

rich_menu_to_create = RichMenu(
    size=RichMenuSize(width=2500, height=843),
    selected=True,
    name="Nice richmenu",
    chat_bar_text="メニュー",
    areas=[
        RichMenuArea(bounds=RichMenuBounds(x=0, y=0, width=625, height=843), action=MessageAction(label="all_reservations", text="全件取得")),
        RichMenuArea(
            bounds=RichMenuBounds(x=626, y=0, width=625, height=843), action=MessageAction(label="custom_reservations", text="カスタム取得")
        ),
        RichMenuArea(bounds=RichMenuBounds(x=1251, y=0, width=625, height=843), action=URIAction(label="設定", uri=os.getenv("LIFF_URL"))),
        RichMenuArea(
            bounds=RichMenuBounds(x=1876, y=0, width=625, height=843),
            action=URIAction(
                label="公式サイト",
                uri="https://tokyoskydivingclub.jp/%e3%81%94%e4%ba%88%e7%b4%84/%e4%bd%93%e9%a8%93%e3%82%b9%e3%82%ab%e3%82%a4%e3%83%80%e3%82%a4%e3%83%93%e3%83%b3%e3%82%b0%e3%81%94%e4%ba%88%e7%b4%84/",
            ),
        ),
    ],
)
rich_menu_id = line_bot_api.create_rich_menu(rich_menu=rich_menu_to_create)

with open("richmenu.png", "rb") as f:
    line_bot_api.set_rich_menu_image(rich_menu_id, "image/png", f)

line_bot_api.set_default_rich_menu(rich_menu_id)

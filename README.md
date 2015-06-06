=======
# mail-if-signal-out

一定時間アクセスがなければメールする。

[![Deploy](http://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

# 使い方

`sendgrid`addonを追加します。
``` bash
heroku addons:create sendgrid:starter
```

環境設定を行います。
``` bash
heroku config:set ACCESS_TOKEN=ほげ               \ # 任意のトークン
                  DEFAULT_LIMIT_MIN=20            \ # 20分アクセスがなければメール
                  MAIL_FROM=no-reply@heroku.com   \ # メール差出人
                  MAIL_SUBJECT=通知               \ # メール件名
                  MAIL_TO=hoge@fuga.com           \ # メール送信先
                  SENDGRID_USERNAME=sendgrid_user \ # sendgridのユーザ名
                  SENDGRID_PASSWORD=sendgrid_pass   # sendgridのパスワード
```

メール通知をしたくない場合は`DEFAULT_LIMIT_MIN`分以内にアクセスします。
``` bash
curl https://{your_heroku_domain}/heartbeat -X POST -d "access-token=hoge"
```

`DEFAULT_LIMIT_MIN`分間アクセスがない場合は`MAIL_TO`にメールが来ます。

# その他
車輪の再発明な気がします。

#!/bin/sh

# TODO: デバグモードを受け取れるようにする
nohup node hisyo_app debug >> log/hisyotan.log &

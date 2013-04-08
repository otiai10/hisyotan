#!/bin/sh

if [ $# -lt 1 ]; then
  echo 'OPTION REQUIRED'
  exit 0
fi

case $1 in
  "--start" )
    sleep 1s
    nohup node $PWD/hisyo_app debug >> log/hisyotan.log &
    echo "Hisyotan started."
    sleep 1s
    nohup sh $PWD/cron_set/watcher.sh >> log/watcher.log &
    echo "Watcher started."
    sleep 1s
    break;;
  "--stop" )
    sleep 1s
    node $PWD/hisyo_app stop >> log/hisyotan.log &
    echo "Hisyotan Stopped."
    sleep 1s
    break;;
  "--state" ) ps aux | grep node  | grep $PWD | grep -v grep
    break;;
  * )
    echo "Invalid Option"
esac

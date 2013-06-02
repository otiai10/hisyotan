#!/bin/sh

if [ $# -lt 1 ]; then
  echo 'OPTION REQUIRED'
  exit 0
fi

cur_date=`date '+%Y.%m%d'`
node_log_path='log/hisyotan.'$cur_date'.log'
watcher_log_path='log/watcher.'$cur_date'.log'

case $1 in
  "--start" )
    sleep 1s
    #nohup node $PWD/hisyo_app debug >> $node_log_path &
    nohup node $PWD/hisyo_app >> $node_log_path &
    echo "Hisyotan started."
    sleep 1s
    nohup sh $PWD/cron_set/watcher.sh >> $watcher_log_path &
    echo "Watcher started."
    sleep 1s
    break;;
  "--stop" )
    sleep 1s
    node $PWD/hisyo_app stop
    echo "Hisyotan Stopped."
    sleep 1s
    break;;
  "--restart" )
    node $PWD/hisyo_app stop >> $node_log_path &
    echo "Hisyotan Stopped."
    sleep 1s
    #nohup node $PWD/hisyo_app debug >> $node_log_path &
    nohup node $PWD/hisyo_app >> $node_log_path &
    echo "Hisyotan started."
    sleep 1s
    nohup sh $PWD/cron_set/watcher.sh >> $watcher_log_path &
    echo "Watcher started."
    sleep 1s
    break;;
  "--state" ) ps aux | grep node  | grep $PWD | grep -v grep
    break;;
  * )
    echo "Invalid Option"
esac

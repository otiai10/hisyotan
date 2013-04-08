# watch node process for every 60secs
while true
    do
        result=`ps aux | grep node  | grep hisyo | grep app | wc -l`
        if [ "$result" -lt 1 ]; then
            node ./cron_set/alert.js >> log/watcher.log
            date
            exit
        fi
        sleep 1
    done

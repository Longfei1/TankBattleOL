pids=`ps -ef | grep "server.out" | grep -v "grep" | awk '{print $2}'`
for pid in ${pids[@]}
do
    if [[ $pid -ne "" ]]; then
        echo "killing" $pid
        kill -9 $pid
    fi
done
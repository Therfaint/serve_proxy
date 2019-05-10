status=`pm2 list | grep serve_proxy | awk '{print $2,$12}'`
if [[ $status == "serve_proxy online" ]] ; then
  echo 'online'
else
  echo 'offline'
fi
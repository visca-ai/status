#!/bin/bash

commit=true
origin=$(git remote get-url origin)
if [[ $origin == *statsig-io/statuspage* ]]
then
  commit=false
fi

declare -a KEYSARRAY
declare -a URLSARRAY

urlsConfig="public/urls.cfg"
echo "Reading $urlsConfig"

# Read file and process last line even if no trailing newline
while IFS='=' read -r key url || [[ -n "$key" ]]; do
  # Skip empty lines
  [[ -z "$key" ]] && continue
  # Skip lines starting with [ (group headers) - use simple pattern match
  [[ "$key" == "["* ]] && continue
  # Skip comment lines
  [[ "$key" == "#"* ]] && continue
  
  echo "  $key=$url"
  KEYSARRAY+=("$key")
  URLSARRAY+=("$url")
done < "$urlsConfig"

echo "***********************"
echo "Starting health checks with ${#KEYSARRAY[@]} configs:"

mkdir -p logs

for (( index=0; index < ${#KEYSARRAY[@]}; index++ ))
do
  key="${KEYSARRAY[index]}"
  url="${URLSARRAY[index]}"
  
  # Strip any flags from service name (e.g., |hideUrl=true)
  service_name=$(echo "$key" | cut -d'|' -f1)
  
  # Extract domain from URL as unique identifier
  domain=$(echo "$url" | sed -E 's|^https?://([^/]+).*|\1|')
  # Replace dots and special chars with underscores for safe filenames
  filename_key="${domain//\./_}"
  
  echo "  $service_name=$url (domain: $domain)"

  for i in {1..3}
  do
    response=$(curl -o /dev/null -s -w '%{http_code} %{time_total}' --silent --output /dev/null "$url")
    http_code=$(echo "$response" | cut -d ' ' -f 1)
    time_total=$(echo "$response" | cut -d ' ' -f 2)
    echo "    $http_code $time_total"
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 202 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ]; then
      result="success"
    else
      result="failed"
    fi
    if [ "$result" = "success" ]; then
      break
    fi
    sleep 5
  done
  dateTime=$(date +'%Y-%m-%d %H:%M')
  if [[ $commit == true ]]
  then
    mkdir -p public/status
    echo "$dateTime, $result, $time_total" >> "public/status/${filename_key}_report.log"
    tail -2000 "public/status/${filename_key}_report.log" > "public/status/${filename_key}_report.log.tmp"
    mv "public/status/${filename_key}_report.log.tmp" "public/status/${filename_key}_report.log"
  else
    echo "    $dateTime, $result, $time_total"
  fi
done

if [[ $commit == true ]]
then
  echo "committing logs"
  git config --global user.name 'github-actions[bot]'
  git config --global user.email 'github-actions[bot]@users.noreply.github.com'
  git add -A --force public/status/
  git commit -am '[Automated] Update Health Check Logs'
  git push
fi

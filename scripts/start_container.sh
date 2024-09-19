#!/bin/bash

set -e

docker container run -d -p 4000:4000 --name view_tracker_container --env-file /home/ubuntu/.env kamalkiro/view_api_img

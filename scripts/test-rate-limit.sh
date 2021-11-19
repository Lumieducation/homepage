#!/bin/bash

for i in {1..1050}
do
    curl -o /dev/null -s -w "%{http_code}\n" http://localhost:8080
done
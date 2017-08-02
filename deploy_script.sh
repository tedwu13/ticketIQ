#!/bin/bash
# A sample Bash script to deploy
# COMMIT MESSAGE IS PASSED AS A FIRST VARIABLE

echo $1

git status
git add -A
git commit -m $1
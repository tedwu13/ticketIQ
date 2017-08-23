#!/bin/bash
# A sample Bash script to deploy
# COMMIT MESSAGE IS PASSED AS A FIRST VARIABLE

echo Starting Deploy Script
echo Storing Commit Message As "$*"


echo Checking git status
git status

echo Adding Code changes
git add -A

echo Committing Message
git commit -m "$*"

echo Pushing to Master
git push origin master

# echo Pushing to Heroku
git push heroku master

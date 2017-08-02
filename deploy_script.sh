#!/bin/bash
# A sample Bash script to deploy
# COMMIT MESSAGE IS PASSED AS A FIRST VARIABLE

echo Starting Deploy Script
echo Storing Commit Message As "$*"


git status
git add -A
git commit -m "$*"


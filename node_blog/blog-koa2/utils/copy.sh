#!/bin/sh
cd /Users/wfp/Project/video-tutorial/node-tutorial/code-demo/blog-1
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
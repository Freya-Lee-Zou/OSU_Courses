#!/usr/bin/env bash

#
# Simple "build" script that just copies the app into the build/ directory.
#

mkdir build/
rm -rf build/*
cp -r todos/*.html todos/*.css todos/*.js todos/fontawesome build/

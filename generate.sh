#!/bin/sh
rm **/*.gz *.gz
find * -type f | xargs -n1 gzip -9 -k -f

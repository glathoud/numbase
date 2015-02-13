#!/usr/bin/env sh

set -v
cd /cygdrive/c/alpportal/dev/javascript/
export A=numbase.`date +"%Y-%m-%d-%Hh%M"`.tar.gz ; tar zcf $A numbase ; cp $A /cygdrive/e/
cd -
set +v
ls -lrt /cygdrive/e/ | tail -1
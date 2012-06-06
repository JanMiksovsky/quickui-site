This folder contains scripts for building and deploying the site.

= BUILD =
Run the build script to build the site. It can be run from any folder.

= DEPLOY =
This uses rsync to copy the built site to quickui.org. By design, that script
can be run as a bash script or a Windows command file (run via cmd < deploy).
One limitation of that arrangement is that the deploy script should only be run
from within this directory.

This is the source of the QuickUI project site at quickui.org.
 
This includes docs, the tutorial, installation instructions, etc. This does *not*
include
* the QuickUI tools
* the QuickUI runtime (quickui.js)
* the quicommon library.
Those are built out of the main quickui repo at https://github.com/JanMiksovsky/quickui.

The source for this site expects to find the above files on the same local or remote
server. To run this site locally, you'll need to redirect some calls from the local
quickui-site source to the local or remote quickui source. E.g.:

<VirtualHost *:80>
    DocumentRoot C:/Source/quickui-site
    ServerName quickui
    Redirect /lib/quickui.js http://localhost/quickui/lib/quickui.js
    Redirect /quicommon http://localhost/quickui/quicommon
</VirtualHost>

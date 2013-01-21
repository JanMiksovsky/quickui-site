###
The QuickUI logo
###

class window.Logo extends Control
  inherited:
    content: [" ",
      control: "Link"
      href: "/"
      ref: "logotype"
      content: " <span class=\"bracket\">&lt;</span>QuickUI<span class=\"bracket\">&gt;</span> "
    , " ",
      html: "<div>Web control framework</div>"
      ref: "tagline"
    , " "]

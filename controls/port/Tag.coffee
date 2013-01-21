Tag = Control.sub(
  className: "Tag"
  tag: "span"
  inherited:
    content: ["&lt;",
      html: "<span />"
      ref: "Tag_content"
    , ">"]
)
Tag::extend content: Control.chain("$Tag_content", "content")

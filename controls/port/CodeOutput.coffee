CodeOutput = Control.sub(
  className: "CodeOutput"
  inherited:
    content: [" ",
      control: "Demo"
      ref: "CodeOutput_content"
    
    # <div ref="_label">(live control)</div> 
    , " ", " "]
)
CodeOutput::extend content: Control.chain("$CodeOutput_content", "content")

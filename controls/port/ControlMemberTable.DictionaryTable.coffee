###
Shows the documented members for a control class. 
###

class window.ControlMemberTable extends DictionaryTable
  inherited: {}

  describeClass: Control.property["class"]((describeClass) ->
    documentation = @_classMemberDocumentation(describeClass)
    documentation = @_sortDictionary(documentation)
    @content documentation
  )
  
  # Return the documentation for the given class, including its base classes up
  # to (but not including) Control.
  _classMemberDocumentation: (describeClass, linkToDeclaringClass) ->
    className = describeClass::className
    documentation = controlDocumentation and controlDocumentation[className]
    return null  unless documentation?
    documentation = @_formatDocumentation(documentation)
    if linkToDeclaringClass
      
      # Append to each member description a link to this class' catalog page.
      for member of documentation
        documentation[member] = [documentation[member], " From ", CatalogLink.create().content(className), "."]
    superclass = describeClass.superclass
    if superclass and superclass isnt Control
      
      # Add base class documentation to the documentation for this class.
      baseClassDocumentation = @_classMemberDocumentation(superclass, true)
      for member of baseClassDocumentation
        # Only grab base class members not already documented; we only want the
        # description from the most specific class.
        documentation[member] = documentation[member] or baseClassDocumentation[member]
    documentation

  _formatDocumentation: (documentation) ->
    formattedDocumentation = {}
    if documentation and documentation.members
      $.each documentation.members, (memberName, memberDescription) ->
        # Add break tags wherever there are consecutive line breaks.
        formattedDescription = memberDescription.replace(/\n\n/g, "<br/><br/>")
        # Add break tags wherever line breaks are followed by whitespace.
        formattedDescription = formattedDescription.replace(/\n\s+/g, "<br/>")
        formattedDocumentation[memberName] = formattedDescription

    formattedDocumentation

  # Return a copy of the given dictionary with its items sorted by keys.
  _sortDictionary: (dictionary) ->
    keys = []
    for key of dictionary
      keys.push key
    sortedKeys = keys.sort()
    result = {}
    i = 0
    length = sortedKeys.length

    while i < length
      key = sortedKeys[i]
      result[key] = dictionary[key]
      i++
    result

VersionedFileLink = Link.sub(
  className: "VersionedFileLink"
  inherited: {}
)
VersionedFileLink::extend file: Control.property((file) ->
  fileInfo = quickUIVersion[file]
  @content fileInfo.fileName
  releaseUrl = "/release/"
  url = releaseUrl + fileInfo.fileName
  @href url
)

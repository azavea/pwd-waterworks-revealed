## Scripts

The following scripts were created to modify the original zone images provided by Victoria. The scripts should be run from the parent directory containing the images, i.e. `src/quests/fairmount-water-works`. You will see some errors/warnings when running a script if a diretory does not contain any images.

`convert-images.sh` - Converts images to a different type. Currently setup to do `.tif` -> `.jpg`.

`resize-images.sh` - Resizes images. Currently setup to resize to 1024px x 1024px. Respects the aspect ratio of the image.

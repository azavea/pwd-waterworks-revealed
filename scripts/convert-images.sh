list=`find * -type d`
root=`pwd`
for directory in $list; do
  cd $directory
  mogrify -format jpg -quality 70 *.tif
  cd $root
done

list=`find * -type d`
root=`pwd`
for directory in $list; do
  cd $directory
  mogrify -resize 1024x1024 *.jpg
  cd $root
done

echo "<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
<plist version=\"1.0\">
<dict>
   <key>items</key>
   <array>
       <dict>
           <key>assets</key>
           <array>
               <dict>
                   <key>kind</key>
                   <string>software-package</string>
                   <key>url</key>
                   <string>$JENKINS_BUILD_URL/app-$BUILD_NUMBER.ipa</string>
               </dict>
               <dict>
                   <key>kind</key>
                   <string>display-image</string>
                   <key>needs-shine</key>
                   <true/>
                   <key>url</key>
                   <string>$SMALL_ICON_URL</string>
               </dict>
               <dict>
                   <key>kind</key>
                   <string>full-size-image</string>
                   <key>needs-shine</key>
                   <true/>
                   <key>url</key>
                   <string>$LARGE_ICON_URL</string>
               </dict>
           </array>
           <key>metadata</key>
           <dict>
               <key>bundle-identifier</key>
               <string>$BUNDLE_IDENTIFIER</string>
               <key>bundle-version</key>
               <string>$VERSION</string>
               <key>kind</key>
               <string>software</string>
               <key>title</key>
               <string>Water Revealed</string>
               <key>subtitle</key>
               <string>Water Revealed</string>
           </dict>
       </dict>
   </array>
</dict>
</plist>"

# TestApplication
# android-pkg-app-template

Update submodule pos-android

Before building, in **pos-plugin run** ```npm run build:android``` copy pkg executable file from pos-plugins/pkg/build/app-android to android-dist/app/src/main/assets/appAssets (executable file name must be "app") or run ```npm run build:android:dest``` to do both steps above 

Run ./gradlew build or use Android Studio to build this project

Run ```npm run build:apk``` to do all steps above

#### Note

Change app's display name in ```android-dist/app/src/main/res/values```

Change applicationId in ```android-dist/app/build.gradle```

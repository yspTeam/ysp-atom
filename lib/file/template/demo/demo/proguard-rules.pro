# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/galen/Tools/android-sdk-macosx/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

-applymapping ../mapping.txt

-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers


-dontpreverify
-verbose
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*
-dontwarn android.support.v4.**
-dontwarn javax.microedition.khronos.**
#-keepattributes InnerClasses
-keepattributes JavascriptInterface
-keepattributes Signature
-keepattributes *Annotation*
-ignorewarnings


-dontoptimize

-keepclasseswithmembers class * {
    native <methods>;
}

-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
    public static ** valueOf(int);
}

-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
    <fields>;
    <methods>;
}

-keep class * implements java.io.Serializable {
    *;
}

-keepattributes SourceFile,LineNumberTable

-keep class * extends android.view.View

-keep class com.yymobile.core.ICoreClient {
    #<fields>;
    <methods>;
}

-keep class * implements com.yymobile.core.ICoreClient {
	#<fields>;
    public <methods>;
}

-keepclassmembers class * {
    @com.yy.mobile.util.DontProguardMethod <methods>;
}

-keepclassmembers class * {
    @com.yymobile.core.CoreEvent <methods>;
}

-keep class * implements com.yy.android.small.pluginbase.IPluginEntryPoint { *; }


-keep class * extends com.yy.mobile.YYHandler

-keepclassmembers class * {
    @com.yy.mobile.YYHandler$MessageHandler <methods>;
}

-keepclassmembers class * {
    @com.duowan.mobile.service.EventNotifyCenter$MessageHandler <methods>;
}


package com.paylap.paylapscore

import android.os.Build
import android.os.Bundle


import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.ReferrerDetails;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.InstallReferrerClient.InstallReferrerResponse;
import android.util.Log;


import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper



class MainActivity : ReactActivity() {
   private InstallReferrerClient referrerClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Step 1: Initialize the InstallReferrerClient
        referrerClient = InstallReferrerClient.newBuilder(this).build();

        // Step 2: Start the connection to the Play Store
        referrerClient.startConnection(new InstallReferrerStateListener() {
            @Override
            public void onInstallReferrerSetupFinished(int responseCode) {
                switch (responseCode) {
                    case InstallReferrerResponse.OK:
                        // Successfully connected to the Play Store
                        handleReferrerData();
                        break;
                    case InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                        // Install Referrer API not supported on this device
                        Log.e("InstallReferrer", "Feature not supported");
                        break;
                    case InstallReferrerResponse.SERVICE_UNAVAILABLE:
                        // Connection to the Play Store failed
                        Log.e("InstallReferrer", "Service unavailable");
                        break;
                }
            }

            @Override
            public void onInstallReferrerServiceDisconnected() {
                // Try to reconnect if the connection to the Play Store is lost
                Log.e("InstallReferrer", "Service disconnected");
            }
        });
    }
     private void handleReferrerData() {
        try {
            ReferrerDetails response = referrerClient.getInstallReferrer();
            
            // Step 4: Get the referral code from the referrer URL
            String referrerUrl = response.getInstallReferrer();

            // Parse the referral code if available
            if (referrerUrl != null && referrerUrl.contains("referral=")) {
                String referralCode = referrerUrl.substring(referrerUrl.indexOf("referral=") + 9);
                Log.d("InstallReferrer", "Referral Code: " + referralCode);

                // Now you can use this referral code in your app, e.g., autofill the sign-up form
                // Example: Send this referral code to a React Native component or use it directly in native code
            }

            // Step 5: Get other referrer details (optional)
            long referrerClickTime = response.getReferrerClickTimestampSeconds();
            long appInstallTime = response.getInstallBeginTimestampSeconds();
            boolean hasGooglePlayInstant = response.getGooglePlayInstantParam();

            Log.d("InstallReferrer", "Referrer Click Time: " + referrerClickTime);
            Log.d("InstallReferrer", "App Install Time: " + appInstallTime);
            Log.d("InstallReferrer", "Google Play Instant Param: " + hasGooglePlayInstant);

        } catch (Exception e) {
            Log.e("InstallReferrer", "Failed to retrieve install referrer data", e);
        } finally {
            // Always close the connection
            referrerClient.endConnection();
        }
    }




  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}

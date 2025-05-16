This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/environment-setup) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Set Up Android Studio and Emulator

- **Install [Android Studio](https://developer.android.com/studio)** if you haven't already.
- Open Android Studio and set up the Android SDK as described in the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup).
- In Android Studio, open the **Device Manager** and start an Android Virtual Device (emulator).
- **Alternatively:** You can connect a physical Android device with USB debugging enabled.

## Step 3: Build and Run Your App on Android

With Metro running and your Android emulator (or device) ready, open a new terminal window in your project root and run:

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

If everything is set up correctly, you should see your app running in the Android Emulator or on your connected device.

## Step 4: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).


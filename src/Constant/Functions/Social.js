import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
GoogleSignin.configure({
  webClientId:
    '588965472745-rt3bsprcn2410nvp0anb3tgqplrmjs89.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    '588965472745-93kv8g8dqjvmgvaqia1n8osd46gtbso9.apps.googleusercontent.com',
});
//fb Login
const handleFacebookSignin = async () => {
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
    // 'user_friends',
  ]);
  // setRes(results);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();
  // data && setFbLoading(true);
  // Create a graph request asking for user information

  // ('data', data);
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );
  // Sign-in the user with the credential
  return {
    response: await auth().signInWithCredential(facebookCredential),
    fbToken: data?.accessToken,
  };
};

//google login
const handleGoogleSignin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

export {handleFacebookSignin, handleGoogleSignin};

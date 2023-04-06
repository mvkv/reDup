import { redirectToGoogleAuth } from '../../utils/GoogleAuthRedirect';

const SignInWithGoogle = () => {
  return (
    <button
      onClick={() => redirectToGoogleAuth()}
      className="py-3 pr-4 pl-11 rounded-[3px] bg-white border-gray-100 border-[1px] text-gray-500 text-sm font-medium font-sans bg-g-logo bg-no-repeat bg-[center_left_1rem] w-fit shadow-g-box hover:shadow-g-box-hov"
    >
      Sign in with Google
    </button>
  );
};

export default SignInWithGoogle;

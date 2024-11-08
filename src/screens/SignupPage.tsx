/* eslint-disable no-unused-vars */
import React from 'react';
import { Input } from '@nextui-org/react';
import { useState, useMemo, useEffect, useContext } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../config/AuthContext.tsx';
import { auth } from '../config/firebase.ts';
import { useNavigate } from 'react-router-dom';


import { TbMail } from 'react-icons/tb';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { VscKey } from "react-icons/vsc";
import { FiEye, FiEyeOff } from 'react-icons/fi';


import { motion } from 'framer-motion'; 

import Emailheader from '../components/Emailheader.tsx';
import Footer from '../components/Footer.tsx';

// import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';


interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}


const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const navigate = useNavigate();


  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (email === '') return false;
    return validateEmail(email) ? false : true;
  }, [email]);


  const evaluatePasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'Bad';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  const handleAuth = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setError(null);

    // const emailDomain = email.split('@')[1];

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // const uid = userCredential.user.uid;

        // make this so that the email must be verified before it can continue
        
        await sendEmailVerification(userCredential.user);

        // const companyQuery = query(collection(db, 'companies'), where('domain', '==', emailDomain));
        // const companySnapshot = await getDocs(companyQuery);

        // if (!companySnapshot.empty) {
        //   const companyDoc = companySnapshot.docs[0].data();
        //   const companyName = companyDoc.companyName;

        //   await setDoc(doc(db, 'users', uid), {
        //     uid,
        //     email,
        //     company: companyName,
        //   });

        //   navigate('/interests');
        // } else {
        //   navigate('/company-entry');
        // }

        // await auth.signOut();
        navigate('/verify-email');

      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Error with authentication:', error);

      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setError('User not found. Redirecting to sign-up...');
        setTimeout(() => {
          setIsSignUp(true); 
          setError(null); 
        }, 2000);
      } else {
        setError(error.message); 
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const strength = evaluatePasswordStrength(pwd);
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  return (
    <div
      className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
    >
      <Emailheader />

      <motion.div
        initial={{ y: '10vw' }}
        animate={{ y: 0 }}
        exit={{ y: '-10vw' }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="w-full h-[83%] lg:h-[75%] flex justify-center">
        <div
          className=" w-[85%] lg:w-[75%] py-10 lg:py-0 rounded-lg xl:w-[70%] border-none lg:border bg-transparent dark:border dark:border-opacity-20 dark:bg-[#44427C] border-gray-200 lg:grid flex flex-col  lg:grid-cols-2"
        >

          <form
            onSubmit={handleAuth}
            className="xl:px-20 lg:px-7  flex flex-col relative justify-center items-center"
          >
            <Input
              size="lg"
              radius="sm"
              type="email"
              variant="bordered"
              required
              label="Continue with your company email"
              placeholder=""
              labelPlacement="outside"
              isInvalid={isInvalid}
              errorMessage="Please enter a valid email"
              onValueChange={setEmail}
              startContent={
                <TbMail
                  className={`${isInvalid && 'text-red-600'
                    } text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                />
              }
              endContent={
                <div>
                  {!isInvalid && email !== '' && (
                    <IoIosCheckmarkCircleOutline
                      size={'20px'}
                      className="text-green-500"
                    />
                  )}
                </div>
              }
            />

            <Input
              size="lg"
              radius="sm"
              type={isPasswordVisible ? 'text' : 'password'}
              variant="bordered"
              label="Enter your password"
              placeholder=""
              required
              labelPlacement="outside"
              onChange={handlePasswordChange}
              onValueChange={setPassword}
              startContent={
                <VscKey
                  className={`${isInvalid && 'text-red-600'
                    } text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                />
              }
              endContent={
                <div onClick={togglePasswordVisibility} className={` ${passwordStrength !== 'Strong' && password != "" && 'text-red-600' } cursor-pointer`}>
                  {isPasswordVisible ? (
                    <FiEyeOff size={'20px'} />
                  ) : (
                    <FiEye size={'20px'} />
                  )}
                </div>
              }
            />
            {password && (
              <div className="w-full px-1 flex">
                <p className={`mb-3 font-light text-xs  ${passwordStrength === 'Bad' ? 'text-red-600' : passwordStrength === 'Good' ? 'text-yellow-600' : 'text-green-600'}`}>
                  Password strength: {passwordStrength}
                </p>
              </div>
            )}

            {error && <p className="text-red-600 mt-2">{error}</p>}
            <button
              type="submit"
              className={`${!isInvalid && email !== '' && password !== ''
                  ? ' dark:bg-[#FFC157] dark:text-black  dark:hover:bg-[#f1b54d] bg-[#FFC157]   hover:bg-[#f1b54d] text-white'
                  : 'bg-gray-200'
                } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-3 lg:mt-5`}
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>

            {!isSignUp && (
              <div className="mt-1 w-full flex justify-end">
                <span
                  className="text-blue-600 text-sm cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </span>
              </div>
            )}

            <div className="mt-4 text-center">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setIsSignUp(false)}
                  >
                    Log In
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </span>
                </p>
              )}
            </div>

            <div className="  lg:absolute lg:bottom-[10%] mt-10 lg:mt-0 xl:bottom-[10%] lg:px-7 xl:px-20 text-sm">
              <p className="font-light leading-[16px] lg:leading-[15px]">
                By inserting your email, you confirm your agreement to
                WhisperOut Terms and Conditions and WhisperOut contacting you
                about our products and services. You can opt at any time by
                deleting your account. Find out more about our
                <span className="italic lg:hidden inline ml-1 font-medium">Privacy Policy</span>
              </p>
              <h4 className="italic hidden lg:flex font-normal">Privacy Policy</h4>
            </div>
          </form>

          <div className="flex -order-1 lg:order-1  flex-col justify-center lg:mb-0 mb-16 lg:py-0 lg:px-7 xl:px-20">
            <h1 className=" text-2xl lg:text-3xl font-bold mb-10">{isSignUp ? 'Say Hello' : 'Log in'} to WhisperOut</h1>
            <div>
              <p className="font-light text-[14px] leading-[16px]">
                WhisperOut is your go-to spot for real talk, zero judgment. Got
                questions you’ve been too shy to ask? Or opinions you want to
                share without the side-eye? WhisperOut lets you dive into
                honest, anonymous conversations about your company that&apos;s all
                about keeping it real. It’s where curiosity meets freedom. Ask
                anything, share your thoughts, and connect with others, all
                while staying completely under the radar.
              </p>
              <h3 className="mt-4 font-medium">WhisperOut, Every Voice Matters.</h3>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default SignupPage;

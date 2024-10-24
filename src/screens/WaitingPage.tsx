import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc, getDoc  } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../config/AuthContext';
import Footer from '../components/Footer';

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

const WaitingPage = () => {
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user) return;

      try {
        const companyRef = doc(db, 'companies', user.uid);
        const companyQuery = query(collection(db, 'companies'), where('createdBy', '==', user.uid));
        const companySnap = await getDocs(companyQuery);

        console.log("comapyda--> "+JSON.stringify(companySnap.docs[0]))

        if (!companySnap.empty) {
          const { approvalStatus } = companySnap.docs[0].data();
          setApprovalStatus(approvalStatus);
        } else {
          console.error('No company request found.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    const intervalId = setInterval(checkApprovalStatus, 5000); 

    return () => clearInterval(intervalId);
  }, [user]);

//   useEffect(() => {
//     if (approvalStatus) {
//       navigate('/interests'); // Proceed to the next page if approved
//     }

useEffect(() => {
    const createUser = async () => {
      if (approvalStatus && user) {
        try {
        //   const emailDomain = user.email.split('@')[1];
        //   const companyRef = doc(db, 'companies', emailDomain);
        //   const companySnap = await getDoc(companyRef);
        //   const companyName = companySnap.exists() ? companySnap.data().companyName : '';

        const emailDomain = user.email.split('@')[1];
          const companyRef = doc(db, 'companies', emailDomain);
          const companySnap = await getDoc(companyRef);

          console.log("comapy dat=>"+JSON.stringify(companySnap.exists()))

          const companyName = companySnap.exists() ? companySnap.data().companyName : '';


          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            company: companyName,
          });

          navigate('/interests');
        } catch (error) {
          console.error('Error creating user after company approval:', error);
        }
      }
    };

    createUser();
  }, [approvalStatus, navigate, user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}>
      <div className="w-full py-7 lg:py-20 h-[93%] lg:h-[90%] flex xl:py-28 items-center flex-col ">
        <p>Your company creation request is currently under review.</p>
      </div>
      <Footer />
    </div>
  );
};

export default WaitingPage;

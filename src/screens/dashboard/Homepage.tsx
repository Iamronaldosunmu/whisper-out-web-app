import ChatRoom from '../../components/dashboard/ChatRoom';
import AdSection from '../../components/dashboard/AdSection'
import ChannelSection from '../../components/dashboard/ChannelSection'
import Header from '../../components/dashboard/Header'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../config/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const Homepage = () => {

    const [isVerified, setIsVerified] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccessPermissions = async () => {
      if (!user) {
        navigate('/signup'); 
        return;
      }

      try {
        if (user.emailVerified) {
          setIsVerified(true);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().company) {
            setHasCompany(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccessPermissions();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isVerified || !hasCompany) {
    return <Navigate to="/waiting-page" />;
  }

    return (
        <div className=' max-h-screen dark:bg-maindark h-screen  ' >
            <div className="h-[10%] ">
                <Header />
            </div>
            <div className='flex  px-20 h-[90%]   '>
                <ChannelSection />
                <div className=' ml-[20%]  p-5 w-[65%] overflow-y-auto h-[80vh] ' >
                    <Routes>
                        <Route path="/" element={<Navigate to="welfare" />} />
                        <Route path="welfare" element={<ChatRoom channel="Welfare" />} />
                        <Route path="salaries" element={<ChatRoom channel="Salaries" />} />
                        <Route path="office-space" element={<ChatRoom channel="Office Space" />} />
                        <Route path="tech-jobs" element={<ChatRoom channel="Tech Jobs" />} />
                        <Route path="finance" element={<ChatRoom channel="Finance" />} />
                        <Route path="internship" element={<ChatRoom channel="Internship" />} />
                    </Routes>
                </div>
                <AdSection />
            </div>
        </div>
    )
}

export default Homepage
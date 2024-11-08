import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChannelSection = () => {
    const location = useLocation();
    const [activeChannel, setActiveChannel] = useState(location.pathname);

    useEffect(() => {
        setActiveChannel(location.pathname);
    }, [location.pathname]);
    
    const channels = [
        { title: "welfare", img_dark: "/assets/images/icons/channels/channels_light/welfare-pension-insurance-premium_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
        { title: "salaries", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/salary-wage_svgrepo.com.png", link: "salaries" },
        { title: "office space", img_dark: "/assets/images/icons/channels/channels_light/office-chair_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/office-chair_svgrepo.com.png", link: "office-space" },
        { title: "tech jobs", img_dark: "/assets/images/icons/channels/channels_light/jobsmajor_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/jobsmajor_svgrepo.com.png", link: "tech-jobs" },
        { title: "finance", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "finance" },
        { title: "internship", img_dark: "/assets/images/icons/channels/channels_light/student-duotone_svgrepo.com (2).png", img_light: "/assets/images/icons/channels/student-duotone_svgrepo.com.png", link: "internship" },
    ];


    const darkMode = useSelector((state: any) => state.theme.darkMode);


    console.log("the link-> " + activeChannel)

    const createChannel = () => {

    }

    return (
        <div className=' w-[20%] fixed left-[40px] h-[89%] p-5  ' >

            <div className="h-[10%] ">
                <div onClick={createChannel} className=' cursor-pointer dark:text-black dark:bg-white hover:bg-[#FFC157] duration-200 bg-[#FFC157] flex justify-center capitalize font-medium items-center text-xl rounded-md p-3 ' >
                    suggest channel
                    <div className='ml-2 text-2xl'>
                    <IoIosAddCircleOutline  />
                    </div>
                </div>
            </div>

            <div className=' bg-white  dark:bg-[#44427C80]  p-2 h-[80%] rounded-md overflow-hidden ' >
                <div className=' mb-5 capitalize  ' >
                    {channels.map((item, index) => (
                        <Link to={item.link}  onClick={() => setActiveChannel("/home/"+item.link)} key={index} className={` font-medium mb-2 flex p-4 ${activeChannel === "/home/"+item.link ? " dark:bg-maindark dark:border-gray-50 bg-[#F2F2F2] border-maindark border-opacity-30  " : " border-transparent "} hover:bg-gray-300 border rounded-lg  dark:hover:bg-maindark  cursor-pointer duration-200 `} >
                            <Image src={!darkMode ? item.img_dark : item.img_light} className={` mr-3 rounded-none ${activeChannel === "/home/"+item.link && " text-[#FFC157]  "}  `} />
                            {item.title}
                        </Link>
                    ))}
                </div>

            <div className='border-t dark:border-gray-100 border-maindark flex mx-5 mt-[40%] p-2 justify-center items-center capitalize  ' >
                <span>about</span>
                <span className=" px-1 flex justify-center  items-center ">.</span>
                <span>terms</span>
                <span className=" px-1 flex justify-center  items-center ">.</span>
                <span>privacy</span>
            </div>
            </div>

            <div className=' h-[10%] flex items-center ' >
                <ToggleSwitch />
            </div>


        </div>
    )
}

export default ChannelSection

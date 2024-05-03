import { useState } from "react";
import Sidebar from "../Sidebar";
import HomeContent from "./HomeContent";
import TextToImage from "./TextToImage";
import Hamburger from "../Form-Inputs/Hamburger";

function Main() {
  const [contentSelection, setContentSelection] = useState('home');
  const [showSidebar, setShowSidebar] = useState('true');

  const setContent = (event) => {
    const { name } = event.currentTarget;
    setContentSelection(name);
  }

  const toggleSidebar = () => {
    setShowSidebar(prevState => !prevState);
  }

  return (
    <div className="flex h-full bg-slate-300">
      {showSidebar ? <Sidebar setContent={setContent} toggleSidebar={toggleSidebar}/> : null}
      
      <div className="flex flex-col w-full h-full">

        <div className="fixed top-0 z-40 w-full min-h-24 bg-slate-200">
          {showSidebar ? null : <Hamburger toggleSidebar={toggleSidebar} />}
        </div>

        {contentSelection === 'home'
        ? <HomeContent />
        : contentSelection === 'text-to-image'
        ? <TextToImage />
        : "Page is Work In Progress"}
      
      </div>
      
    </div>
  );
}
  
export default Main;
  
import { useState } from "react";
import Sidebar from "../Sidebar";
import HomeContent from "./HomeContent";
import TextToImage from "./TextToImage";

function Main() {
  
  const [contentSelection, setContentSelection] = useState('home');

  const setContent = (event) => {
    const { name } = event.currentTarget;
    setContentSelection(name);
 }
  console.log(contentSelection);
  
  return (
    <div className="flex bg-slate-300 grow h-max">
      <Sidebar setContent={setContent}/>

      {contentSelection === 'home'
        ? <HomeContent />
        : contentSelection === 'text-to-image'
        ? <TextToImage />
        : "Page is Work In Progress"}
    </div>
  );
}
  
export default Main;
  
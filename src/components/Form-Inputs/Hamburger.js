function Hamburger({toggleSidebar}) {
    return (
        <button className="m-6" type="button" onClick={toggleSidebar}>
            <svg className="w-10 h-10 stroke-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    );
}
  
export default Hamburger;
  
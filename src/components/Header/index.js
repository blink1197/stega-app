function Header() {
    return (
      <header className="flex">
        <div className="hidden h-24 bg-slate-900 max-w-60 grow md:flex">
          <img className="self-center w-32 m-auto" src="./images/Logo.png"/>
        </div>
        <div className="h-24 pl-5 my-auto md:hidden">
          <svg className="w-8 h-8 mt-7 stroke-gray-500" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11H15M1 6H15M1 1H15" stroke="current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </header>
    );
  }
  
export default Header;
  
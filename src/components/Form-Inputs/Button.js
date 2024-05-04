function Button({buttonText, onClick}) {
    return (
        <div className="flex justify-center">
           <button className="w-40 h-12 text-xl text-white bg-green-600 border rounded-2xl " onClick={onClick}>{buttonText}</button>
        </div>
    );
}
  
export default Button;
  
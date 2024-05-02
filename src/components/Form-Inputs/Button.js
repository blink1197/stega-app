function Button({buttonText}) {
    return (
        <div className="flex justify-center">
           <button className="w-40 h-12 text-xl text-white bg-green-600 border rounded-2xl hover:bg-white hover:border-4 hover:text-green-600 hover:border-green-600">{buttonText}</button>
        </div>
    );
}
  
export default Button;
  
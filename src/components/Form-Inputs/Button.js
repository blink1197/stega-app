function Button({buttonText, onClick, size = ''}) {
    let buttonClass = '';

    switch (size) {
        case 'sm':
            buttonClass = 'w-20 h-6 text-[12px] text-green-600 bg-white border rounded-xl border-1 border-green-600';
            break;
        default:
            buttonClass = "w-40 h-12 text-xl text-white bg-green-600 border rounded-2xl "
            break;
    }
        
    return (
        <div className="flex justify-center">
           <button className={buttonClass} onClick={onClick}>{buttonText}</button>
        </div>
    );
}
  
export default Button;
  
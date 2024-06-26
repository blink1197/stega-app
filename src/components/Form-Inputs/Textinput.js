function TextInput({placeholder, name, onChange, value}) {
    return (
        <div className="pl-6">
            <input className="w-full p-2 border-2 rounded-lg outline-none border-slate-400 ring-slate-500 focus:ring-2" placeholder={placeholder} onChange={onChange} name={name} value={value}></input>
        </div>
    );
}
  
export default TextInput;
  
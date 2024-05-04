function TextArea({placeholder, rows, name, onChange, value}) {
    return (
        <div className="pl-6">
            <textarea type="text" className="w-full p-2 leading-tight border-2 rounded-lg outline-none border-slate-400 ring-slate-500 focus:ring-2" placeholder={placeholder} rows={rows} onChange={onChange} name={name} value={value}></textarea>
        </div>
    );
}
  
export default TextArea;
  
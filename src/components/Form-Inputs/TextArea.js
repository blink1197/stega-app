function TextArea({placeholder}) {
    return (
        <div className="pl-6">
            <textarea className="w-full p-2 border-2 rounded-lg outline-none border-slate-400 ring-slate-500 focus:ring-2" placeholder={placeholder} rows={6}></textarea>
        </div>
    );
}
  
export default TextArea;
  
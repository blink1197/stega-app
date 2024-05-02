import FileDropZone from "../Form-Inputs/FileDropZone";
import {useDropzone} from 'react-dropzone';
import TextArea from "../Form-Inputs/TextArea";
import TextInput from "../Form-Inputs/Textinput";
import Button from "../Form-Inputs/Button";

function TextToImageEmbed() {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    return (
        <div className="TextToImageEmbed">
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">1</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Upload an image</h1>
                </div>
                <div className="h-40">
                    <FileDropZone getRootProps={getRootProps} getInputProps={getInputProps} acceptedFiles={acceptedFiles}/>
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">2</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Input secret message</h1>
                </div>
                <div className="">
                    <TextArea placeholder={"Type your secret message here..."}/>
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">3</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Input secret key</h1>
                </div>
                <div className="">
                    <TextInput placeholder={"Type your secret key here..."}/>
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">4</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Generate Stego Image</h1>
                </div>
                <div className="">
                    <Button buttonText={"Generate"}/>
                </div>
                
            </div>

            
        </div>
    );
}
  
export default TextToImageEmbed;
  
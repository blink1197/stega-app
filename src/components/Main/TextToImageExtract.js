import FileDropZone from "../Form-Inputs/FileDropZone";
import {useDropzone} from 'react-dropzone';
import TextArea from "../Form-Inputs/TextArea";
import TextInput from "../Form-Inputs/Textinput";
import Button from "../Form-Inputs/Button";
import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import sha256 from 'crypto-js/sha256';

function TextToImageEmbed() {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone(); // From File Drop Zone
    const [imageSrc, setImageSrc] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [secretMessage, setSecretMessage] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [maxMessageLength, setMaxMessageLength] = useState(0);

    const removeImage = () => {
        setImageSrc(null);
        setImageFile(null);
    }

    const clearFormInputs = () => {
        setImageSrc(null);
        setImageFile(null);
        setSecretMessage("");
        setSecretKey("");
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'secret-key') setSecretKey(value);
    }

    const stringToBinary = (str) => {
        let binary = '';
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i).toString(2);
            binary += '0'.repeat(8 - charCode.length) + charCode;
        }
        return binary;
    }
    
    const binaryToString = (binary) => {
        let str = '';
        for (let i = 0; i < binary.length; i += 8) {
            let byte = binary.substr(i, 8);
            str += String.fromCharCode(parseInt(byte, 2));
        }
        return str;
    }

    const stringToSeed = (str) => {
        let seed = 0;
        for (let i = 0; i < str.length; i++) {
            seed += str.charCodeAt(i);
        }
        return seed;
    }

    const selectNumbers = (totalNums, selectedNums, secretKey) => {
        const hash = sha256(secretKey).toString();
        const numericSeed = stringToSeed(hash);
        const rng = seedrandom(numericSeed);
        let numbers = [];
        for (let i = 1; i <= totalNums; i++) {
            numbers.push(i);  
        }
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        let selectedNumbers = numbers.slice(0, selectedNums);
        return selectedNumbers;
    }

    useEffect(() => {
        const handleImageChange = () => {
            const file = acceptedFiles[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (readEvent) => {
                    setImageSrc(readEvent.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                setImageSrc(null);
            }
            setImageFile(acceptedFiles[0])
        }
        handleImageChange();
    }, [acceptedFiles]);

    const extractMessage = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        const reader = new FileReader();
    
        reader.onload = function(event) {
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const maximumMessageLength = ((canvas.width * canvas.height) / 8) * 0.01;
                setMaxMessageLength(parseInt(maximumMessageLength));
                console.log(maxMessageLength);
                const data = imageData.data;
    
                // Use the same parameters as in embedding
                

                const selectedPixels = selectNumbers(data.length, maxMessageLength, secretKey);
                
                let initials = '';
                for (let pixel of selectedPixels) {
                    initials += (imageData.data[pixel] % 2).toString();
                }
                console.log('initial: ', initials);

                let messBin = [];
                for (let pixel of selectedPixels) {
                    messBin.push(imageData.data[pixel]).toString();
                }
                console.log('messBin: ', messBin);
                
                let binaryMessage = '';
    
                // Iterate over the selected pixels and extract message bits until secret key is found
                // while (!binaryToString(binaryMessage).includes(secretKey)) {
                for (let i = 0; i < selectedPixels.length; i++) {
                    const pixelValue = data[selectedPixels[i]];
                    // Extract the LSB from the pixel value
                    const messageBit = (pixelValue % 2).toString();
                    binaryMessage += messageBit;
                }
                // }
                console.log(binaryToString(binaryMessage));
                //console.log(binaryToString(binaryMessage).split(secretKey)[0]);
                
                // If the secret key is not found, handle it here
                //console.log("Secret key not found or message not embedded.");
            }
            image.src = event.target.result;
        }
        imageFile && reader.readAsDataURL(imageFile); 
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-2">
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">1</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Upload an image</h1>
                </div>
                <div className="flex flex-col items-center h-48">
                    {imageSrc 
                        ? <img className="w-auto h-48 mx-auto" src={imageSrc} alt="Uploaded content"/>
                        : <FileDropZone getRootProps={getRootProps} getInputProps={getInputProps} />}
                    {imageSrc && (
                        <div className="flex items-center">
                            <button className="mr-2" onClick={removeImage}>
                                <svg className="w-3 h-3 stroke-red-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 19L10 10M10 10L1 1M10 10L19.0001 1M10 10L1 19.0001" stroke="current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <p>{imageFile.name}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">2</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Input secret key</h1>
                </div>
                <div className="">
                    <TextInput placeholder={"Type your secret key here..."} onChange={handleInputChange} name={'secret-key'} value={secretKey}/>
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">3</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Extract secret message</h1>
                </div>
                <div className="transition-transform ease-in-out hover:scale-105">
                    <Button buttonText={"Extract"} onClick={extractMessage}/>
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">4</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Secret message</h1>
                </div>
                <div className="">
                    <TextArea rows={6} placeholder={""} onChange={handleInputChange} name={'secret-message'} value={secretMessage} disabled={true}/>
                    <div className="flex pl-6 text-sm leading-tight text-[12px] justify-end">
                        <Button buttonText={"Copy Text"} size="sm"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
  
export default TextToImageEmbed;
  
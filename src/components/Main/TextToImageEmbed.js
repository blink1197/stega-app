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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'secret-message') setSecretMessage(value);
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
    
    // const binaryToString = (binary) => {
    //     let str = '';
    //     for (let i = 0; i < binary.length; i += 8) {
    //         let byte = binary.substr(i, 8);
    //         str += String.fromCharCode(parseInt(byte, 2));
    //     }
    //     return str;
    // }

    const stringToSeed = (str) => {
        let seed = 0;
        for (let i = 0; i < str.length; i++) {
            seed += str.charCodeAt(i);
        }
        return seed;
    }

    const selectNumbers = (totalNums, selectedNums, secretKey) => {
        const hash = sha256(secretKey).toString();
        // Generate a numeric seed from the string using a hash function
        const numericSeed = stringToSeed(hash);
        // Initialize the pseudo-random number generator with the numeric seed
        const rng = seedrandom(numericSeed);
    
        let numbers = [];
        for (let i = 1; i <= totalNums; i++) {
            numbers.push(i);  
        }
        // Shuffle the array using Fisher-Yates algorithm with the initialized PRNG
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        // Select the first M numbers from the shuffled array
        let selectedNumbers = numbers.slice(0, selectedNums);
        return selectedNumbers;
    }

    
    const calculateMaxMessageLength = (imageFile) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        const reader = new FileReader();
    
        reader.onload = function(event) {
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                const maximumMessageLength = canvas.width * canvas.height / 8;
                console.log('here', maximumMessageLength); // Log the maximum message length here
                setMaxMessageLength(parseInt(maximumMessageLength));
            }
            image.src = event.target.result;
        }
    
        imageFile && reader.readAsDataURL(imageFile);
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
            calculateMaxMessageLength(acceptedFiles[0]);
        }
        handleImageChange();
        
        console.log('max_message: ', maxMessageLength);
    }, [acceptedFiles]);

    

    const embedMessage = () => {
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
                const data = imageData.data;
                const messageBinary = stringToBinary(secretMessage);
                const selectedPixels = selectNumbers(data.length, messageBinary.length, secretKey)

                for (let i = 0; i < selectedPixels.length; i++) {
                    let pixel = selectedPixels[i];
                
                    if (messageBinary[i] === '1') {
                        if (data[pixel] % 2 === 0) {
                            data[pixel] += 1;
                        }
                    } else {
                        if (data[pixel] % 2 === 1) {
                            if (data[pixel] === 255) {
                                data[pixel] -= 1;
                            }
                            data[pixel] += 1;
                        }
                    }
                }
                exportImage(imageData);
            }
            image.src = event.target.result;
        }
        imageFile && reader.readAsDataURL(imageFile); 
    }

    const exportImage = (modifiedImageData) => {
        // Create a new canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Set canvas dimensions
        canvas.width = modifiedImageData.width;
        canvas.height = modifiedImageData.height;
    
        // Put the modified pixel data onto the canvas
        ctx.putImageData(modifiedImageData, 0, 0);
    
        // Get the data URL representing the image (in PNG format)
        const dataURL = canvas.toDataURL(imageFile.type);
    
        // Create a link element
        const downloadLink = document.createElement('a');
    
        // Set the download attribute to the filename
        downloadLink.download = imageFile.name.split(".")[0] + "-embedded";
    
        // Set the href attribute to the data URL
        downloadLink.href = dataURL;
    
        // Simulate a click event on the link element to trigger the download
        downloadLink.click();
    };
    
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
                    <h1 className="pl-5 text-xl">Input secret message</h1>
                </div>
                <div className="">
                    <TextArea rows={6} placeholder={"Type your secret message here..."} onChange={handleInputChange} name={'secret-message'} value={secretMessage}/>
                    <div className="flex justify-between pl-6 text-sm leading-tight text-[12px]">
                        <p className="w-7/12">*Note: Bigger image dimensions means more characters that can be encoded</p>
                        <p className="text-right">{maxMessageLength - secretMessage.length}/{maxMessageLength} <span className="block">characters</span></p>
                    </div>
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
                    <TextInput placeholder={"Type your secret key here..."} onChange={handleInputChange} name={'secret-key'} value={secretKey}/>
                </div>
            </div>
            <div className="mb-5 max-w-80">
                <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center border rounded-full h-9 w-9 border-slate-700">
                        <h1 className="font-bold text-slate-700">4</h1>
                    </div>
                    <h1 className="pl-5 text-xl">Generate Stego Image</h1>
                </div>
                <div className="transition-transform ease-in-out hover:scale-105">
                    <Button buttonText={"Generate"} onClick={embedMessage}/>
                </div>
            </div>
        </div>
    );
}
  
export default TextToImageEmbed;
  
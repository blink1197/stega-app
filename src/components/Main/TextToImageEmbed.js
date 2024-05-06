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
    
    const calculateMaxMessageLength = (imageFile) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        const reader = new FileReader();
        reader.onload = function(event) {
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                const maximumMessageLength = ((canvas.width * canvas.height) / 8) * 0.01;
                setMaxMessageLength(parseInt(maximumMessageLength));
            }
            image.src = event.target.result;
        }
        imageFile && reader.readAsDataURL(imageFile);
    }

    useEffect(() => {
        calculateMaxMessageLength(imageFile);
    }, [secretKey]);



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
            setImageFile(acceptedFiles[0]);
            calculateMaxMessageLength(acceptedFiles[0]);
        }
        handleImageChange();
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
                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                const messageBinary = stringToBinary(secretMessage + secretKey);
                console.log('message: ',messageBinary);
                const selectedPixels = selectNumbers(imageData.data.length, messageBinary.length, secretKey);
                 
                let initialstring = '';
                for (let pixel of selectedPixels) {
                    initialstring += (imageData.data[pixel] % 2).toString();
                }
                console.log('initial: ', initialstring);

                let initial = [];
                for (let pixel of selectedPixels) {
                    initial.push(imageData.data[pixel]).toString();
                }
                console.log('initial: ', initial);


                for (let i = 0; i < selectedPixels.length; i++) {

                    let pixelValue = imageData.data[selectedPixels[i]];
                    let messageBit = messageBinary[i];

                    if (messageBit === '1') {
                        if (pixelValue % 2 === 0) {
                            imageData.data[selectedPixels[i]] = pixelValue + 1;
                        } else 
                        imageData.data[selectedPixels[i]] = pixelValue;

                    } else if (messageBit === '0') {
                        if (pixelValue === 255) {
                            imageData.data[selectedPixels[i]] = 254;
                        } else if (pixelValue % 2 === 1) {
                            imageData.data[selectedPixels[i]] = pixelValue + 1;
                        } else {
                            imageData.data[selectedPixels[i]] = pixelValue;
                        }

                    }
                    
                    // if (messageBit === '1' && pixelValue < 255) {
                    //     pixelValue++; // Increment if message bit is 1 and value is less than 255
                    // } else if (messageBit === '0' && pixelValue > 0) {
                    //     pixelValue--; // Decrement if message bit is 0 and value is greater than 0
                    // }
                    
                    // if (messageBit === '1') {
                    //     pixelValue |= 1;
                    // } else {
                    //     pixelValue &= ~1;
                    // }

                    // for (let pixel of pixels) {
                    //     if (messageBinaryStringArray[i] === '1') {
                    //         if (data[pixel] % 2 === 0) {
                    //             data_copy[pixel] = data[pixel] + 1;
                    //         }
                    //     } else {
                    //         if (data[pixel] % 2 === 1) {
                    //             if (data[pixel] === 255) {
                    //                 data_copy[pixel] = data[pixel] - 1;
                    //             }
                    //             data_copy[pixel] = data[pixel] + 1;
                    //         }
                    //     }
                    //     i++;
                    //     console.log(data_copy[pixel]);
                    // }
                
                    // imageData.data[selectedPixels[i]] = pixelValue; // Update the R value of the pixel
                }

                //console.log(imageData.data);
                let finalstring = '';
                for (let pixel of selectedPixels) {
                    finalstring += (imageData.data[pixel] % 2).toString();
                }
                console.log('finalstring: ', finalstring);

                
                ctx.putImageData(imageData, 0, 0);

                let final = [];
                for (let pixel of selectedPixels) {
                    final.push(imageData.data[pixel]).toString();
                }
                console.log('final: ', final);

                exportImage(imageData);
            }
            image.src = event.target.result;
        }
        imageFile && reader.readAsDataURL(imageFile); 
    }

    const exportImage = (modifiedImageData) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = modifiedImageData.width;
        canvas.height = modifiedImageData.height;
        ctx.putImageData(modifiedImageData, 0, 0);
        const dataURL = canvas.toDataURL(imageFile.type);
        const downloadLink = document.createElement('a');
        downloadLink.download = imageFile.name.split(".")[0] + "-embedded";
        downloadLink.href = dataURL;
        downloadLink.click();
        clearFormInputs();
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
  
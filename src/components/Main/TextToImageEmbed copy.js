import FileDropZone from "../Form-Inputs/FileDropZone";
import {useDropzone} from 'react-dropzone';
import TextArea from "../Form-Inputs/TextArea";
import TextInput from "../Form-Inputs/Textinput";
import Button from "../Form-Inputs/Button";
import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import sha256 from 'crypto-js/sha256';
import cv from "@techstark/opencv-js";

window.cv = cv;

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

    const selectRandomPixels = (imageWidth, imageHeight, selectedNums, secretKey) => {
        const hash = sha256(secretKey).toString();
        const numericSeed = stringToSeed(hash);
        const rng = seedrandom(numericSeed);
        const totalPixels = imageWidth * imageHeight;
        const selectedPixels = [];
    
        for (let i = 0; i < selectedNums; i++) {
            // Generate random pixel coordinates
            const randomPixelIndex = Math.floor(rng() * totalPixels);
            const pixelX = randomPixelIndex % imageWidth;
            const pixelY = Math.floor(randomPixelIndex / imageWidth);
            // Add the pixel coordinates to the selected pixels array
            selectedPixels.push({ x: pixelX, y: pixelY });
        }
        return selectedPixels;
    };
    
    const calculateMaxMessageLength = (imageFile) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        const reader = new FileReader();
        reader.onload = function(event) {
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                const maximumMessageLength = ((canvas.width * canvas.height) * 0.1);
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
        const reader = new FileReader();
        reader.onload = () => {
            const imageDataUrl = reader.result; // Get the data URL of the uploaded image
            manipulateImage(imageDataUrl); // Call a function to manipulate the image
        };
        imageFile && reader.readAsDataURL(imageFile); 
    }

    const manipulateImage = (imageDataUrl) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
    
            // Convert secret message to binary
            const messageBinary = stringToBinary(secretMessage + "----" + secretKey);
            console.log(messageBinary);
    
            // Select random pixels
            const selectedPixels = selectRandomPixels(canvas.width, canvas.height, messageBinary.length, secretKey);
    
            // Read the image into a cv.Mat object
            const image = cv.imread(canvas);
    
            // Manipulate the selected pixels
            
            for (let i = 0; i < selectedPixels.length; i++) {
                const pixelCoords = selectedPixels[i];
                //const index = (pixelCoords.y * canvas.width + pixelCoords.x) * 4;
                const index = pixelCoords.y * image.cols * image.channels() + pixelCoords.x * image.channels();
    
                // Retrieve RGBA values
                let [r, g, b, a] = image.data.slice(index, index + 4);
                
    
                // Modify the alpha channel based on the secret message
                if (messageBinary[i] === '1') {
                    if (a % 2 === 0) a += 1;
                } else {
                    if (a % 2 === 1) a -= 1;
                }
                
                console.log(a);
                // Set the modified RGBA values
                image.data.set([r, g, b, a], index);
                //console.log(image.ucharPtr(pixelCoords.x, pixelCoords.y)[3]);
            }
    
            // Show the modified image
            console.log(image);

            let pixelValue = [];
            for (const pixel of selectedPixels) {
                pixelValue.push(image.ucharPtr(pixel.x, pixel.y)[3]);
            }
            console.log(pixelValue);

            cv.imshow(canvas, image);

            // Convert canvas to data URL
            const modifiedImageDataUrl = canvas.toDataURL();
    
            // Create a download link and trigger the download
            const fileName = "modified_image.png"; // You can change the filename and extension as needed
            const downloadLink = document.createElement('a');
            downloadLink.href = modifiedImageDataUrl;
            downloadLink.download = fileName;
            downloadLink.click();
    
            // Clean up
            //image.delete();
        };
        img.src = imageDataUrl;
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
  
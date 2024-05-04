import React from 'react';

function FileDropZone({getRootProps, getInputProps}) {
    
  return (
    <section className="flex flex-col items-center justify-center pt-2 ml-6 text-center bg-green-100 border-2 border-green-600 border-dashed rounded-lg h-5/6">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p className='p-4'>Drag 'n' drop an image file here, or click to select an image file</p>
      </div>
      
    </section>
  );
}

export default FileDropZone;
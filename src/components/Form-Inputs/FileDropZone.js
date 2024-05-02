import React from 'react';

function FileDropZone({getRootProps, getInputProps, acceptedFiles}) {
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
    ));
  return (
    <section className="flex flex-col items-center justify-center h-full pt-2 ml-6 text-center bg-green-100 border-2 border-green-600 border-dashed rounded-lg">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p className='p-5'>Drag 'n' drop an image file here, or click to select an image file</p>
      </div>
      {/* <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside> */}
    </section>
  );
}

export default FileDropZone;
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Editor } from '@tinymce/tinymce-react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import {db,storage,app} from '../firebase';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      setImage(file);
    } catch (error) {
      console.error('Error uploading image: ', error);
      toast.error('Error uploading image');
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'blogs'), {
        title,
        image: imageUrl,
        content,
        description,
        createdAt: new Date(),
      });

      setTitle('');
      setImage(null);
      setImageUrl(null);
      setContent('');
      setDescription('');
      toast.success('Blog post added successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding blog post: ', error);
      toast.error('Error adding blog post');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create a New Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-800 font-bold mb-1" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-800 font-bold mb-1" htmlFor="description">
              Description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="description"
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-800 font-bold mb-1" htmlFor="image">
              Image
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageUrl && (
              <img src={imageUrl} alt="Uploaded" className="mt-2 w-1/2 h-32 flex items-center justify-center object-cover rounded-md" />
            )}
          </div>
          <div className="mb-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Add Content
            </button>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Post Blog
          </button>
          <Link
            to="/AddJob"
            className="block w-full text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Back
          </Link>
          
        </form>
      </div>
      <ToastContainer />

      {/* Modal for the text editor */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Content Editor"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 max-w-5xl mx-auto flex flex-col">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-300">
            <h2 className="text-2xl font-bold italic text-gray-800">Edit Content</h2>
          </div>
          <div className="flex-grow overflow-auto p-4">
            <Editor
              apiKey="8395dp0vtkf3wdr9yxcxwpybamtdprlaugo08ipr59kn9v4j"
              value={content}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help',
                    'lists'
                  ],
                  toolbar: 'undo redo | formatselect | bold italic underline strikethrough | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist | removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                  toolbar_mode: 'sliding',
                  menubar: 'file edit view insert format tools table help',
              }}
              onEditorChange={handleContentChange}
            />
          </div>
          <div className="p-4 border-t border-gray-300 flex justify-end">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogForm;

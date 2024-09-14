import React, { useState } from 'react';
import Modal from 'react-modal';
import { Editor } from '@tinymce/tinymce-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

Modal.setAppElement('#root');

const Career = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('0');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobDescription'), {
        jobTitle,
        experience: experience === '0' ? 'Fresher' : `${experience} years`,
        location,
        description: editorContent,
      });
      alert('Job description submitted successfully');
      setJobTitle('');
      setExperience('0');
      setLocation('');
      setEditorContent('');
      setDescription('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Create Job Description
        </h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter job title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Experience
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="0"
                  checked={experience === '0'}
                  onChange={(e) => setExperience(e.target.value)}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2 text-gray-700">Fresher</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="1"
                  checked={experience !== '0'}
                  onChange={(e) => setExperience('1')}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2 text-gray-700">Experienced</span>
              </label>
            </div>
            {experience !== '0' && (
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1} year${i !== 0 ? 's' : ''}`}</option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
            >
              <option value="">Select a location</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <button
              type="button"
              onClick={openModal}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Open Editor
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Text Editor"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Edit Description</h2>
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow p-6 overflow-y-auto">
            <Editor
              apiKey="8395dp0vtkf3wdr9yxcxwpybamtdprlaugo08ipr59kn9v4j"
              value={editorContent}
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
              onEditorChange={handleEditorChange}
            />
          </div>
          <div className="bg-gray-100 px-6 py-4 flex justify-end">
            <button
              onClick={() => {
                setDescription(editorContent);
                closeModal();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Career;
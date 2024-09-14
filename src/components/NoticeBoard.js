import React, { useState, useCallback, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { XIcon, PlusIcon } from 'lucide-react';

const AddNoticePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    tags: [],
    scheduledFor: null,
    expiresAt: null,
    attachments: [],
    targetAudience: [],
    relatedCourses: [],
    isSticky: false,
    allowComments: true,
    notifyViaEmail: false,
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [customAudiences, setCustomAudiences] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    };

    const fetchCustomAudiences = async () => {
      const audiencesCollection = collection(db, 'customAudiences');
      const audiencesSnapshot = await getDocs(audiencesCollection);
      const audiencesList = audiencesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomAudiences(audiencesList);
    };

    fetchCourses();
    fetchCustomAudiences();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleDateChange = (date, name) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleAudienceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      targetAudience: checked
        ? [...prev.targetAudience, value]
        : prev.targetAudience.filter(item => item !== value)
    }));
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      relatedCourses: checked
        ? [...prev.relatedCourses, value]
        : prev.relatedCourses.filter(item => item !== value)
    }));
  };

  const onDrop = useCallback(acceptedFiles => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...acceptedFiles]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/*': ['.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Validate form data
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Title and content are required');
      }
  
      // Upload attachments
      const attachmentUrls = await Promise.all(formData.attachments.map(async file => {
        const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      }));
  
      // Prepare notice data
      const noticeData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        priority: formData.priority,
        tags: formData.tags,
        createdAt: serverTimestamp(),
        scheduledFor: formData.scheduledFor ? formData.scheduledFor.toISOString() : null,
        expiresAt: formData.expiresAt ? formData.expiresAt.toISOString() : null,
        attachmentUrls,
        likes: [],
        comments: [],
        status: formData.scheduledFor && formData.scheduledFor > new Date() ? 'scheduled' : 'active',
        targetAudience: formData.targetAudience,
        relatedCourses: formData.relatedCourses,
        isSticky: formData.isSticky,
        allowComments: formData.allowComments,
        notifyViaEmail: formData.notifyViaEmail,
      };
  
      // Add notice to Firestore
      const docRef = await addDoc(collection(db, 'notices'), noticeData);
  
      // If email notification is enabled, trigger a cloud function to send emails
      if (formData.notifyViaEmail) {
        // Assume we have a cloud function called 'sendNotificationEmails'
        // This would be implemented separately in Firebase Cloud Functions
        await fetch('/api/sendNotificationEmails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noticeId: docRef.id })
        });
      }
  
      toast.success('Notice added successfully!');
  
      // Clear the form
      setFormData({
        title: '',
        content: '',
        category: 'general',
        priority: 'normal',
        tags: [],
        scheduledFor: null,
        expiresAt: null,
        attachments: [],
        targetAudience: [],
        relatedCourses: [],
        isSticky: false,
        allowComments: true,
        notifyViaEmail: false,
      });
  
    } catch (err) {
      setError(err.message || 'Failed to add notice. Please try again.');
      toast.error(err.message || 'Failed to add notice. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <ReactQuill
          value={formData.content}
          onChange={handleContentChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="events">Events</option>
            <option value="emergency">Emergency</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={handleTagChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">Schedule Post (optional)</label>
          <DatePicker
            selected={formData.scheduledFor}
            onChange={(date) => handleDateChange(date, 'scheduledFor')}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">Expiration Date (optional)</label>
          <DatePicker
            selected={formData.expiresAt}
            onChange={(date) => handleDateChange(date, 'expiresAt')}
            dateFormat="MMMM d, yyyy"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Target Audience</label>
        <div className="mt-2 space-y-2">
          {['All Students', 'Faculty', 'Staff', ...customAudiences.map(a => a.name)].map(audience => (
            <label key={audience} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value={audience}
                checked={formData.targetAudience.includes(audience)}
                onChange={handleAudienceChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2">{audience}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Related Courses</label>
        <div className="mt-2 space-y-2">
          {courses.map(course => (
            <label key={course.id} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value={course.id}
                checked={formData.relatedCourses.includes(course.id)}
                onChange={handleCourseChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2">{course.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Attachments</label>
        <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${isDragActive ? 'bg-gray-100' : ''}`}>
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span> <input {...getInputProps()} id="file-upload" name="attachments" className="sr-only" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC, DOCX up to 10MB</p>
          </div>
        </div>
        {formData.attachments.length > 0 && (
          <ul className="mt-2 divide-y divide-gray-200">
            {formData.attachments.map((file, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isSticky"
          name="isSticky"
          type="checkbox"
          checked={formData.isSticky}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isSticky" className="ml-2 block text-sm text-gray-900">
          Pin this notice to the top
        </label>
      </div>

      <div className="flex items-center">
        <input
          id="allowComments"
          name="allowComments"
          type="checkbox"
          checked={formData.allowComments}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-900">
          Allow comments on this notice
        </label>
      </div>

      <div className="flex items-center">
        <input
          id="notifyViaEmail"
          name="notifyViaEmail"
          type="checkbox"
          checked={formData.notifyViaEmail}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="notifyViaEmail" className="ml-2 block text-sm text-gray-900">
          Send email notifications to target audience
        </label>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Preview
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading ? 'Adding...' : 'Add Notice'}
        </button>
      </div>
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </form>
  );

  const renderPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">{formData.title}</h2>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
      <div className="mt-4 space-y-2">
        <p><strong>Category:</strong> {formData.category}</p>
        <p><strong>Priority:</strong> {formData.priority}</p>
        <p><strong>Tags:</strong> {formData.tags.join(', ')}</p>
        <p><strong>Target Audience:</strong> {formData.targetAudience.join(', ')}</p>
        <p><strong>Related Courses:</strong> {formData.relatedCourses.map(id => courses.find(c => c.id === id)?.name).join(', ')}</p>
        {formData.scheduledFor && <p><strong>Scheduled for:</strong> {formData.scheduledFor.toLocaleString()}</p>}
        {formData.expiresAt && <p><strong>Expires at:</strong> {formData.expiresAt.toLocaleString()}</p>}
        <p><strong>Pinned:</strong> {formData.isSticky ? 'Yes' : 'No'}</p>
        <p><strong>Comments Allowed:</strong> {formData.allowComments ? 'Yes' : 'No'}</p>
        <p><strong>Email Notifications:</strong> {formData.notifyViaEmail ? 'Yes' : 'No'}</p>
      </div>
      {formData.attachments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Attachments:</h3>
          <ul className="list-disc pl-5 mt-2">
            {formData.attachments.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPreview(false)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading ? 'Adding...' : 'Confirm & Add Notice'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Notice</h1>
      {preview ? renderPreview() : renderForm()}
    </div>
  );
};

export default AddNoticePage;
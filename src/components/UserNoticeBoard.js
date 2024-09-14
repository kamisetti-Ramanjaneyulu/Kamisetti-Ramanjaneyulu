import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, startAfter, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Search, Filter, ChevronDown, Paperclip, ThumbsUp, MessageSquare } from 'lucide-react';
// If you're using shadcn/ui components, make sure they're properly set up in your project
// import { Alert, AlertDescription } from '@/components/ui/alert';

const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    tags: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [commentText, setCommentText] = useState('');

  const fetchNotices = async (isInitial = false) => {
    try {
      setLoading(true);
      setError(null);

      let noticesQuery = query(
        collection(db, 'notices'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      if (filters.category) {
        noticesQuery = query(noticesQuery, where('category', '==', filters.category));
      }
      if (filters.priority) {
        noticesQuery = query(noticesQuery, where('priority', '==', filters.priority));
      }
      if (filters.tags.length > 0) {
        noticesQuery = query(noticesQuery, where('tags', 'array-contains-any', filters.tags));
      }

      if (!isInitial && lastVisible) {
        noticesQuery = query(noticesQuery, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(noticesQuery);

      if (querySnapshot.empty) {
        setNotices(prev => isInitial ? [] : prev);
        setHasMore(false);
      } else {
        const newNotices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotices(prev => isInitial ? newNotices : [...prev, ...newNotices]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 10);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError(`Failed to fetch notices: ${err.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(true);
  }, [filters]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchNotices();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLike = async (noticeId) => {
    try {
      const noticeRef = doc(db, 'notices', noticeId);
      const currentUserId = 'currentUserId'; // Replace with actual user ID
      await updateDoc(noticeRef, {
        likes: arrayUnion(currentUserId)
      });
      setNotices(prev => prev.map(notice => 
        notice.id === noticeId 
          ? { ...notice, likes: [...notice.likes, currentUserId] }
          : notice
      ));
    } catch (error) {
      console.error('Error liking notice:', error);
      setError('Failed to like the notice. Please try again.');
    }
  };

  const handleComment = async (noticeId) => {
    if (!commentText.trim()) return;
    try {
      const noticeRef = doc(db, 'notices', noticeId);
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        userId: 'currentUserId', // Replace with actual user ID
        createdAt: new Date()
      };
      await updateDoc(noticeRef, {
        comments: arrayUnion(newComment)
      });
      setNotices(prev => prev.map(notice => 
        notice.id === noticeId 
          ? { ...notice, comments: [...notice.comments, newComment] }
          : notice
      ));
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NoticeCard = ({ notice }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <h2 className="text-2xl font-bold mb-2">{notice.title}</h2>
      <p className="text-gray-600 mb-4">{format(notice.createdAt.toDate(), 'MMMM d, yyyy')}</p>
      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: notice.content }} />
      
      {notice.attachmentUrls && notice.attachmentUrls.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Attachments:</h3>
          <ul className="list-disc pl-5">
            {notice.attachmentUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Attachment {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {notice.tags && notice.tags.map(tag => (
          <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-sm ${
            notice.priority === 'urgent' ? 'bg-red-200 text-red-800' :
            notice.priority === 'important' ? 'bg-yellow-200 text-yellow-800' :
            'bg-green-200 text-green-800'
          }`}>
            {notice.priority}
          </span>
          <span className="text-gray-600">{notice.category}</span>
        </div>
        <div className="flex items-center space-x-4">
          {notice.attachmentUrls && notice.attachmentUrls.length > 0 && (
            <span className="flex items-center text-gray-600">
              <Paperclip size={16} className="mr-1" />
              {notice.attachmentUrls.length}
            </span>
          )}
          <button 
            onClick={() => handleLike(notice.id)}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <ThumbsUp size={16} className="mr-1" />
            {notice.likes ? notice.likes.length : 0}
          </button>
          <span className="flex items-center text-gray-600">
            <MessageSquare size={16} className="mr-1" />
            {notice.comments ? notice.comments.length : 0}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Comments:</h3>
        {notice.comments && notice.comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 rounded p-2 mb-2">
            <p>{comment.text}</p>
            <p className="text-xs text-gray-500">
              {format(comment.createdAt.toDate(), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        ))}
        <div className="flex mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow mr-2 px-2 py-1 border rounded"
          />
          <button
            onClick={() => handleComment(notice.id)}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notice Board</h1>
      <div className="mb-6 flex space-x-4">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="events">Events</option>
            <option value="emergency">Emergency</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
        </div>
        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>
      <AnimatePresence>
        {filteredNotices.map(notice => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </AnimatePresence>
      {loading && <p className="text-center">Loading notices...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {!loading && !error && hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default UserNoticeBoard;
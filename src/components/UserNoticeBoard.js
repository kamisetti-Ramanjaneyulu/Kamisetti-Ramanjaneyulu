import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, limit, getDocs, startAfter, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { Search, Filter, ChevronDown, Paperclip, ThumbsUp, MessageSquare, X, Menu, AlertTriangle } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

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
  const [commentTexts, setCommentTexts] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const boardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: boardRef,
    offset: ["start start", "end start"]
  });

  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["hsl(230, 50%, 98%)", "hsl(230, 50%, 90%)"]
  );

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
          ? { ...notice, likes: [...(notice.likes || []), currentUserId] }
          : notice
      ));
    } catch (error) {
      console.error('Error liking notice:', error);
      setError('Failed to like the notice. Please try again.');
    }
  };

  
  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCommentChange = (noticeId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [noticeId]: text
    }));
  };

  const handleComment = async (noticeId) => {
    const commentText = commentTexts[noticeId];
    if (!commentText || !commentText.trim()) return;
    try {
      const noticeRef = doc(db, 'notices', noticeId);
      const newComment = {
        id: Date.now().toString(),
        text: commentText.trim(),
        userId: 'currentUserId', // Replace with actual user ID
        createdAt: new Date()
      };
      await updateDoc(noticeRef, {
        comments: arrayUnion(newComment)
      });
      setNotices(prev => prev.map(notice => 
        notice.id === noticeId 
          ? { ...notice, comments: [...(notice.comments || []), newComment] }
          : notice
      ));
      setCommentTexts(prev => ({
        ...prev,
        [noticeId]: ''
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const NoticeCard = ({ notice }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
     className="bg-white rounded-lg shadow-lg p-6 mb-6 transform hover:scale-102 transition-all duration-300 ease-in-out"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{notice.title}</h2>
      <p className="text-gray-600 mb-4">{format(notice.createdAt.toDate(), 'MMMM d, yyyy')}</p>
      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: notice.content }} />
      
      {notice.attachmentUrls && notice.attachmentUrls.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Attachments:</h3>
          <ul className="list-disc pl-5">
            {notice.attachmentUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200">
                  Attachment {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {notice.tags && notice.tags.map(tag => (
          <motion.span
            key={tag}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            {tag}
          </motion.span>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <motion.span
            whileHover={{ scale: 1.1 }}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              notice.priority === 'urgent' ? 'bg-red-200 text-red-800' :
              notice.priority === 'important' ? 'bg-yellow-200 text-yellow-800' :
              'bg-green-200 text-green-800'
            }`}
          >
            {notice.priority}
          </motion.span>
          <span className="text-gray-600 font-medium">{notice.category}</span>
        </div>
        <div className="flex items-center space-x-4">
          {notice.attachmentUrls && notice.attachmentUrls.length > 0 && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="flex items-center text-gray-600"
            >
              <Paperclip size={16} className="mr-1" />
              {notice.attachmentUrls.length}
            </motion.span>
          )}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={() => handleLike(notice.id)}
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200"
          >
            <ThumbsUp size={16} className="mr-1" />
            {notice.likes ? notice.likes.length : 0}
          </motion.button>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="flex items-center text-gray-600"
          >
            <MessageSquare size={16} className="mr-1" />
            {notice.comments ? notice.comments.length : 0}
          </motion.span>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Comments:</h3>
        <AnimatePresence>
          {notice.comments && notice.comments.map(comment => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-100 rounded-lg p-3 mb-2 shadow-sm"
            >
              <p className="text-gray-800">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(comment.createdAt.toDate(), 'MMM d, yyyy HH:mm')}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex mt-4">
          <input
            type="text"
            value={commentTexts[notice.id] || ''}
            onChange={(e) => handleCommentChange(notice.id, e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleComment(notice.id)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Post
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      ref={boardRef}
      style={{ background }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-gray-800"
        >
          Notice Board
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="events">Events</option>
              <option value="emergency">Emergency</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
          </div>
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">All Priorities</option>
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredNotices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-8"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <AlertTriangle className="absolute top-3 right-3" size={20} />
          </motion.div>
        )}

        {!loading && !error && hasMore && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 shadow-md"
          >
            Load More
          </motion.button>
        )}

        {!loading && !error && filteredNotices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <p className="text-gray-600 text-lg">No notices found. Try adjusting your filters or search term.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Shimmer effect for loading state
const ShimmerEffect = () => (
  <div className="animate-pulse flex space-x-4 mb-6">
    <div className="flex-1 space-y-4 py-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);
export default UserNoticeBoard;
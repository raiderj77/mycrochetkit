import { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [yarn, setYarn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to post!");
      return;
    }

    setIsSubmitting(true);

    try {
      // This matches the Security Rules we just set up!
      await addDoc(collection(db, "posts"), {
        content: content,
        yarn: yarn, // Materials used (optional)
        authorId: user.uid,
        authorEmail: user.email, // storing email to display name (optional)
        createdAt: serverTimestamp(),
        likes: 0
      });

      setContent(''); // Clear the form
      setYarn(''); // Clear the yarn field
      alert("Post created!"); 
      // In a real app, you might trigger a refresh of the feed here
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Error posting. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="What did you make today?"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        {/* NEW: Material Input Field */}
        <div className="mt-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Materials Used (Optional)
          </label>
          <input 
            type="text"
            placeholder="e.g. Red Heart Super Saver, Blue"
            className="w-full mt-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-pink-400 outline-none bg-gray-50"
            value={yarn}
            onChange={(e) => setYarn(e.target.value)}
          />
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isSubmitting || !content.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

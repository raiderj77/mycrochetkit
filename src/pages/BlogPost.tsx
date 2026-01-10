import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishedDate: string;
    readTime: number;
    category: string;
    tags: string[];
    coverImage: string;
    seoKeyword: string;
    faqSchema: any[];
    updatedDate?: string;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                // Try finding by slug first
                const q = query(collection(db, 'blog-articles'), where('slug', '==', slug));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const docData = snapshot.docs[0].data();
                    setPost({ id: snapshot.docs[0].id, ...docData } as BlogPost);
                } else {
                    // Fallback: Try finding by ID (if slug logic failed or ID was passed)
                    const docRef = doc(db, 'blog-articles', slug);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
                    } else {
                        setError('Post not found');
                    }
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-slate-950 p-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
                <Link to="/blog" className="text-indigo-600 hover:text-indigo-500 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>
            </div>
        );
    }

    // Schema.org Structured Data
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": [post.coverImage],
        "datePublished": post.publishedDate,
        "dateModified": post.updatedDate || post.publishedDate,
        "author": [{
            "@type": "Organization",
            "name": post.author,
            "url": "https://mycrochetkit.com"
        }]
    };

    const faqData = post.faqSchema ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqSchema.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 transition-colors duration-500">
            <Helmet>
                <title>{post.title} | My Crochet Kit</title>
                <meta name="description" content={post.excerpt} />
                <meta name="keywords" content={post.tags.join(', ') + `, ${post.seoKeyword}`} />
                <link rel="canonical" href={`https://mycrochetkit.com/blog/${slug}`} />

                {/* Open Graph */}
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.coverImage} />
                <meta property="og:type" content="article" />

                {/* Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
                {faqData && (
                    <script type="application/ld+json">
                        {JSON.stringify(faqData)}
                    </script>
                )}
            </Helmet>

            {/* Header Image */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-300 font-semibold mb-4 uppercase tracking-wider">
                        <span className="bg-indigo-600/90 px-3 py-1 rounded-full">{post.category}</span>
                        {post.readTime && (
                            <div className="flex items-center gap-1 text-white/80 normal-case">
                                <Clock className="h-4 w-4" /> {post.readTime} min read
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-500 h-8 w-8 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">{post.author}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12">
                <article className="prose prose-lg dark:prose-invert prose-indigo max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-3 py-1 rounded-full text-sm">
                                <Tag className="h-3 w-3" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Master Your Crochet Skills</h3>
                    <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
                        Get access to our complete pattern library, video tutorials, and supportive community.
                    </p>
                    <Link to="/pricing" className="inline-block bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                        Get Full Access
                    </Link>
                </div>
            </div>
        </div>
    );
}

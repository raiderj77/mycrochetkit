import { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Project } from '../types/models';

interface MarketplaceListing extends Project {
  authorEmail?: string;
}

export default function Marketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'projects'),
          where('isForSale', '==', true)
        );
        
        const snapshot = await getDocs(q);
        const items: MarketplaceListing[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MarketplaceListing[];

        setListings(items);
      } catch (error) {
        console.error('Error loading marketplace:', error);
      }
      setLoading(false);
    };

    loadListings();
  }, []);

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Marketplace</h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">Buy handmade crochet items directly from makers · 0% platform fees</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search for blankets, amigurumi, wearables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">Loading listings...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingCart className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {searchQuery ? 'No listings found matching your search' : 'No items for sale yet'}
          </p>
          <p className="text-sm text-neutral-500">
            Lifetime users can list their finished projects here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <MarketplaceCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MarketplaceCardProps {
  listing: MarketplaceListing;
}

function MarketplaceCard({ listing }: MarketplaceCardProps) {
  const photo = listing.progressPhotos?.[0]?.url;
  const price = listing.price || 0;

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow p-0 flex flex-col">
      {/* Image */}
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 relative">
        {photo ? (
          <img
            src={photo}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <ShoppingCart className="h-16 w-16" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm dark:bg-primary-500 px-3 py-1 rounded-full font-bold text-primary-600 dark:text-primary-950 shadow-sm">
          ${price.toFixed(2)}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-1">{listing.name}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
          {listing.notes?.[0]?.text || 'No description'}
        </p>

        {listing.authorEmail && (
          <p className="text-xs text-neutral-500 mb-3 mt-auto">
            by {listing.authorEmail}
          </p>
        )}

        {/* Buy Button */}
        {listing.paymentLink && (
          <a
            href={listing.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Buy Now
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

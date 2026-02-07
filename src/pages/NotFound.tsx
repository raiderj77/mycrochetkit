import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-6">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🧶</div>
        <h1 className="text-3xl font-bold text-[#2C1810] mb-3">Page not found</h1>
        <p className="text-[#2C1810]/75 mb-8">Looks like this stitch got dropped.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] text-white rounded-full font-medium hover:bg-[#D35A4A] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

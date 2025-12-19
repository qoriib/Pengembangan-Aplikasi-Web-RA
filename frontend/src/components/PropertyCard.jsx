const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const PropertyCard = ({ property, favorite, onFavorite, onInquiry }) => {
  return (
    <article className="card overflow-hidden">
      <div
        className="h-44 bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.35)), url(${property.photoUrl})` }}
        role="img"
        aria-label={property.title}
      >
        <div className="absolute top-3 left-3 badge bg-white text-slate-800 border-none capitalize">{property.type}</div>
        {favorite && <div className="absolute top-3 right-3 text-yellow-400 text-lg">★</div>}
      </div>
      <div className="p-4 space-y-2">
        <div className="text-lg font-semibold text-slate-900">{property.title}</div>
        <div className="text-sm text-slate-600">{property.location}</div>
        <div className="text-blue-600 font-bold">{formatPrice(property.price)}</div>
        <div className="flex gap-4 text-sm text-slate-600">
          <span>{property.beds} bd</span>
          <span>{property.baths} ba</span>
          <span>{property.area} sqm</span>
        </div>
        <div className="flex gap-2 pt-1">
          {onFavorite && (
            <button className="btn btn-primary" onClick={() => onFavorite(property.id)}>
              {favorite ? 'Favorited' : 'Save'}
            </button>
          )}
          {onInquiry && (
            <button className="btn btn-ghost" onClick={() => onInquiry(property.id)}>
              Inquiry
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;

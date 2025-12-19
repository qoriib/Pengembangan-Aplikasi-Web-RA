const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const PropertyCard = ({ property, favorite, onFavorite, onInquiry, detailHref, onCompare, inCompare }) => {
  return (
    <article className="card overflow-hidden hover:shadow-md transition relative">
      <div
        className="h-44 bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.35)), url(${property.photoUrl})` }}
        role="img"
        aria-label={property.title}
      >
        <div className="absolute top-3 left-3 badge bg-white text-slate-800 border-none capitalize">{property.type}</div>
        {favorite && <div className="absolute top-3 right-3 text-yellow-400 text-lg">★</div>}
        {onCompare && (
          <button
            className={`absolute top-3 right-3 rounded-full p-2 text-xs font-semibold shadow-sm ${inCompare ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed' : 'bg-white text-slate-800 border border-slate-200 hover:border-blue-300'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (inCompare) return;
              onCompare(property);
            }}
            aria-label="Tambah ke compare"
          >
            <i className={`${inCompare ? 'fa-solid fa-check' : 'fa-regular fa-clone'} text-sm`}></i>
          </button>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="text-lg font-semibold text-slate-900">{property.title}</div>
        <div className="text-sm text-slate-600">{property.location}</div>
        <div className="text-blue-600 font-bold">{formatPrice(property.price)}</div>
        <div className="flex gap-4 text-sm text-slate-600">
          <span><i className="fa-solid fa-bed mr-1"></i>{property.beds} bd</span>
          <span><i className="fa-solid fa-bath mr-1"></i>{property.baths} ba</span>
          <span><i className="fa-solid fa-ruler-combined mr-1"></i>{property.area} sqm</span>
        </div>
        <div className="flex gap-2 pt-1"></div>
        {detailHref && (
          <div className="pt-2">
            <a
              className="btn btn-ghost w-full justify-center"
              href={detailHref}
              onClick={(e) => e.stopPropagation()}
            >
              Lihat Detail
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default PropertyCard;

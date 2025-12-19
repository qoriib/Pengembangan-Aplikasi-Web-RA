const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const PropertyCard = ({ property, favorite, onFavorite, onInquiry }) => {
  return (
    <article className="property-card">
      <div
        className="property-card__image"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.35)), url(${property.photoUrl})` }}
        role="img"
        aria-label={property.title}
      >
        <div className="property-card__badge">{property.type}</div>
        {favorite && <div className="property-card__favorite">★</div>}
      </div>
      <div className="property-card__body">
        <div className="property-card__title">{property.title}</div>
        <div className="property-card__location">{property.location}</div>
        <div className="property-card__price">{formatPrice(property.price)}</div>
        <div className="property-card__meta">
          <span>{property.beds} bd</span>
          <span>{property.baths} ba</span>
          <span>{property.area} sqm</span>
        </div>
        <div className="property-card__actions">
          {onFavorite && (
            <button className="btn small" onClick={() => onFavorite(property.id)}>
              {favorite ? 'Favorited' : 'Save favorite'}
            </button>
          )}
          {onInquiry && (
            <button className="btn ghost small" onClick={() => onInquiry(property.id)}>
              Inquiry
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;

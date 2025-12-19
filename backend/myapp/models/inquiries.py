from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from ..db import Base


class Inquiry(Base):
    """Messages from buyers to agents about a property."""

    __tablename__ = 'inquiries'

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    buyer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    message = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    property = relationship('Property', back_populates='inquiries')
    buyer = relationship('User', back_populates='inquiries', foreign_keys=[buyer_id])

    def to_dict(self):
        """Serialize inquiry content and meta."""
        return {
            'id': self.id,
            'property_id': self.property_id,
            'buyer_id': self.buyer_id,
            'message': self.message,
            'date': self.date.isoformat() if self.date else None,
            'property_title': self.property.title if self.property else None,
            'property_location': self.property.location if self.property else None,
            'buyer_name': self.buyer.name if self.buyer else None,
            'buyer_email': self.buyer.email if self.buyer else None,
            'buyer_phone': self.buyer.phone if self.buyer else None,
        }

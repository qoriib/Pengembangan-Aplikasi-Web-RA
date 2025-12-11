from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPForbidden
from ..db import DBSession
from ..models import Property, PropertyPhoto
from ..security import require_auth, require_role
import transaction

@view_config(route_name='properties', renderer='json', request_method='GET')
def list_properties(request):
    """Get all properties with optional filters"""
    query = DBSession.query(Property)
    
    # Apply filters
    if 'type' in request.params:
        query = query.filter(Property.type == request.params['type'])
    if 'location' in request.params:
        query = query.filter(Property.location.ilike(f"%{request.params['location']}%"))
    if 'min_price' in request.params:
        query = query.filter(Property.price >= float(request.params['min_price']))
    if 'max_price' in request.params:
        query = query.filter(Property.price <= float(request.params['max_price']))
    if 'bedrooms' in request.params:
        query = query.filter(Property.bedrooms >= int(request.params['bedrooms']))
    if 'bathrooms' in request.params:
        query = query.filter(Property.bathrooms >= int(request.params['bathrooms']))
    if 'agent_id' in request.params:
        query = query.filter(Property.agent_id == int(request.params['agent_id']))
    
    # Order by
    query = query.order_by(Property.created_at.desc())
    
    properties = query.all()
    
    return {
        'success': True,
        'count': len(properties),
        'properties': [prop.to_dict(include_photos=True) for prop in properties]
    }

@view_config(route_name='property_detail', renderer='json', request_method='GET')
def get_property(request):
    """Get single property by ID"""
    property_id = request.matchdict['id']
    
    property = DBSession.query(Property).filter(Property.id == property_id).first()
    
    if not property:
        raise HTTPNotFound('Property not found')
    
    return {
        'success': True,
        'property': property.to_dict(include_photos=True)
    }

@view_config(route_name='create_property', renderer='json', request_method='POST')
@require_role('agent', 'admin')
def create_property(request):
    """Create new property (agent/admin only)"""
    try:
        data = request.json_body

        required_fields = ['title', 'price', 'type', 'location']
        for field in required_fields:
            if field not in data:
                raise HTTPBadRequest(f'Missing required field: {field}')

        valid_types = ['house', 'apartment', 'land', 'commercial']
        if data['type'] not in valid_types:
            raise HTTPBadRequest(f'Invalid type. Must be one of: {", ".join(valid_types)}')

        property = Property(
            agent_id=request.current_user.id,
            title=data['title'],
            description=data.get('description'),
            price=data['price'],
            type=data['type'],
            location=data['location'],
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            area=data.get('area')
        )

        DBSession.add(property)
        DBSession.flush()  # <-- property.id terisi, object masih connected

        # Add photos
        if 'photos' in data:
            for url in data['photos']:
                photo = PropertyPhoto(property_id=property.id, photo_url=url)
                DBSession.add(photo)

        # SERIALIZE DI SINI — sebelum commit
        response_data = property.to_dict(include_photos=True)

        transaction.commit()

        return {
            "success": True,
            "message": "Property created successfully",
            "property": response_data
        }

    except Exception as e:
        transaction.abort()
        raise HTTPBadRequest(str(e))

@view_config(route_name='update_property', renderer='json', request_method='PUT')
@require_auth
def update_property(request):
    """Update property"""
    try:
        property_id = request.matchdict['id']
        data = request.json_body
        
        property = DBSession.query(Property).filter(Property.id == property_id).first()
        
        if not property:
            raise HTTPNotFound('Property not found')
        
        # Check permission
        if request.current_user.role != 'admin' and property.agent_id != request.current_user.id:
            raise HTTPForbidden('You do not have permission to update this property')
        
        # Update fields
        if 'title' in data:
            property.title = data['title']
        if 'description' in data:
            property.description = data['description']
        if 'price' in data:
            property.price = data['price']
        if 'type' in data:
            valid_types = ['house', 'apartment', 'land', 'commercial']
            if data['type'] not in valid_types:
                raise HTTPBadRequest(f'Invalid type. Must be one of: {", ".join(valid_types)}')
            property.type = data['type']
        if 'location' in data:
            property.location = data['location']
        if 'bedrooms' in data:
            property.bedrooms = data['bedrooms']
        if 'bathrooms' in data:
            property.bathrooms = data['bathrooms']
        if 'area' in data:
            property.area = data['area']
        
        transaction.commit()
        
        return {
            'success': True,
            'message': 'Property updated successfully',
            'property': property.to_dict(include_photos=True)
        }
        
    except (HTTPNotFound, HTTPForbidden, HTTPBadRequest):
        raise
    except Exception as e:
        transaction.abort()
        raise HTTPBadRequest(str(e))

@view_config(route_name='delete_property', renderer='json', request_method='DELETE')
@require_auth
def delete_property(request):
    """Delete property"""
    try:
        property_id = request.matchdict['id']
        
        property = DBSession.query(Property).filter(Property.id == property_id).first()
        
        if not property:
            raise HTTPNotFound('Property not found')
        
        # Check permission
        if request.current_user.role != 'admin' and property.agent_id != request.current_user.id:
            raise HTTPForbidden('You do not have permission to delete this property')
        
        DBSession.delete(property)
        transaction.commit()
        
        return {
            'success': True,
            'message': 'Property deleted successfully'
        }
        
    except (HTTPNotFound, HTTPForbidden):
        raise
    except Exception as e:
        transaction.abort()
        raise HTTPBadRequest(str(e))

@view_config(route_name='add_photo', renderer='json', request_method='POST')
@require_auth
def add_property_photo(request):
    """Add photo to property"""
    try:
        property_id = request.matchdict['id']
        data = request.json_body
        
        if 'photo_url' not in data:
            raise HTTPBadRequest('photo_url is required')
        
        property = DBSession.query(Property).filter(Property.id == property_id).first()
        
        if not property:
            raise HTTPNotFound('Property not found')
        
        # Check permission
        if request.current_user.role != 'admin' and property.agent_id != request.current_user.id:
            raise HTTPForbidden('You do not have permission to add photos to this property')
        
        photo = PropertyPhoto(
            property_id=property_id,
            photo_url=data['photo_url']
        )
        
        DBSession.add(photo)
        transaction.commit()
        
        return {
            'success': True,
            'message': 'Photo added successfully',
            'photo': photo.to_dict()
        }
        
    except (HTTPNotFound, HTTPForbidden, HTTPBadRequest):
        raise
    except Exception as e:
        transaction.abort()
        raise HTTPBadRequest(str(e))

@view_config(route_name='delete_photo', renderer='json', request_method='DELETE')
@require_auth
def delete_property_photo(request):
    """Delete property photo"""
    try:
        photo_id = request.matchdict['photo_id']
        
        photo = DBSession.query(PropertyPhoto).filter(PropertyPhoto.id == photo_id).first()
        
        if not photo:
            raise HTTPNotFound('Photo not found')
        
        property = photo.property
        
        # Check permission
        if request.current_user.role != 'admin' and property.agent_id != request.current_user.id:
            raise HTTPForbidden('You do not have permission to delete this photo')
        
        DBSession.delete(photo)
        transaction.commit()
        
        return {
            'success': True,
            'message': 'Photo deleted successfully'
        }
        
    except (HTTPNotFound, HTTPForbidden):
        raise
    except Exception as e:
        transaction.abort()
        raise HTTPBadRequest(str(e))
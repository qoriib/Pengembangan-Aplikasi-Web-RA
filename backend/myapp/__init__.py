from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .db import DBSession, initialize_sql
import os

def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    
    # Create database engine
    engine = engine_from_config(settings, 'sqlalchemy.')
    initialize_sql(engine)
    
    # Create Pyramid configuration
    config = Configurator(settings=settings)
    
    # Add CORS support
    config.add_tween('myapp.tweens.cors_tween_factory')
    
    # Include routes
    config.include('.routes')
    
    # Scan for view configurations
    config.scan('.views')
    
    return config.make_wsgi_app()

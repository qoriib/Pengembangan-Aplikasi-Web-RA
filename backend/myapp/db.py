from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import register

# Disable expire_on_commit → FIX DetachedInstanceError
DBSession = scoped_session(
    sessionmaker(expire_on_commit=False)
)

Base = declarative_base()


def initialize_sql(engine):
    DBSession.configure(bind=engine)
    register(DBSession)   # integrate with Pyramid transaction manager
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)

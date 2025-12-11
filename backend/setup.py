from setuptools import setup, find_packages

requires = [
    'pyramid',
    'SQLAlchemy',
    'psycopg2-binary',
    'zope.sqlalchemy',
    'pyramid_tm',
    'waitress',
    'PyJWT',
    'bcrypt',
    'transaction',
]

setup(
    name='myapp',
    version='0.1',
    description='Property Listing API',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='Your Name',
    author_email='your.email@example.com',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = myapp:main',
        ],
    },
)
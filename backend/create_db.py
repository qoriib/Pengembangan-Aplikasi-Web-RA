# -*- coding: utf-8 -*-
import psycopg2
from psycopg2 import sql
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

try:
    # Connect to default postgres database
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="123456",
        database="postgres"
    )
    
    # Check if listingdb exists
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname='listingdb'")
    exists = cur.fetchone()
    
    if exists:
        print("[INFO] Database 'listingdb' already exists")
    else:
        print("[INFO] Database 'listingdb' does not exist")
        print("[ACTION] Creating database 'listingdb'...")
        
        # Close current connection
        cur.close()
        conn.close()
        
        # Reconnect with autocommit to create database
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="123456",
            database="postgres"
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("CREATE DATABASE listingdb")
        print("[SUCCESS] Database 'listingdb' created successfully!")
        cur.close()
        conn.close()
        
        # Reconnect to new database to verify
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="123456",
            database="listingdb"
        )
        print("[SUCCESS] Connected to 'listingdb'")
    
    # Connect to listingdb and check tables
    if not exists:
        cur = conn.cursor()
    else:
        cur.close()
        conn.close()
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="123456",
            database="listingdb"
        )
        cur = conn.cursor()
    
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    tables = cur.fetchall()
    
    if tables:
        print(f"\nExisting tables in 'listingdb':")
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("\n[INFO] No tables found in database (migration needed)")
    
    cur.close()
    conn.close()
    
    print("\n" + "=" * 50)
    print("[RESULT] Database setup successful!")
    print("=" * 50)
    
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)

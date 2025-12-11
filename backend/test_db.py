
# -*- coding: utf-8 -*-
import psycopg2
from psycopg2 import sql
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

# Try user's password
passwords = ["12356", "123456"]

print("Testing PostgreSQL connection...")
print("-" * 50)

connected = False
working_password = None

for pwd in passwords:
    try:
        print(f"Trying password: '{pwd if pwd else '(empty)'}'...")
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password=pwd,
            database="postgres"  # Connect to default database first
        )
        print(f"[SUCCESS] Connected with password: '{pwd if pwd else '(empty)'}'")
        working_password = pwd
        connected = True
        
        # Check if listingdb exists
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname='listingdb'")
        exists = cur.fetchone()
        
        if exists:
            print("[INFO] Database 'listingdb' already exists")
            # Connect to listingdb
            cur.close()
            conn.close()
            
            conn = psycopg2.connect(
                host="localhost",
                port=5432,
                user="postgres",
                password=pwd,
                database="listingdb"
            )
            cur = conn.cursor()
            
            # List tables
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
                print("\n[INFO] No tables found in database (needs migration)")
        else:
            print("[INFO] Database 'listingdb' does not exist")
            print("[ACTION] Creating database 'listingdb'...")
            conn.autocommit = True
            cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier("listingdb")))
            print("[SUCCESS] Database 'listingdb' created successfully")
        
        cur.close()
        conn.close()
        break
        
    except psycopg2.OperationalError as e:
        if "password authentication failed" in str(e):
            print(f"[FAILED] Wrong password")
        else:
            print(f"[ERROR] {e}")
        continue
    except Exception as e:
        print(f"[ERROR] {e}")
        continue

print("-" * 50)
if connected:
    print(f"\n[RESULT] PostgreSQL is accessible")
    print(f"[RESULT] Working password: '{working_password if working_password else '(empty)'}'")
    print(f"\n[NEXT STEP] Update development.ini with the correct password if needed")
else:
    print("\n[RESULT] Could not connect to PostgreSQL")
    print("[ACTION] Please check PostgreSQL password or reset it")

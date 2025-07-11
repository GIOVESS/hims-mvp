#!/usr/bin/env python
"""
Script to run Django migrations
"""
import os
import sys
import subprocess

def run_migrations():
    # Change to the project directory
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(project_dir)
    
    print("Running Django migrations...")
    
    try:
        # Make migrations
        print("Creating migrations...")
        subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
        
        # Apply migrations
        print("Applying migrations...")
        subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
        
        print("Migrations completed successfully!")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running migrations: {e}")
        return False
    
    return True

if __name__ == '__main__':
    run_migrations()

#!/usr/bin/env python
"""
Script to run the Django development server
"""
import os
import sys
import subprocess

def run_server():
    # Change to the project directory
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(project_dir)
    
    print("Starting Django development server...")
    print("Server will be available at: http://localhost:8000")
    print("Admin interface: http://localhost:8000/admin")
    print("API endpoints: http://localhost:8000/api/")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        # Run the Django development server
        subprocess.run([sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except subprocess.CalledProcessError as e:
        print(f"Error running server: {e}")

if __name__ == '__main__':
    run_server()

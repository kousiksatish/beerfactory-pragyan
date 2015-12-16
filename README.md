# BEER FACTORY
Game for Pragyan

### Build Instructions
1. Clone the repository and move into that directory
2. Create a virtual environment by `virtualenv env`
3. Activate the virtual environment `source env/bin/activate`
4. Run `pip -r requirements.txt` to install requirements
5. Set environment variables for MySQL database configuration by executing 
    - `export DB_USER = <user>` 
    - `export DB_PASSWORD = <password>` 
    - `export DB_NAME = <name>`
6. Change directory to beerf 
7. Run `python manage.py migrate` to initiate the database
8. Run `python manage.py runserver` to start local development server

# BEER FACTORY
Game for Pragyan

### Build Instructions
1. Clone the repository and move into that directory
2. Create a virtual environment by `virtualenv env`
3. Activate the virtual environment `source env/bin/activate`
4. Run `pip install -r requirements.txt` to install requirements
5.Change directory to beerf
6.Create a file called .env and add environment variables for MySQL Database
    - `DB_USER=<user>` 
    - `DB_PASSWORD=<password>` 
    - `DB_NAME=<name>`
8. Run python manage.py migrate to initiate the database  
7. run `python manage.py runserver` to start local development server

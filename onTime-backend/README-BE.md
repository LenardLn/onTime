To start he project successfully:

-- Important! steps marked with `\*` should be done one time only or if dependencies change

1. Navigate to root backend folder
   cd onTime-backend

2.\* Create venv for Python on MacOS
python3 -m venv venv

3.\* Activate the venv
source venv/bin/activate --- MacOS
venv\scripts\activate --- Windows

If successfull, you should see `(venv)` in the terminal OR
Your python interperter (bottom right on the main.py) should say something like this when clicking on it:
`Python v3.x.x (Python-randomString) ~ \.virtualenvs\Python...`

4.\* Install dependencies if necessary
pip install -r requirements.txt

5. To start the project (--reload flag watches for any saved changes to reload the docs and update endpoints)
   uvicorn main:app --reload

6. Navigate to
   http://127.0.0.1:8000/

7. Access Swagger docs and endpoint list
   http://127.0.0.1:8000/docs

Happy codin`👋

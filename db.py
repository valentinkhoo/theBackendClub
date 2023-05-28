from sqlalchemy import create_engine

CONNSTR = f'postgresql://bandytan:FrsUu0RSWI8i@ep-young-fire-842391.ap-southeast-1.aws.neon.tech/neondb'

engine = create_engine(CONNSTR)

try:
    with engine.connect() as connection:
        print("Connected to Neon DB successfully!")
except Exception as e:
    print("Connection to Neon DB failed:", str(e))

# You can set the password to None if it is specified in a ~/.pgpass file
# USERNAME = "bandytan"
# PASSWORD = ""
# HOST = "pg.neon.tech"
# PORT = "5432"
# PROJECT = "neondb"

# conn = psycopg2.connect(
#  host=HOST,
#  port=PORT,
#  user=USERNAME,
#  password=PASSWORD,
#  database=PROJECT)

# with conn.cursor() as cur:
#  cur.execute("SELECT 'hello neon';")
#  print(cur.fetchall())
CREATE_BUS = """
    INSERT INTO buses (name)
    VALUES (:name)
"""


GET_ALL_BUSES = """
    SELECT id, name 
    FROM buses
"""

import requests
import os
from pathlib import Path
import time

from bottle import route, run, request, get, HTTPResponse
import json


districts = ['Абдулинский', 'Адамовский', 'Акбулакский', 'Александровский', 'Асекеевский', 'Беляевский', 'Бугурусланский', 'Бузулукский', 
             'Гайский', 'Грачевский', 'Домбаровский', 'Илекский', 'Кваркенский', 'Красногвардейский', 'Кувандыкский', 'Курманаевский', 
             'Матвеевский', 'Новоорский', 'Новосергиевский', 'Октябрьский', 'Оренбургский', 'Первомайский', 'Переволоцкий', 'Пономаревский', 
             'Сакмарский', 'Саракташский', 'Светлинский', 'Северный', 'Соль-Илецкий', 'Сорочинский', 'Ташлинский', 'Тоцкий', 'Тюльганский', 'Шарлыкский', 'Ясненский']

cities = ['Орск', 'Бугуруслан', 'Бузулук', 'Медногорск', 'Новотроицк', 'городской округ Оренбург', 'городской округ Медногорск', 'городской округ Новотроицк', 'ЗАТО Комаровский', 'городской округ Орск', 'городской округ Бугуруслан', 'городской округ Бузулук']

others = ['Абдулинский городской округ', 'городской округ Оренбург', 'городской округ Медногорск']

for district in districts:
    p = Path(__file__)
    output_file = Path(str(p.parent) + '/data/' + district + '.json')
    if not output_file.exists():
        response = requests.get('https://nominatim.openstreetmap.org/search?format=json&q=' 
        + district +'%20район,%20%D0%9E%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3&polygon_geojson=1')
        print(district, response.status_code)

        if response.status_code == 200:
            output_file.parent.mkdir(exist_ok=True, parents=True)
            output_file.write_text(response.text)
            
            time.sleep(3)
        else:
            print(district, 'data not available!!!')
            
for city in cities:
    p = Path(__file__)
    output_file = Path(str(p.parent) + '/data/' + city + '.json')
    if not output_file.exists():
        response = requests.get('https://nominatim.openstreetmap.org/search?format=json&q=' 
        + city + ',%20%D0%9E%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3&polygon_geojson=1')
        print(city, response.status_code)

        if response.status_code == 200:
            output_file.parent.mkdir(exist_ok=True, parents=True)
            output_file.write_text(response.text)
            
            time.sleep(3)
        else:
            print(city, 'data not available!!!')


@route('/district')
def hello():
    district = request.query.district
    
    p = Path(__file__)
    output_file = Path(str(p.parent) + '/data/' + district + '.json')
    f = open (output_file, "r")
    
    # Reading from file
    data = json.loads(f.read())
    return HTTPResponse(status=200, body=json.dumps(data), headers={'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'})


run(host='localhost', port=8080, debug=True)
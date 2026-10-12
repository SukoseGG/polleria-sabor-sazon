from flask import Flask, render_template, jsonify

app = Flask(__name__)

MENU_DATA = {
    "brasas": [
        {"id": "b1", "nombre": "1 Pollo a la Brasa", "precio": 60.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "b2", "nombre": "1/2 Pollo a la Brasa", "precio": 30.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "b3", "nombre": "1/4 Pollo a la Brasa", "precio": 18.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "b4", "nombre": "1/8 Pollo a la Brasa", "precio": 10.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "b5", "nombre": "Mostrito", "precio": 16.00, "desc": "1/8 Pollo + Papas + Ensalada + Cremas + Chaufa"},
        {"id": "b6", "nombre": "Chaufa Brasa", "precio": 25.00, "desc": "1/4 Pollo + Papas + Ensalada + Cremas"}
    ],
    "alitas": [
        {"id": "a1", "nombre": "Alitas Clásicas", "precio": 16.00, "desc": "4 Alitas + Papas + Ensalada + Cremas"},
        {"id": "a2", "nombre": "Alitas BBQ", "precio": 18.00, "desc": "4 Alitas + Papas + Ensalada + Cremas"},
        {"id": "a3", "nombre": "Alitas Acevichadas", "precio": 18.00, "desc": "4 Alitas + Papas + Ensalada + Cremas"},
        {"id": "a4", "nombre": "Chaufa Alitas", "precio": 25.00, "desc": "4 Alitas + Chaufa + Papas + Ensalada + Cremas"}
    ],
    "broaster": [
        {"id": "br1", "nombre": "Broaster", "precio": 10.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "br2", "nombre": "Broaster Especial", "precio": 12.00, "desc": "Papas + Arroz Blanco + Ensalada + Cremas"},
        {"id": "br3", "nombre": "Broaster Chaufa", "precio": 15.00, "desc": "Chaufa + Papas + Ensalada + Cremas"}
    ],
    "a_la_carta": [
        {"id": "c1", "nombre": "Chaufa Simple", "precio": 10.00, "desc": ""},
        {"id": "c2", "nombre": "Caldo de Gallina", "precio": 12.00, "desc": ""},
        {"id": "c3", "nombre": "Milanesa", "precio": 12.00, "desc": ""},
        {"id": "c4", "nombre": "Pollo a la Coca Cola", "precio": 12.00, "desc": ""},
        {"id": "c5", "nombre": "Chaufa Pollo", "precio": 15.00, "desc": ""},
        {"id": "c6", "nombre": "Chuleta", "precio": 15.00, "desc": ""},
        {"id": "c7", "nombre": "Lomo Saltado", "precio": 15.00, "desc": ""}
    ],
    "burguers": [
        {"id": "bg1", "nombre": "Chorizo", "precio": 6.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "bg2", "nombre": "Pollo Brasa", "precio": 7.00, "desc": "Papas + Ensalada + Cremas"},
        {"id": "bg3", "nombre": "Carne", "precio": 8.00, "desc": "Chorizo + Papas + Ensalada + Cremas"},
        {"id": "bg4", "nombre": "Royal", "precio": 10.00, "desc": "Carne + Huevo + Queso + Papas + Ensalada + Cremas"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/productos')
def get_productos():
    return jsonify(MENU_DATA)

if __name__ == '__main__':
    app.run(debug=True)
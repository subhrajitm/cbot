from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    # Placeholder for chat API
    data = request.get_json()
    return jsonify({"message": "Chat endpoint placeholder"})

@app.route('/api/process/<process_type>', methods=['POST'])
def process_request(process_type):
    # Placeholder for process API
    data = request.get_json()
    return jsonify({"message": f"Process {process_type} endpoint placeholder"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 
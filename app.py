from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import json
from datetime import datetime
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# In-memory storage for demo purposes (use database in production)
conversations = {}
user_sessions = {}

@app.route('/')
def index():
    """Main application route"""
    return render_template('index.html')

@app.route('/cms')
def cms():
    """CMS route"""
    return render_template('cms/index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        process_type = data.get('process_type')
        session_id = data.get('session_id')
        
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Initialize session if not exists
        if session_id not in user_sessions:
            user_sessions[session_id] = {
                'messages': [],
                'current_process': None,
                'process_data': {}
            }
        
        session = user_sessions[session_id]
        
        # Add user message to session
        session['messages'].append({
            'content': message,
            'sender': 'user',
            'timestamp': datetime.now().isoformat()
        })
        
        # Process the message based on process type
        response = process_message(message, process_type, session)
        
        # Add AI response to session
        session['messages'].append({
            'content': response,
            'sender': 'ai',
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'response': response,
            'session_id': session_id,
            'process_type': process_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file uploads"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        allowed_extensions = {'.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.xlsx', '.xls', '.csv'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            return jsonify({'error': 'File type not supported'}), 400
        
        # Save file
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'filename': filename,
            'original_name': file.filename,
            'size': os.path.getsize(filepath)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get conversation history"""
    session_id = request.args.get('session_id')
    
    if session_id and session_id in user_sessions:
        return jsonify({
            'messages': user_sessions[session_id]['messages']
        })
    
    return jsonify({'messages': []})

@app.route('/api/process/<process_type>', methods=['POST'])
def start_process(process_type):
    """Start a specific process"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Initialize session
        if session_id not in user_sessions:
            user_sessions[session_id] = {
                'messages': [],
                'current_process': None,
                'process_data': {}
            }
        
        session = user_sessions[session_id]
        session['current_process'] = process_type
        
        # Get initial response based on process type
        initial_response = get_process_initial_response(process_type)
        
        # Add AI response to session
        session['messages'].append({
            'content': initial_response,
            'sender': 'ai',
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'response': initial_response,
            'session_id': session_id,
            'process_type': process_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_message(message, process_type, session):
    """Process user message based on process type"""
    if process_type == 'feasibility':
        return process_feasibility(message, session)
    elif process_type == 'assistance':
        return process_assistance(message, session)
    elif process_type == 'exception':
        return process_exception(message, session)
    elif process_type == 'esm':
        return process_esm(message, session)
    elif process_type == 'historical':
        return process_historical(message, session)
    else:
        return process_general_query(message, session)

def get_process_initial_response(process_type):
    """Get initial response for each process type"""
    responses = {
        'feasibility': "I'll help you assess whether you need to raise a DR. Please provide details about your case, including:\n\n• What issue are you experiencing?\n• When did it start?\n• What systems are affected?\n• What is the business impact?",
        'assistance': "I'm here to help you raise a DR. Let me guide you through the process. Please tell me:\n\n• What type of issue are you dealing with?\n• What systems or services are affected?\n• What is the severity level?",
        'exception': "I'll help you manage exception data. Please specify:\n\n• What type of exception are you looking for?\n• What time period?\n• Any specific criteria?",
        'esm': "I'll help you get a detailed ESM summary. Please provide:\n\n• What specific information do you need?\n• What time period?\n• Any particular systems or services?",
        'historical': "I'll help you review past incidents. Please specify:\n\n• What time period are you interested in?\n• Any specific type of incidents?\n• Any particular systems or services?"
    }
    return responses.get(process_type, "How can I help you today?")

def process_feasibility(message, session):
    """Process DR feasibility assessment"""
    # This would integrate with actual DR assessment logic
    return f"Based on your description: '{message}', I'm analyzing the feasibility of raising a DR. This appears to be a legitimate case that may require a DR. Let me gather more information to provide a complete assessment."

def process_assistance(message, session):
    """Process DR assistance"""
    return f"I understand you need help with: '{message}'. I'll guide you through the DR process step by step. Let me prepare the necessary forms and procedures for you."

def process_exception(message, session):
    """Process exception list queries"""
    return f"I'm searching for exceptions related to: '{message}'. Here are the relevant exception records I found in the system."

def process_esm(message, session):
    """Process ESM queries"""
    return f"I'm retrieving ESM data for: '{message}'. Here's a detailed summary of the ESM information you requested."

def process_historical(message, session):
    """Process historical DR queries"""
    return f"I'm searching historical DR records for: '{message}'. Here are the past incidents that match your criteria."

def process_general_query(message, session):
    """Process general queries"""
    return f"I understand you're asking about: '{message}'. Let me help you with that. Could you provide more specific details so I can assist you better?"

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 
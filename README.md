# DR Assistant - Flask Application

A modern Disaster Recovery (DR) Assistant application built with Flask, providing an intelligent interface for DR feasibility assessment, assistance, exception management, ESM queries, and historical data analysis.

## Features

- **DR Feasibility Assessment**: Determine whether you need to raise a DR for your case
- **DR Assistance**: Get help with raising DR tickets and following SOP procedures
- **Exception List Management**: Query and manage exception data
- **ESM Queries**: Get detailed ESM summaries and information
- **Historical DR Analysis**: Review past incidents with interactive charts
- **File Upload Support**: Attach documents and images for analysis
- **Voice Input**: Speech-to-text functionality for hands-free interaction
- **CMS Integration**: Case Management System for ticket creation and tracking

## Project Structure

```
cbot/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/            # Flask templates
│   ├── index.html       # Main application template
│   └── cms/
│       └── index.html   # CMS template
├── static/              # Static files
│   ├── css/
│   │   ├── styles.css   # Main styles
│   │   └── cms_style.css # CMS styles
│   └── js/
│       ├── script.js    # Main JavaScript
│       └── cms_script.js # CMS JavaScript
└── uploads/             # File upload directory (created automatically)
```

## Installation

1. **Clone or download the project**:
   ```bash
   git clone <repository-url>
   cd cbot
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Access the application**:
   - Main application: http://localhost:5000
   - CMS: http://localhost:5000/cms

## API Endpoints

- `GET /` - Main application page
- `GET /cms` - CMS page
- `POST /api/chat` - Handle chat messages
- `POST /api/process/<process_type>` - Start specific processes
- `POST /api/upload` - Handle file uploads
- `GET /api/history` - Get conversation history

## Usage

### Main Application
1. Open http://localhost:5000 in your browser
2. Choose from the available process types:
   - **DR Feasibility Assessment**: Evaluate if a DR is needed
   - **DR Assistance**: Get help with DR procedures
   - **Query Exception List**: Manage exception data
   - **Query ESM**: Get ESM information
   - **Historical DRs**: Review past incidents

### CMS (Case Management System)
1. Access via http://localhost:5000/cms
2. Fill out the case management form
3. Submit to create DR tickets

## Features in Detail

### Chat Interface
- Modern, responsive design with typing indicators
- File attachment support (PDF, DOC, images, etc.)
- Voice input capability
- Quick action buttons for common tasks

### Process Flows
- **Feasibility Assessment**: Guides through infrastructure analysis
- **DR Assistance**: Provides SOP procedures and ticket creation
- **Exception Management**: Query and manage exception records
- **ESM Queries**: Retrieve detailed ESM information
- **Historical Analysis**: Interactive charts showing DR trends

### File Management
- Support for multiple file types
- File size validation (10MB limit)
- Secure file storage in uploads directory

## Development

### Adding New Features
1. Update `app.py` with new routes and logic
2. Modify templates in `templates/` directory
3. Update static files in `static/` directory
4. Test thoroughly before deployment

### Customization
- Modify CSS in `static/css/` for styling changes
- Update JavaScript in `static/js/` for functionality
- Edit Flask routes in `app.py` for backend logic

## Security Notes

- Change the `SECRET_KEY` in `app.py` for production
- Implement proper authentication for production use
- Use a production WSGI server (e.g., Gunicorn)
- Set up proper file upload restrictions
- Consider using a database instead of in-memory storage

## Troubleshooting

### Common Issues
1. **Port already in use**: Change the port in `app.py`
2. **File upload errors**: Check uploads directory permissions
3. **Static files not loading**: Verify file paths in templates

### Debug Mode
The application runs in debug mode by default. For production, set `debug=False` in `app.py`.

## License

This project is for internal use. Please ensure compliance with your organization's policies.

## Support

For issues or questions, please contact your development team or create an issue in the project repository. 
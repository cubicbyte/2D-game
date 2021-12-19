from flask import Flask, send_file, send_from_directory
from python_modules.config_parser import get_config

app = Flask(__name__)
config = get_config('web_server.config', {
    'WEB_SERVER': {
        'Host': '0.0.0.0',
        'Port': '8080'
    }
})

@app.route('/<path:path>')
def send_static_file(path):
    index_of_dot = path.rfind('.')
    extension = path[index_of_dot + 1:]
    content_type = 'text/plain'

    content_types = {
        'js': 'text/javascript',
        'css': 'text/css'
    }

    if extension in content_types:
        content_type = content_types[extension]

    return send_from_directory('static', path, mimetype=content_type)

@app.route('/')
def main_page():
    return send_file('index.html')
    
if __name__ == '__main__':
    app.run(
        host = config['WEB_SERVER']['Host'],
        port = config['WEB_SERVER']['Port']
    )

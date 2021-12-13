from flask import Flask
from python_modules.config_parser import get_config

app = Flask(__name__)
config = get_config('web_server.config', {
    'WEB_SERVER': {
        'Host': '0.0.0.0',
        'Port': '8080'
    }
})

@app.route('/')
def main_page():
    return '<h1>Test</h1>'
    
if __name__ == '__main__':
    app.run(
        host = config['WEB_SERVER']['Host'],
        port = config['WEB_SERVER']['Port']
    )
from configparser import ConfigParser

def get_config(filepath, default_config):
    config = ConfigParser()
    config.read(filepath)

    def write_config():
        config_file = open(filepath, 'w', encoding='utf-8')
        config.write(config_file)
        config_file.close()

    is_write_config = False
    for title in default_config:
        if not title in config:
            print(f'No [{title}] config in file web_server.config. Using default config')

            is_write_config = True
            config[title] = {}

            for sub_title in default_config[title]:
                config[title][sub_title] = default_config[title][sub_title]

        else:
            for sub_title in default_config[title]:
                if not sub_title in config[title]:
                    config[title][sub_title] = default_config[title][sub_title]
                    is_write_config = True

    if is_write_config:
        write_config()

    return config
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def get_logger(include_thread_name: bool = False) -> logging.Logger:
    if include_thread_name:
        logging_format = '%(threadName)s %(asctime)s %(message)s'
        logging.basicConfig(level=logging.INFO, format=logging_format)
    return logger

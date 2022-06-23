import json
from typing import Any

from src._shared.util import logger_util

logger = logger_util.get_logger()


class EventHandler:
    pass


event_handler = EventHandler()


def handler(event: Any, context: Any) -> Any:
    logger.info("event: {}".format(json.dumps(event)))

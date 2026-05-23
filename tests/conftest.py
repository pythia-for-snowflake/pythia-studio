import functools
import http.server
import json
import threading
from pathlib import Path

import pytest

PORT = 18765
STUDIO_DIR = Path(__file__).parent.parent

_GIST_MOCKS = {
    "presets.json": [],
    "emojis.json": {},
    "emoji-keywords.json": {},
    "material-icons.json": {},
    "articles.json": [],
    "repos.json": [
        {"section": "products", "name": "snowflake-provider", "icon": "📦", "desc": "IaC engine.", "tag": "coming soon", "url": None, "active": False},
        {"section": "api", "name": "snowflake-kit", "icon": "🐍", "desc": "Pure Python.", "tag": "pdoc · api", "url": "https://pythia-for-snowflake.github.io/snowflake-kit/api/snowflake_kit.html", "active": True},
    ],
}


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass


@pytest.fixture(scope="session", autouse=True)
def static_server():
    handler = functools.partial(_QuietHandler, directory=str(STUDIO_DIR))
    server = http.server.HTTPServer(("127.0.0.1", PORT), handler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    yield f"http://127.0.0.1:{PORT}"
    server.shutdown()


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "viewport": {"width": 1280, "height": 800}}


@pytest.fixture(autouse=True)
def mock_external(page):
    def _gist(route):
        filename = route.request.url.rstrip("/").split("/")[-1]
        body = json.dumps(_GIST_MOCKS.get(filename, {}))
        route.fulfill(content_type="application/json", body=body)

    def _microlink(route):
        route.fulfill(
            content_type="application/json",
            body=json.dumps({"status": "success", "data": {"title": None, "description": None, "image": None}}),
        )

    page.route("https://gist.githubusercontent.com/**", _gist)
    page.route("https://api.microlink.io/**", _microlink)
    yield
